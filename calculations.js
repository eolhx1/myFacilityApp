//
// filename: ./calculations.js
//

// =================================================================
// IMPORTS
// =================================================================

console.log(controlsCalculations);

import {
    UNIT_MAP,
    CATEGORIES
} from './calculations/config.js';

import { controlsCalculations } from './calculations/controls.js';
import { ventilationCalculations } from './calculations/ventilation.js';
import { plumbingCalculations } from './calculations/plumbing.js';
import { electricalCalculations } from './calculations/electrical.js';
import { gasCalculations } from './calculations/gas.js';
import { telecomCalculations } from './calculations/telecom.js';
import { buildingCalculations } from './calculations/building.js';
import { energyCalculations } from './calculations/energy.js';

// =================================================================
// ALL CALCULATIONS
// =================================================================

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

console.log(
    "Controls:",
    ALL_CALCULATIONS.filter(c => c.categories.includes("controls"))
);

console.log(
    ALL_CALCULATIONS.filter(c => c.categories.includes("controls"))
);

// =================================================================
// EXPORTS
// =================================================================

export { UNIT_MAP, CATEGORIES };
