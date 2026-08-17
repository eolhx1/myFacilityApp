//
// filenamne: ./calculations/telecom.js
//

// =================================================================
// TELE & DATA KALKYLER
// =================================================================
import { valid } from './config.js';
import { getCommonText } from '../locales.js';


const calculateFiberLossBudget = (v) => {
    if (!valid(v.fiberLengthKm, v.spliceCount, v.connectorCount))
        return getCommonText("error");

    const fiberLoss = v.fiberLengthKm * 0.4;
    const spliceLoss = v.spliceCount * 0.05;
    const connectorLoss = v.connectorCount * 0.5;
    const totalLoss = fiberLoss + spliceLoss + connectorLoss;

    return `${getCommonText("max_allowed_attenuation")}: ${totalLoss.toFixed(2)} dB\n` +
           `- ${getCommonText("fiber")} (${v.fiberLengthKm} km): ${fiberLoss.toFixed(2)} dB\n` +
           `- ${getCommonText("splices")} (${v.spliceCount} ${getCommonText("pieces")}): ${spliceLoss.toFixed(2)} dB\n` +
           `- ${getCommonText("connectors")} (${v.connectorCount} ${getCommonText("pieces")}): ${connectorLoss.toFixed(2)} dB`;
};


const calculatePoEVoltageDrop = (v) => {
    if (!valid(v.cableLengthM, v.powerW))
        return getCommonText("error");

    const voltageOutputV = 48;
    const resistanceOhm = v.cableLengthM * 0.1;
    const currentA = v.powerW / voltageOutputV;
    const voltageDropV = resistanceOhm * currentA;
    const deviceVoltageV = voltageOutputV - voltageDropV;

    let status =
        getCommonText("voltage_ok");

    if (v.cableLengthM > 100) {
        status =
            getCommonText("ethernet_length_warning");
    } else if (deviceVoltageV < 37) {
        status =
            getCommonText("voltage_drop_warning");
    }

    return `${getCommonText("voltage_at_device")}: ${deviceVoltageV.toFixed(1)} V\n` +
           `${getCommonText("voltage_drop")}: ${voltageDropV.toFixed(2)} V\n` +
           `${getCommonText("status")}: ${status}`;
};

export const telecomCalculations = [
    {
        id: "fiber_loss_budget",
        nameKey: "fiber_loss_budget",
        categories: ["telecom"],
        decimaler: 2,

        inputs: [
            {
                id: "fiberLengthKm",
                labelKey: "fiber_length_km"
            },
            {
                id: "spliceCount",
                labelKey: "splice_count"
            },
            {
                id: "connectorCount",
                labelKey: "connector_pair_count"
            }
        ],

        calc: calculateFiberLossBudget,

        info: {
            descriptionKey: "fiber_loss_budget_desc",
            detailsKey: "fiber_loss_budget_details",

            formula: {
                nameKey: "fiber_loss_budget_formula_name",
                descriptionKey: "fiber_loss_budget_formula_desc"
            }
        }
    },

    {
        id: "poe_voltage_drop",
        nameKey: "poe_voltage_drop",
        categories: ["telecom"],
        decimaler: 2,

        inputs: [
            {
                id: "cableLengthM",
                labelKey: "cable_length_m"
            },
            {
                id: "powerW",
                labelKey: "device_power_w"
            }
        ],

        calc: calculatePoEVoltageDrop,

        info: {
            descriptionKey: "poe_voltage_drop_desc",
            detailsKey: "poe_voltage_drop_details",

            formula: {
                nameKey: "poe_voltage_drop_formula_name",
                descriptionKey: "poe_voltage_drop_formula_desc"
            }
        }
    }
];