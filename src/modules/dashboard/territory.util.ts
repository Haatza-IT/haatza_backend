/**
 * Territory Mapping Utility for the 28 States of India
 *
 * Implements PIN-code prefix matching using 2-digit and 3-digit prefixes.
 * Excludes Union Territories (Delhi, J&K, Ladakh, Puducherry, Chandigarh, Andaman & Nicobar, Lakshadweep, DNH & DD).
 * Applies longest-prefix match (e.g., 403 for Goa over 40 for Maharashtra).
 * Handles shared ranges (80-85 for Bihar & Jharkhand; 20-28 for UP & Uttarakhand).
 */

export interface StateTerritoryDefinition {
  state: string;
  states: string[];
  isShared: boolean;
  prefixes: string[]; // explicit prefixes (e.g. ['56', '57', '58', '59'] or ['403'])
}

export interface TerritoryResolution {
  isValid: boolean;
  prefix: string;
  primaryState: string;
  states: string[];
  isShared: boolean;
}

// 1. Special 3-Digit State Prefixes (Checked First - Longest Prefix Match)
export const SPECIAL_THREE_DIGIT_STATES: StateTerritoryDefinition[] = [
  {
    state: 'Goa',
    states: ['Goa'],
    isShared: false,
    prefixes: ['403'],
  },
  {
    state: 'Sikkim',
    states: ['Sikkim'],
    isShared: false,
    prefixes: ['737'],
  },
  {
    state: 'Arunachal Pradesh',
    states: ['Arunachal Pradesh'],
    isShared: false,
    prefixes: ['790', '791', '792'],
  },
  {
    state: 'Meghalaya',
    states: ['Meghalaya'],
    isShared: false,
    prefixes: ['793', '794'],
  },
  {
    state: 'Manipur',
    states: ['Manipur'],
    isShared: false,
    prefixes: ['795'],
  },
  {
    state: 'Mizoram',
    states: ['Mizoram'],
    isShared: false,
    prefixes: ['796'],
  },
  {
    state: 'Nagaland',
    states: ['Nagaland'],
    isShared: false,
    prefixes: ['797', '798'],
  },
  {
    state: 'Tripura',
    states: ['Tripura'],
    isShared: false,
    prefixes: ['799'],
  },
];

// 2. Two-Digit State Prefixes and Shared Ranges (28 States)
export const TWO_DIGIT_STATES: StateTerritoryDefinition[] = [
  {
    state: 'Haryana',
    states: ['Haryana'],
    isShared: false,
    prefixes: ['12', '13'],
  },
  {
    state: 'Punjab',
    states: ['Punjab'],
    isShared: false,
    prefixes: ['14', '15'],
  },
  {
    state: 'Himachal Pradesh',
    states: ['Himachal Pradesh'],
    isShared: false,
    prefixes: ['17'],
  },
  {
    state: 'Uttar Pradesh & Uttarakhand',
    states: ['Uttar Pradesh', 'Uttarakhand'],
    isShared: true,
    prefixes: ['20', '21', '22', '23', '24', '25', '26', '27', '28'],
  },
  {
    state: 'Rajasthan',
    states: ['Rajasthan'],
    isShared: false,
    prefixes: ['30', '31', '32', '33', '34'],
  },
  {
    state: 'Gujarat',
    states: ['Gujarat'],
    isShared: false,
    prefixes: ['36', '37', '38', '39'],
  },
  {
    state: 'Maharashtra',
    states: ['Maharashtra'],
    isShared: false,
    prefixes: ['40', '41', '42', '43', '44'], // Note: 403 resolves to Goa via longest match
  },
  {
    state: 'Madhya Pradesh',
    states: ['Madhya Pradesh'],
    isShared: false,
    prefixes: ['45', '46', '47', '48'],
  },
  {
    state: 'Chhattisgarh',
    states: ['Chhattisgarh'],
    isShared: false,
    prefixes: ['49'],
  },
  {
    state: 'Telangana',
    states: ['Telangana'],
    isShared: false,
    prefixes: ['50'],
  },
  {
    state: 'Andhra Pradesh',
    states: ['Andhra Pradesh'],
    isShared: false,
    prefixes: ['51', '52', '53'],
  },
  {
    state: 'Karnataka',
    states: ['Karnataka'],
    isShared: false,
    prefixes: ['56', '57', '58', '59'], // e.g. 56 for Bengaluru territory
  },
  {
    state: 'Tamil Nadu',
    states: ['Tamil Nadu'],
    isShared: false,
    prefixes: ['60', '61', '62', '63', '64', '65', '66'],
  },
  {
    state: 'Kerala',
    states: ['Kerala'],
    isShared: false,
    prefixes: ['67', '68', '69'],
  },
  {
    state: 'West Bengal',
    states: ['West Bengal'],
    isShared: false,
    prefixes: ['70', '71', '72', '73', '74'],
  },
  {
    state: 'Odisha',
    states: ['Odisha'],
    isShared: false,
    prefixes: ['75', '76', '77'],
  },
  {
    state: 'Assam',
    states: ['Assam'],
    isShared: false,
    prefixes: ['78'],
  },
  {
    state: 'Bihar & Jharkhand',
    states: ['Bihar', 'Jharkhand'],
    isShared: true,
    prefixes: ['80', '81', '82', '83', '84', '85'],
  },
];

/**
 * Resolves an input PIN-code prefix against the 28 states of India.
 * Implements longest-prefix matching (3-digit before 2-digit).
 * Returns null if the prefix belongs to a Union Territory or is outside the 28 states.
 */
export function resolveTerritory(inputPrefix: string | null | undefined): TerritoryResolution | null {
  if (!inputPrefix) return null;
  const cleaned = String(inputPrefix).trim();
  if (!cleaned) return null;

  // Step 1: Check special 3-digit prefixes first (longest match)
  for (const def of SPECIAL_THREE_DIGIT_STATES) {
    for (const p of def.prefixes) {
      if (cleaned === p || cleaned.startsWith(p)) {
        return {
          isValid: true,
          prefix: p,
          primaryState: def.state,
          states: def.states,
          isShared: def.isShared,
        };
      }
    }
  }

  // Step 2: Check 2-digit prefixes
  const twoDigit = cleaned.slice(0, 2);
  for (const def of TWO_DIGIT_STATES) {
    if (def.prefixes.includes(twoDigit)) {
      return {
        isValid: true,
        prefix: twoDigit,
        primaryState: def.state,
        states: def.states,
        isShared: def.isShared,
      };
    }
  }

  // Not part of the 28 states (e.g. Union Territories or invalid)
  return null;
}

/**
 * Determines whether a widget's territory matches the customer's requested territory prefix.
 * Supports global widgets ('ALL').
 */
export function isTerritoryMatch(requestedPrefix: string | null | undefined, widgetTerritory: string | null | undefined): boolean {
  const req = (requestedPrefix || '').trim().toUpperCase();
  const wid = (widgetTerritory || 'ALL').trim().toUpperCase();

  // Global widgets match all territories
  if (!req || req === 'ALL' || wid === 'ALL') {
    return true;
  }

  // Exact prefix match
  if (req === wid) {
    return true;
  }

  const reqRes = resolveTerritory(req);
  const widRes = resolveTerritory(wid);

  if (reqRes && widRes) {
    // If both belong to the same state(s)
    const hasOverlap = reqRes.states.some((s) => widRes.states.includes(s));
    if (hasOverlap) return true;
  }

  return false;
}
