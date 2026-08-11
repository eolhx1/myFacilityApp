//
// filename: calculations.js
//

// =================================================================
// IMPORTS
// =================================================================

import {
    UNIT_MAP,
    CATEGORIES
} from './calculations/helpers.js';

import { controlsCalculations } from './calculations/controls.js';
import { ventilationCalculations } from './calculations/ventilation.js';
import { plumbingCalculations } from './calculations/plumbing.js';
import { electricalCalculations } from './calculations/electrical.js';
import { gasCalculations } from './calculations/gas.js';
import { buildingCalculations } from './calculations/building.js';
import { energyCalculations } from './calculations/energy.js';
import { telecomCalculations } from './calculations/telecom.js';

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

// =================================================================
// EXPORTS
// =================================================================

export { UNIT_MAP, CATEGORIES };
