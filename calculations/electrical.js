//
// filenamne: ./calculations/electrical.js
//

// =================================================================
// EL KALKYLER
// =================================================================
import { valid } from './config.js';
import { getCommonText } from '../locales.js';

const calculateOhmsLaw = (v) => {
    if (!valid(v.value1, v.value2))
        return getCommonText("error");

    const mode = v.calculationMode_unit || "U";
	
	if ((mode === "I" || mode === "R") && v.value2 === 0)
    return getCommonText("division_by_zero_error");


    if (mode === "U") {
        return `${getCommonText("voltage_result")}: ${(v.value1 * v.value2).toFixed(2)} V`;
    }

    if (mode === "I") {
        return `${getCommonText("current_result")}: ${(v.value1 / v.value2).toFixed(2)} A`;
    }

    if (mode === "R") {
        return `${getCommonText("resistance_result")}: ${(v.value1 / v.value2).toFixed(2)} Ω`;
    }

    return getCommonText("error");
};

export const electricalCalculations = [{
    id: "ohms_law",
    nameKey: "ohms_law",
    categories: ["electrical", "telecom"],
    decimaler: 2,

    inputs: [
        {
            id: "calculationMode",
            labelKey: "what_to_calculate",
            unit: ["U", "I", "R"],
            requiresInput: false
        },
        {
            id: "value1",
            labelKey: "current_i_a"
        },
        {
            id: "value2",
            labelKey: "resistance_r_ohm"
        }
    ],

    calc: calculateOhmsLaw,

    info: {
        descriptionKey: "ohms_law_desc",
        detailsKey: "ohms_law_details",

        formula: {
            nameKey: "ohms_law_formula_name",
            descriptionKey: "ohms_law_formula_desc"
        }
    }
}];