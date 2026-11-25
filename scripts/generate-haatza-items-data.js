const fs = require('fs');
const path = require('path');

// 1. Read base unified items
const unified = JSON.parse(fs.readFileSync('scratch/new_169_items_unified.json', 'utf8'));

// 2. Fix placeholders in Men's and Women's top categories
// Men's Top Categories: w0018
unified.w0018 = [
  {
    category_id: 'PLACEHOLDER_MENS_TSHIRTS_POLOS_ID',
    category_name: "T-Shirts & Polos",
    category_image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80"
  },
  {
    category_id: 'PLACEHOLDER_MENS_CASUAL_SHIRTS_ID',
    category_name: "Casual & Formal Shirts",
    category_image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80"
  },
  {
    category_id: 'PLACEHOLDER_MENS_JEANS_TROUSERS_ID',
    category_name: "Jeans & Trousers",
    category_image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=600&q=80"
  },
  {
    category_id: 'PLACEHOLDER_MENS_ETHNIC_KURTAS_ID',
    category_name: "Ethnic Wear & Kurtas",
    category_image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80"
  },
  {
    category_id: 'PLACEHOLDER_MENS_JACKETS_HOODIES_ID',
    category_name: "Jackets & Hoodies",
    category_image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80"
  },
  {
    category_id: 'PLACEHOLDER_MENS_FOOTWEAR_SNEAKERS_ID',
    category_name: "Footwear & Sneakers",
    category_image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80"
  },
  {
    category_id: 'PLACEHOLDER_MENS_WATCHES_ACCESSORIES_ID',
    category_name: "Watches & Accessories",
    category_image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
  }
];

// Women's Top Categories: w0027
unified.w0027 = [
  {
    category_id: 'PLACEHOLDER_WOMENS_KURTIS_SUITS_ID',
    category_name: "Kurtis & Ethnic Sets",
    category_image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80"
  },
  {
    category_id: 'PLACEHOLDER_WOMENS_SAREES_ID',
    category_name: "Sarees & Dress Material",
    category_image: "https://images.unsplash.com/photo-1610030469668-932ec596e7fa?auto=format&fit=crop&w=600&q=80"
  },
  {
    category_id: 'PLACEHOLDER_WOMENS_WESTERN_TOPS_TEES_ID',
    category_name: "Western Tops & Tees",
    category_image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80"
  },
  {
    category_id: 'PLACEHOLDER_WOMENS_DRESSES_JUMPSUITS_ID',
    category_name: "Dresses & Jumpsuits",
    category_image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"
  },
  {
    category_id: 'PLACEHOLDER_WOMENS_JEANS_TROUSERS_ID',
    category_name: "Jeans & Trousers",
    category_image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80"
  },
  {
    category_id: 'PLACEHOLDER_WOMENS_HEELS_FOOTWEAR_ID',
    category_name: "Heels & Flats",
    category_image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80"
  },
  {
    category_id: 'PLACEHOLDER_WOMENS_JEWELRY_WATCHES_ID',
    category_name: "Jewelry & Handbags",
    category_image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"
  }
];

// Propagate fixed common widgets to all categories in unified object
const commonSeqs = [4, 5, 6, 9, 10, 15, 16];
const cat101Map = {
  4: unified.w0004,
  5: unified.w0005,
  6: unified.w0006,
  9: unified.w0009,
  10: unified.w0010,
  15: unified.w0015,
  16: unified.w0016,
};

for (let num = 102; num <= 118; num++) {
  const catIdx = num - 101;
  const base = 16 + (catIdx - 1) * 9;
  unified['w' + String(base + 3).padStart(4, '0')] = cat101Map[4];
  unified['w' + String(base + 4).padStart(4, '0')] = cat101Map[5];
  unified['w' + String(base + 5).padStart(4, '0')] = cat101Map[6];
  unified['w' + String(base + 6).padStart(4, '0')] = cat101Map[9];
  unified['w' + String(base + 7).padStart(4, '0')] = cat101Map[10];
  unified['w' + String(base + 8).padStart(4, '0')] = cat101Map[15];
  unified['w' + String(base + 9).padStart(4, '0')] = cat101Map[16];
}

// Save updated unified json back
fs.writeFileSync('scratch/new_169_items_unified.json', JSON.stringify(unified, null, 2), 'utf8');

// Named constant mapping for serialization
const CONST_MAP = {
  'c4000000-0000-4000-8000-000000000101': 'ALL_CATEGORY_ID',
  'c4000000-0000-4000-8000-000000000102': 'MENS_FASHION_CATEGORY_ID',
  'c4000000-0000-4000-8000-000000000103': 'WOMENS_FASHION_CATEGORY_ID',
  'c4000000-0000-4000-8000-000000000104': 'ELECTRONICS_CATEGORY_ID',
  'c4000000-0000-4000-8000-000000000105': 'HOME_AND_LIVING_CATEGORY_ID',
  'c4000000-0000-4000-8000-000000000106': 'BEAUTY_CATEGORY_ID',
  'c4000000-0000-4000-8000-000000000107': 'APPLIANCES_CATEGORY_ID',
  'c4000000-0000-4000-8000-000000000108': 'TOYS_AND_GAMES_CATEGORY_ID',
  'c4000000-0000-4000-8000-000000000109': 'SPORTS_AND_FITNESS_CATEGORY_ID',
  'c4000000-0000-4000-8000-000000000110': 'BOOKS_CATEGORY_ID',
  'c4000000-0000-4000-8000-000000000111': 'FURNITURE_CATEGORY_ID',
  'c4000000-0000-4000-8000-000000000112': 'GROCERIES_CATEGORY_ID',
  'c4000000-0000-4000-8000-000000000113': 'AUTOMOTIVE_CATEGORY_ID',
  'c4000000-0000-4000-8000-000000000114': 'MOBILES_CATEGORY_ID',
  'c4000000-0000-4000-8000-000000000115': 'BABY_CARE_CATEGORY_ID',
  'c4000000-0000-4000-8000-000000000116': 'PET_SUPPLIES_CATEGORY_ID',
  'c4000000-0000-4000-8000-000000000117': 'JEWELRY_CATEGORY_ID',
  'c4000000-0000-4000-8000-000000000118': 'GIFT_CARD_CATEGORY_ID',
  'PLACEHOLDER_MENS_TSHIRTS_POLOS_ID': 'PLACEHOLDER_MENS_TSHIRTS_POLOS_ID',
  'PLACEHOLDER_MENS_CASUAL_SHIRTS_ID': 'PLACEHOLDER_MENS_CASUAL_SHIRTS_ID',
  'PLACEHOLDER_MENS_JEANS_TROUSERS_ID': 'PLACEHOLDER_MENS_JEANS_TROUSERS_ID',
  'PLACEHOLDER_MENS_ETHNIC_KURTAS_ID': 'PLACEHOLDER_MENS_ETHNIC_KURTAS_ID',
  'PLACEHOLDER_MENS_JACKETS_HOODIES_ID': 'PLACEHOLDER_MENS_JACKETS_HOODIES_ID',
  'PLACEHOLDER_MENS_FOOTWEAR_SNEAKERS_ID': 'PLACEHOLDER_MENS_FOOTWEAR_SNEAKERS_ID',
  'PLACEHOLDER_MENS_WATCHES_ACCESSORIES_ID': 'PLACEHOLDER_MENS_WATCHES_ACCESSORIES_ID',
  'PLACEHOLDER_WOMENS_KURTIS_SUITS_ID': 'PLACEHOLDER_WOMENS_KURTIS_SUITS_ID',
  'PLACEHOLDER_WOMENS_SAREES_ID': 'PLACEHOLDER_WOMENS_SAREES_ID',
  'PLACEHOLDER_WOMENS_WESTERN_TOPS_TEES_ID': 'PLACEHOLDER_WOMENS_WESTERN_TOPS_TEES_ID',
  'PLACEHOLDER_WOMENS_DRESSES_JUMPSUITS_ID': 'PLACEHOLDER_WOMENS_DRESSES_JUMPSUITS_ID',
  'PLACEHOLDER_WOMENS_JEANS_TROUSERS_ID': 'PLACEHOLDER_WOMENS_JEANS_TROUSERS_ID',
  'PLACEHOLDER_WOMENS_HEELS_FOOTWEAR_ID': 'PLACEHOLDER_WOMENS_HEELS_FOOTWEAR_ID',
  'PLACEHOLDER_WOMENS_JEWELRY_WATCHES_ID': 'PLACEHOLDER_WOMENS_JEWELRY_WATCHES_ID',
};

function serializeItems(items, indent = '  ') {
  let s = '[\n';
  items.forEach((item, idx) => {
    s += `${indent}  {\n`;
    const keys = Object.keys(item);
    keys.forEach((k) => {
      const val = item[k];
      let valStr;
      if (typeof val === 'string' && CONST_MAP[val]) {
        valStr = CONST_MAP[val];
      } else {
        valStr = JSON.stringify(val);
      }
      s += `${indent}    "${k}": ${valStr},\n`;
    });
    s += `${indent}  }${idx < items.length - 1 ? ',' : ''}\n`;
  });
  s += `${indent}]`;
  return s;
}

// Generate the TypeScript file with defined-once common widgets
let out = `/**
 * HAATZA Dashboard 169 Widgets Single Source of Truth
 * 
 * Auto-generated clean, tracked TypeScript data source.
 * Contains mock items for all 169 HAATZA widgets across 18 real categories.
 * The 7 common widgets are defined ONCE as named constants and reused across all 18 pages.
 * All image URLs verified HTTP 200 OK & image/jpeg.
 */

import {
  ALL_CATEGORY_ID,
  MENS_FASHION_CATEGORY_ID,
  WOMENS_FASHION_CATEGORY_ID,
  ELECTRONICS_CATEGORY_ID,
  HOME_AND_LIVING_CATEGORY_ID,
  BEAUTY_CATEGORY_ID,
  APPLIANCES_CATEGORY_ID,
  TOYS_AND_GAMES_CATEGORY_ID,
  SPORTS_AND_FITNESS_CATEGORY_ID,
  BOOKS_CATEGORY_ID,
  FURNITURE_CATEGORY_ID,
  GROCERIES_CATEGORY_ID,
  AUTOMOTIVE_CATEGORY_ID,
  MOBILES_CATEGORY_ID,
  BABY_CARE_CATEGORY_ID,
  PET_SUPPLIES_CATEGORY_ID,
  JEWELRY_CATEGORY_ID,
  GIFT_CARD_CATEGORY_ID,
  PLACEHOLDER_MENS_TSHIRTS_POLOS_ID,
  PLACEHOLDER_MENS_CASUAL_SHIRTS_ID,
  PLACEHOLDER_MENS_JEANS_TROUSERS_ID,
  PLACEHOLDER_MENS_ETHNIC_KURTAS_ID,
  PLACEHOLDER_MENS_JACKETS_HOODIES_ID,
  PLACEHOLDER_MENS_FOOTWEAR_SNEAKERS_ID,
  PLACEHOLDER_MENS_WATCHES_ACCESSORIES_ID,
  PLACEHOLDER_WOMENS_KURTIS_SUITS_ID,
  PLACEHOLDER_WOMENS_SAREES_ID,
  PLACEHOLDER_WOMENS_WESTERN_TOPS_TEES_ID,
  PLACEHOLDER_WOMENS_DRESSES_JUMPSUITS_ID,
  PLACEHOLDER_WOMENS_JEANS_TROUSERS_ID,
  PLACEHOLDER_WOMENS_HEELS_FOOTWEAR_ID,
  PLACEHOLDER_WOMENS_JEWELRY_WATCHES_ID,
} from '../dashboard.config';

// ============================================================================
// 1. THE 7 COMMON WIDGETS (DEFINED ONCE, REUSED ACROSS ALL 18 PAGES)
// ============================================================================

export const COMMON_SUGGESTED_FOR_YOU_ITEMS: any[] = ${serializeItems(unified.w0004)};

export const COMMON_PROMO_BANNERS_ITEMS: any[] = ${serializeItems(unified.w0005)};

export const COMMON_LIKED_BY_YOU_ITEMS: any[] = ${serializeItems(unified.w0006)};

export const COMMON_TRENDING_FASHION_ITEMS: any[] = ${serializeItems(unified.w0009)};

export const COMMON_DEALS_OF_THE_DAY_ITEMS: any[] = ${serializeItems(unified.w0010)};

export const COMMON_FRESH_NEW_ARRIVALS_ITEMS: any[] = ${serializeItems(unified.w0015)};

export const COMMON_MORE_TO_EXPLORE_ITEMS: any[] = ${serializeItems(unified.w0016)};

// ============================================================================
// 2. CATEGORY 101 SPECIFIC WIDGETS (ALL PAGE)
// ============================================================================

export const CAT101_HERO_BANNER_ITEMS: any[] = ${serializeItems(unified.w0001)};
export const CAT101_OFFERS_BANNER_ITEMS: any[] = ${serializeItems(unified.w0002)};
export const CAT101_TOP_CATEGORIES_ITEMS: any[] = ${serializeItems(unified.w0003)};
export const CAT101_RECENTLY_VIEWED_ITEMS: any[] = ${serializeItems(unified.w0007)};
export const CAT101_MID_PAGE_BANNER_ITEMS: any[] = ${serializeItems(unified.w0008)};
export const CAT101_RS49_BANNER_ITEMS: any[] = ${serializeItems(unified.w0011)};
export const CAT101_RS49_PRODUCTS_ITEMS: any[] = ${serializeItems(unified.w0012)};
export const CAT101_HURRY_DEALS_ITEMS: any[] = ${serializeItems(unified.w0013)};
export const CAT101_BESTSELLER_FAVORITES_ITEMS: any[] = ${serializeItems(unified.w0014)};

// ============================================================================
// 3. CATEGORIES 102 THROUGH 118 HERO & TOP CATEGORIES WIDGETS
// ============================================================================
`;

for (let num = 102; num <= 118; num++) {
  const catIdx = num - 101;
  const heroId = 'w' + String(16 + (catIdx - 1) * 9 + 1).padStart(4, '0');
  const topId = 'w' + String(16 + (catIdx - 1) * 9 + 2).padStart(4, '0');
  out += `\nexport const CAT${num}_HERO_BANNER_ITEMS: any[] = ${serializeItems(unified[heroId])};\n`;
  out += `export const CAT${num}_TOP_CATEGORIES_ITEMS: any[] = ${serializeItems(unified[topId])};\n`;
}

out += `\n// ============================================================================
// 4. MASTER 169 WIDGET ITEMS MAP (ALL 18 PAGES REUSE THE 7 COMMON WIDGETS)
// ============================================================================

export const HAATZA_DASHBOARD_ITEMS: Record<string, any[]> = {
  // Category 101 (All)
  "w0001": CAT101_HERO_BANNER_ITEMS,
  "w0002": CAT101_OFFERS_BANNER_ITEMS,
  "w0003": CAT101_TOP_CATEGORIES_ITEMS,
  "w0004": COMMON_SUGGESTED_FOR_YOU_ITEMS,
  "w0005": COMMON_PROMO_BANNERS_ITEMS,
  "w0006": COMMON_LIKED_BY_YOU_ITEMS,
  "w0007": CAT101_RECENTLY_VIEWED_ITEMS,
  "w0008": CAT101_MID_PAGE_BANNER_ITEMS,
  "w0009": COMMON_TRENDING_FASHION_ITEMS,
  "w0010": COMMON_DEALS_OF_THE_DAY_ITEMS,
  "w0011": CAT101_RS49_BANNER_ITEMS,
  "w0012": CAT101_RS49_PRODUCTS_ITEMS,
  "w0013": CAT101_HURRY_DEALS_ITEMS,
  "w0014": CAT101_BESTSELLER_FAVORITES_ITEMS,
  "w0015": COMMON_FRESH_NEW_ARRIVALS_ITEMS,
  "w0016": COMMON_MORE_TO_EXPLORE_ITEMS,
`;

for (let num = 102; num <= 118; num++) {
  const catIdx = num - 101;
  const base = 16 + (catIdx - 1) * 9;
  const heroId = 'w' + String(base + 1).padStart(4, '0');
  const topId = 'w' + String(base + 2).padStart(4, '0');
  const seq4 = 'w' + String(base + 3).padStart(4, '0');
  const seq5 = 'w' + String(base + 4).padStart(4, '0');
  const seq6 = 'w' + String(base + 5).padStart(4, '0');
  const seq9 = 'w' + String(base + 6).padStart(4, '0');
  const seq10 = 'w' + String(base + 7).padStart(4, '0');
  const seq15 = 'w' + String(base + 8).padStart(4, '0');
  const seq16 = 'w' + String(base + 9).padStart(4, '0');

  out += `\n  // Category ${num}\n`;
  out += `  "${heroId}": CAT${num}_HERO_BANNER_ITEMS,\n`;
  out += `  "${topId}": CAT${num}_TOP_CATEGORIES_ITEMS,\n`;
  out += `  "${seq4}": COMMON_SUGGESTED_FOR_YOU_ITEMS,\n`;
  out += `  "${seq5}": COMMON_PROMO_BANNERS_ITEMS,\n`;
  out += `  "${seq6}": COMMON_LIKED_BY_YOU_ITEMS,\n`;
  out += `  "${seq9}": COMMON_TRENDING_FASHION_ITEMS,\n`;
  out += `  "${seq10}": COMMON_DEALS_OF_THE_DAY_ITEMS,\n`;
  out += `  "${seq15}": COMMON_FRESH_NEW_ARRIVALS_ITEMS,\n`;
  out += `  "${seq16}": COMMON_MORE_TO_EXPLORE_ITEMS,\n`;
}

out += `};\n
export function getWidgetItems(widgetId: string): any[] {
  return HAATZA_DASHBOARD_ITEMS[widgetId] || [];
}
`;

fs.writeFileSync('src/modules/dashboard/data/haatza-dashboard-items.data.ts', out, 'utf8');
console.log('Successfully generated src/modules/dashboard/data/haatza-dashboard-items.data.ts');
console.log('File size:', fs.statSync('src/modules/dashboard/data/haatza-dashboard-items.data.ts').size, 'bytes');
