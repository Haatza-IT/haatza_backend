import { Injectable, Logger } from '@nestjs/common';
import { CACHE_DEFAULTS, ALLOWED_PLACEMENTS, type AllowedPlacement } from './dashboard.config';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

@Injectable()
export class DashboardCacheService {
  private readonly logger = new Logger(DashboardCacheService.name);
  private readonly cache = new Map<string, CacheEntry<any>>();
  private readonly inFlight = new Map<string, Promise<any>>();

  private readonly ttlMs: number;
  private readonly maxEntries: number;

  constructor() {
    this.ttlMs = (CACHE_DEFAULTS.TTL_SECONDS || 300) * 1000;
    this.maxEntries = CACHE_DEFAULTS.MAX_ENTRIES || 500;
    this.logger.log(`DashboardCacheService initialized (TTL: ${this.ttlMs / 1000}s, Max keys: ${this.maxEntries})`);
  }

  /**
   * Builds the standardized cache key
   * - HAATZA: dashboard:HAATZA:<placement>:<categoryId>:<territory>
   * - LITE:   dashboard:LITE:<placement>:<categoryId>:<territory>:<warehouseId>
   */
  public buildKey(
    module: string,
    placement: string,
    categoryId: string,
    territory: string,
    warehouseId?: string,
  ): string {
    const mod = module.toUpperCase().trim();
    const plc = (placement || '').toUpperCase().trim();
    const cat = categoryId.trim();
    const ter = territory.trim();
    if (mod === 'LITE') {
      const wh = (warehouseId || '').trim();
      return `dashboard:LITE:${plc}:${cat}:${ter}:${wh}`;
    }
    return `dashboard:HAATZA:${plc}:${cat}:${ter}`;
  }

  /**
   * Retrieves data from the cache if not expired.
   * Refreshes entry position in LRU order upon access.
   */
  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    // Refresh LRU order: delete and re-insert moves to the end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.data as T;
  }

  /**
   * Stores data in the cache with the configured TTL.
   * Evicts the least recently used (first) entry when capacity is reached.
   */
  public set<T>(key: string, data: T, customTtlMs?: number): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxEntries) {
      // Evict least recently used (first in iteration order)
      const lruKey = this.cache.keys().next().value;
      if (lruKey !== undefined) {
        this.cache.delete(lruKey);
      }
    }
    const expiresAt = Date.now() + (customTtlMs ?? this.ttlMs);
    this.cache.set(key, { data, expiresAt });
  }

  /**
   * Wraps an async loader function with in-flight request deduplication (cache stampede prevention).
   * Multiple concurrent requests for the same missing key share one single database resolution.
   */
  public async getOrSet<T>(key: string, loader: () => Promise<T>): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Check if another request is already resolving this exact key
    const existingPromise = this.inFlight.get(key);
    if (existingPromise) {
      return existingPromise as Promise<T>;
    }

    // Initiate new fetch and register in flight
    const promise = loader()
      .then((data) => {
        this.set(key, data);
        this.inFlight.delete(key);
        return data;
      })
      .catch((err) => {
        this.inFlight.delete(key);
        throw err;
      });

    this.inFlight.set(key, promise);
    return promise;
  }

  /**
   * Invalidates a specific cache key
   */
  public invalidateKey(key: string): void {
    this.cache.delete(key);
    this.inFlight.delete(key);
  }

  /**
   * Invalidates all cache keys for a given module and category across all allowed placements.
   */
  public invalidateCategory(module: string, categoryId: string): void {
    const mod = module.toUpperCase().trim();
    const cat = categoryId.trim();
    for (const key of Array.from(this.cache.keys())) {
      for (const plc of ALLOWED_PLACEMENTS) {
        if (key.startsWith(`dashboard:${mod}:${plc}:${cat}:`)) {
          this.cache.delete(key);
        }
      }
    }
  }

  /**
   * Invalidates all cache keys for a given module
   */
  public invalidateModule(module: string): void {
    const prefix = `dashboard:${module.toUpperCase().trim()}:`;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Flushes all cached dashboard responses
   */
  public clearAll(): void {
    this.cache.clear();
    this.inFlight.clear();
    this.logger.log('Dashboard cache cleared completely');
  }

  /**
   * Current number of cached keys (for metrics / testing)
   */
  public get size(): number {
    return this.cache.size;
  }
}
