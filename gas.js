//
// filenamne: ./calculations/gas.js
//

// =================================================================
// GAS KALKYLER
// =================================================================
import { valid } from './config.js';
import { getCommonText } from '../locales.js';

const calculateCylinderRuntime = (v) => {
    // Om minPressure saknas/är tom sätts det till 0 som reserv
    const minPressure = v.minPressure || 0;

    if (!valid(v.cylinderVolume, v.pressure, v.flowRate, minPressure) || v.flowRate === 0)
        return getCommonText("error");

    // Det tillgängliga trycket som faktiskt kan användas
    const usablePressure = v.pressure - minPressure;

    // Om trycket i flaskan är lägre än eller lika med minimitrycket ges 0 timmars användningstid
    if (usablePressure <= 0) {
        return `${getCommonText("cylinder_runtime_result")}: 0.0 h`;
    }

    const runtimeHours =
        (v.cylinderVolume * usablePressure) /
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
            id: "minPressure",
            labelKey: "min_pressure"
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