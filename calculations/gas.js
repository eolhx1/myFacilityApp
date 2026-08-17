//
// filenamne: ./calculations/gas.js
//

// =================================================================
// GAS KALKYLER
// =================================================================
import { valid } from './config.js';
import { getCommonText } from '../locales.js';

const calculateCylinderRuntime = (v) => {
    if (!valid(v.cylinderVolume, v.pressure, v.flowRate) || v.flowRate === 0)
        return getCommonText("error");

    const runtimeHours =
        (v.cylinderVolume * v.pressure) /
        (v.flowRate * 60);

    return `${getCommonText("cylinder_runtime_result")}: ${runtimeHours.toFixed(1)} h`;
};

export const gasCalculations = [{
    id: "cylinder_runtime",
    nameKey: "cylinder_runtime",
    categories: ["gas"],
    decimaler: 1,

    inputs: [
        {
            id: "cylinderVolume",
            labelKey: "cylinder_volume"
        },
        {
            id: "pressure",
            labelKey: "pressure"
        },
        {
            id: "flowRate",
            labelKey: "prescribed_flow"
        }
    ],

    calc: calculateCylinderRuntime,

    info: {
        descriptionKey: "cylinder_runtime_desc",
        detailsKey: "cylinder_runtime_details",

        formula: {
            nameKey: "cylinder_runtime_formula_name",
            descriptionKey: "cylinder_runtime_formula_desc"
        }
    }
}];