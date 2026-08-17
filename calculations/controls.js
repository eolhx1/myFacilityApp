//
// filenamne: ./calculations/controls.js
//

// =================================================================
// STYR & REGLER KALKYLER
// =================================================================
import {
    valid
} from './config.js';

import {
    getCommonText
} from '../locales.js';

const calculateProcessValueFromVoltage = (v) =>
    `${getCommonText("value")}: ${(((v.voltage / 10) * (v.max - v.min) + v.min)).toFixed(2)}`;

const calculateProcessValueFromCurrent = (v) =>
    `${getCommonText("value")}: ${(((v.currentmA - 4) / 16) * (v.max - v.min) + v.min).toFixed(2)}`;

const calculateProportionalBand = (v) =>
    `${getCommonText("proportional_band_result")}: ${(v.outputSignal / v.controlError).toFixed(2)}`;
	
const calculateSystemTimeConstant = (v) =>
    `${getCommonText("time_constant")}: ${((v.volume / v.flow) * 60).toFixed(1)} ${getCommonText("minutes")}`;
	
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
			{ id: "currentmA", labelKey: "current_ma" },
			{ id: "min", labelKey: "minimum" },
			{ id: "max", labelKey: "maximum" }
		],

        calc: (v) => !valid(v.currentmA, v.min, v.max) ? getCommonText("fill_all_fields") : calculateProcessValueFromCurrent(v),
        info: {
			descriptionKey: "current_to_process_value_desc",            
			detailsKey: "current_to_process_value_details",
            formula: {
                nameKey: "current_to_process_value_formula_name",
                descriptionKey: "current_to_process_value_formula_desc"
            }
        }
    },

    {
		id: "voltage_to_process_value",
		nameKey: "voltage_to_process_value",
        categories: ["controls"],
        unit: "",
        decimaler: 2,
        inputs: [
            { id: "voltage", labelKey: "measured_voltage_v" },
			{ id: "min", labelKey: "min_value" },
			{ id: "max", labelKey: "max_value" }
        ],
        calc: (v) => !valid(v.voltage, v.min, v.max) ? getCommonText("error") : calculateProcessValueFromVoltage(v),
        info: {
            descriptionKey: "voltage_to_process_value_desc",
			detailsKey: "voltage_to_process_value_details",
            formula: {
                nameKey: "voltage_to_process_value_formula_name",
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
            { id: "outputSignal", labelKey: "output_signal_percent" },
			{ id: "controlError", labelKey: "control_error" }
        ],
		
        calc: (v) => !valid(v.outputSignal, v.controlError) || v.controlError === 0 ? getCommonText("invalid_values") : calculateProportionalBand(v),
        info: {
			descriptionKey: "proportional_band_desc",
            detailsKey: "proportional_band_details",
            formula: {
                nameKey: "proportional_band_formula_name",
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
			{ id: "volume", labelKey: "volume_m3" },
			{ id: "flow", labelKey: "flow_m3h" }
        ],
		
        calc: (v) => !valid(v.volume, v.flow) || v.flow === 0 ? getCommonText("error") : calculateSystemTimeConstant(v),
        info: {
            descriptionKey: "system_time_constant_desc",
            detailsKey: "system_time_constant_details",
            formula: {
                nameKey: "system_time_constant_formula_name",
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
			{ id: "inputMinmA", labelKey: "input_min_ma" },
			{ id: "inputMaxmA", labelKey: "input_max_ma" },
			{ id: "physicalMin", labelKey: "physical_min" },
			{ id: "physicalMax", labelKey: "physical_max" }
        ],
		
        calc: (v) => !valid(v.inputMinmA, v.inputMaxmA, v.physicalMin, v.physicalMax) ? getCommonText("fill_all_fields") :
        `${getCommonText("plc_configuration")}:
${getCommonText("input")}: ${v.inputMinmA}-${v.inputMaxmA}mA
${getCommonText("output")}: ${v.physicalMin}-${v.physicalMax}
${getCommonText("diagnosis_at_0ma")}:
${getCommonText("plc_shows")}: ${calculateTheoreticalZeroValue(
    v.inputMinmA,
    v.inputMaxmA,
    v.physicalMin,
    v.physicalMax
).toFixed(2)}`,
        info: {
            descriptionKey: "zero_current_process_value_desc",
            detailsKey: "zero_current_process_value_details",
            formula: {
                nameKey: "zero_current_process_value_formula_name",
                descriptionKey: "zero_current_process_value_formula_desc"
            }
        }
    }
];
