//
// filenamne: ./calculations/controls.js
//

// =================================================================
// STYR & REGLER KALKYLER
// =================================================================
import {
    valid
} from './config.js';

const calculateProcessValueFromVoltage = (v) =>
    `Värde: ${(((v.voltage / 10) * (v.max - v.min) + v.min)).toFixed(2)}`;
	
const calculateProcessValueFromCurrent = (v) => 
	`Värde: ${(((v.currentmA - 4) / 16) * (v.max - v.min) + v.min).toFixed(2)}`;

const calculateProportionalBand = (v) => 
	`P-band (Xp): ${(v.outputSignal / v.controlError).toFixed(2)}`;

const calculateSystemTimeConstant = (v) => 
	`Tidskonstant: ${((v.volume / v.flow) * 60).toFixed(1)} minuter`;

const calculateTheoreticalZeroValue = (inMin, inMax, physicalMin, physicalMax) => {
    return ((0 - inMin) / (inMax - inMin)) * (physicalMax - physicalMin) + physicalMin;
};

export const controlsCalculations = [
	{
		id: "current_to_process_value",
		nameKey: "current_to_process_value",
		categories: ["controls"],
        decimaler: 2,
        inputs: [
            { id: "currentmA", label: "mA" },
            { id: "min", label: "Min" },
            { id: "max", label: "Max" }
        ],
        calc: (v) => !valid(v.currentmA, v.min, v.max) ? "Fyll i alla fält" : calculateProcessValueFromCurrent(v),
        info: {
			descriptionKey: "current_to_process_value_desc",            
			detailsKey: "current_to_process_value_details",
            formula: {
                nameKey: "current_to_process_value_formula_name"
                descriptionKey: "current_to_process_value_formula_desc"
            }
        }
    },

    {
		id: "voltage_to_process_value",
		nameKey: "voltage_to_process_value",
        categories: ["controls"],
        label: "Resultat",
        unit: "",
        decimaler: 2,
        inputs: [
            { id: "voltage", label: "Uppmätt spänning (V)" },
            { id: "min", label: "Minvärde" },
            { id: "max", label: "Maxvärde" }
        ],
        calc: (v) => !valid(v.voltage, v.min, v.max) ? "Fel" : calculateProcessValueFromVoltage(v),
        info: {
            descriptionKey: "voltage_to_process_value_desc",
			detailsKey: "voltage_to_process_value_details",
            formula: {
                nameKey: "voltage_to_process_value_formula_name"
                descriptionKey: "voltage_to_process_value_formula_desc"
            }
        }
    },
		
    {
        id: "proportional_band",
        nameKey: "proportional_band",
        categories: ["controls"],
        decimaler: 2,
        inputs: [
            { id: "outputSignal", label: "% Utsignal" },
            { id: "controlError", label: "Δ Ärvärde" }
        ],
        calc: (v) => !valid(v.outputSignal, v.controlError) || v.controlError === 0 ? "Felaktiga värden" : calculateProportionalBand(v),
        info: {
			descriptionKey: "proportional_band_desc",
            detailsKey: "proportional_band_details",
            formula: {
                nameKey: "proportional_band_formula_name"
                descriptionKey: "proportional_band_formula_desc"
            }
        }
    },
	
    {
        id: "system_time_constant",
        nameKey: "system_time_constant",
        categories: ["controls"],
        decimaler: 1,
        inputs: [
            { id: "volume", label: "Volym (m³)" },
            { id: "flow", label: "Flöde (m³/h)" }
        ],
        calc: (v) => !valid(v.volume, v.flow) || v.flow === 0 ? "Fel" : calculateSystemTimeConstant(v),
        info: {
            descriptionKey: "system_time_constant_desc",
            detailsKey: "system_time_constant_details",
            formula: {
                nameKey: "system_time_constant_formula_name"
                descriptionKey: "system_time_constant_formula_desc"
            }
        }
    },
	
    {
        id: "zero_current_process_value",
        nameKey: "zero_current_process_value",
        categories: ["controls"],
        decimaler: 2,
        inputs: [
            { id: "inputMinmA", label: "In Min (mA)" },
            { id: "inputMaxmA", label: "In Max (mA)" },
            { id: "physicalMin", label: "Fys Min" },
            { id: "physicalMax", label: "Fys Max" }
        ],
        calc: (v) => !valid(v.inputMinmA, v.inputMaxmA, v.physicalMin, v.physicalMax) ? "Fyll i fält" :
        `PLC KONFIGURATION:\nIn: ${v.inputMinmA}-${v.inputMaxmA}mA\nUt: ${v.physicalMin}-${v.physicalMax}\n\nDIAGNOS VID 0mA:\nPLC visar: ${calculateTheoreticalZeroValue(v.inputMinmA, v.inputMaxmA, v.physicalMin, v.physicalMax).toFixed(2)}`,
        info: {
            descriptionKey: "zero_current_process_value_desc",
            detailsKey: "zero_current_process_value_details",
            formula: {
                nameKey: "zero_current_process_value_formula_name"
                descriptionKey: "zero_current_process_value_formula_desc"
            }
        }
    }
];
