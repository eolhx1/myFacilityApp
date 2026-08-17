//
// filenamne: ./calculations/energy.js
//

// =================================================================
// ENERGI KALKYLER
// =================================================================
import { valid } from './config.js';
import { getCommonText } from '../locales.js';

const calculateTransmissionHeatLoss = (v) => {
    if (!valid(v.uValue, v.area, v.indoorTemperature, v.outdoorTemperature))
        return getCommonText("error");

    const deltaT =
        v.indoorTemperature - v.outdoorTemperature;

    const heatLossW =
        v.uValue * v.area * deltaT;

    const heatLossKW =
        heatLossW / 1000;

    return `${getCommonText("power_loss_result")}: ${heatLossW.toFixed(0)} W\n` +
           `${getCommonText("equivalent_to")}: ${heatLossKW.toFixed(2)} kW`;
};

const calculateCOP = (v) => {
    if (!valid(v.heatingOutput, v.electricalInput) || v.electricalInput === 0)
        return getCommonText("error");

    const cop =
        v.heatingOutput / v.electricalInput;

    return `${getCommonText("cop_result")}: ${cop.toFixed(2)}\n` +
           `${getCommonText("quick_check_heat")}: ${cop.toFixed(1)} kW ${getCommonText("heat_output_per_kw")}`;
};

const calculateEER = (v) => {
    if (!valid(v.coolingOutput, v.electricalInput) || v.electricalInput === 0)
        return getCommonText("error");

    const eer =
        v.coolingOutput / v.electricalInput;

    return `${getCommonText("eer_result")}: ${eer.toFixed(2)}\n` +
           `${getCommonText("quick_check_cooling")}: ${eer.toFixed(1)} kW ${getCommonText("cooling_output_per_kw")}`;
};

export const energyCalculations = [
    {
        id: "transmission_heat_loss",
        nameKey: "transmission_heat_loss",
        categories: ["energy"],
        decimaler: 0,

        inputs: [
            {
                id: "uValue",
                labelKey: "u_value"
            },
            {
                id: "area",
                labelKey: "surface_area"
            },
            {
                id: "indoorTemperature",
                labelKey: "indoor_temperature"
            },
            {
                id: "outdoorTemperature",
                labelKey: "outdoor_temperature_dut"
            }
        ],

        calc: calculateTransmissionHeatLoss,

        info: {
            descriptionKey: "transmission_heat_loss_desc",
            detailsKey: "transmission_heat_loss_details",

            formula: {
                nameKey: "transmission_heat_loss_formula_name",
                descriptionKey: "transmission_heat_loss_formula_desc"
            }
        }
    },

    {
        id: "heat_pump_cop",
        nameKey: "heat_pump_cop",
        categories: ["energy"],
        decimaler: 2,

        inputs: [
            {
                id: "heatingOutput",
                labelKey: "heating_output_kw"
            },
            {
                id: "electricalInput",
                labelKey: "electrical_input_kw"
            }
        ],

        calc: calculateCOP,

        info: {
            descriptionKey: "heat_pump_cop_desc",
            detailsKey: "heat_pump_cop_details",

            formula: {
                nameKey: "heat_pump_cop_formula_name",
                descriptionKey: "heat_pump_cop_formula_desc"
            }
        }
    },

    {
        id: "cooling_eer",
        nameKey: "cooling_eer",
        categories: ["energy"],
        decimaler: 2,

        inputs: [
            {
                id: "coolingOutput",
                labelKey: "cooling_output_kw"
            },
            {
                id: "electricalInput",
                labelKey: "electrical_input_kw"
            }
        ],

        calc: calculateEER,

        info: {
            descriptionKey: "cooling_eer_desc",
            detailsKey: "cooling_eer_details",

            formula: {
                nameKey: "cooling_eer_formula_name",
                descriptionKey: "cooling_eer_formula_desc"
            }
        }
    }
];