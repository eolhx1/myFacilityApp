//
// filename: ./calculations.js
//
// Samlar alla beräkningsmoduler och exporterar
// applikationens gemensamma kalkylregister.
//

// ==========================================================================
// 1. IMPORTS
// ==========================================================================

import {
    UNIT_MAP,
    CATEGORIES
} from './calculations/config.js';

import {
    controlsCalculations
} from './calculations/controls.js';

import {
    ventilationCalculations
} from './calculations/ventilation.js';

import {
    plumbingCalculations
} from './calculations/plumbing.js';

import {
    electricalCalculations
} from './calculations/electrical.js';

import {
    gasCalculations
} from './calculations/gas.js';

import {
    telecomCalculations
} from './calculations/telecom.js';

import {
    buildingCalculations
} from './calculations/building.js';

import {
    energyCalculations
} from './calculations/energy.js';

// ==========================================================================
// 2. KALKYLREGISTER
// ==========================================================================

export const ALL_CALCULATIONS = [
    ...controlsCalculations,
    ...ventilationCalculations,
    ...plumbingCalculations,
    ...electricalCalculations,
    ...gasCalculations,
    ...telecomCalculations,
    ...buildingCalculations,
    ...energyCalculations
];

// ==========================================================================
// 3. EXPORTS
// ==========================================================================

export {
    UNIT_MAP,
    CATEGORIES
};