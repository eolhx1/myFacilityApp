//
// filenamne: ./calculations/plumbing.js
//

// =================================================================
// Fil: kalkyler/plumbing.js
// =================================================================

import { valid, formatResult } from './config.js';
import { getCommonText } from '../locales.js';

// --- Beräkningsfunktioner (VS & Värme) ---
const calculateRequiredRadiatorFlow = (v) => {
    if (!valid(v.heatOutput, v.temperatureDifference))
        return getCommonText("error");

    if (v.temperatureDifference === 0)
        return getCommonText("division_by_zero_error");

    const flowRateLh =
        (v.heatOutput / (4180 * v.temperatureDifference)) * 3600;

    let resultText =
        `${getCommonText("flow_result")}: ${formatResult(flowRateLh, 1)} l/h\n`;

    resultText +=
        `${getCommonText("flow_result")}: ${formatResult(flowRateLh / 3600, 4)} l/s`;

    return resultText;
};


const calculateKvValue = (v) => {
    if (!valid(v.flowRateM3h, v.pressureDrop) || v.pressureDrop <= 0)
        return getCommonText("error");

    const kvValue =
        v.flowRateM3h / Math.sqrt(v.pressureDrop);

    return `${getCommonText("kv_value_result")}: ${kvValue.toFixed(2)}`;
};

const calculateRadiatorOutputAtNewTemperature = (v) => {
    if (!valid(
        v.designHeatOutput,
        v.newTemperatureDifference,
        v.oldTemperatureDifference,
        v.radiatorExponent
    ) || v.oldTemperatureDifference === 0)
        return getCommonText("error");

    const newHeatOutput =
        v.designHeatOutput *
        Math.pow(
            v.newTemperatureDifference / v.oldTemperatureDifference,
            v.radiatorExponent
        );

    return `${getCommonText("new_radiator_output")}: ${newHeatOutput.toFixed(0)} W`;
};

const calculateBalancingRatio = (v) => {
    if (!valid(v.measuredFlow, v.designFlow) || v.designFlow === 0)
        return getCommonText("error");

    const ratio =
        v.measuredFlow / v.designFlow;

    return `${getCommonText("balancing_ratio_result")}: ${ratio.toFixed(2)}`;
};


const calculatePipePressureDrop = (v) => {
    if (!valid(v.frictionResistance, v.pipeLength))
        return getCommonText("error");

    const pressureDropPa =
        v.frictionResistance * v.pipeLength;

    const totalPressureDrop =
        pressureDropPa * 1.4;

    let resultText =
        `${getCommonText("pipe_network_pressure_drop")}: ${formatResult(totalPressureDrop, 0)} Pa\n`;

    resultText +=
        `${getCommonText("including_fittings")}: ${formatResult(totalPressureDrop / 1000, 2)} kPa`;

    return resultText;
};

// Affinitetslagar för Pumpar
const calculatePumpAffinityLaws = (v) => {
    if (!valid(v.currentSpeed, v.newSpeed, v.currentFlow, v.currentPressure, v.currentPower)) return "Fel";
    
const speedRatio = v.newSpeed / v.currentSpeed;
const newFlow = v.currentFlow * speedRatio;
const newPressure = v.currentPressure * Math.pow(speedRatio, 2);
const newPower = v.currentPower * Math.pow(speedRatio, 3);
    
return `${getCommonText("new_flow")}: ${newFlow.toFixed(2)} l/s\n` +
       `${getCommonText("new_pressure_head")}: ${newPressure.toFixed(1)} kPa\n` +
       `${getCommonText("new_power")}: ${newPower.toFixed(2)} kW`;

};

const calculateOnePipeTemperatureDrop = (v) => {
    if (!valid(v.supplyTemperature, v.heatOutput, v.loopFlow) || v.loopFlow === 0)
		return getCommonText("error");
	
    const flowRateM3s = v.loopFlow / 3600000;
    const denominator = flowRateM3s * 4180 * 1000;

    if (denominator === 0)
		return getCommonText("division_by_zero_error");
	
    const nextTemperature = v.supplyTemperature - (v.heatOutput / denominator);
    return `${getCommonText("supply_temperature_after_radiator")}: ${nextTemperature.toFixed(1)} °C`;
};

const calculateHeatOutputFromFlow = (v) => {
    if (!valid(v.flowRateLs, v.temperatureDifference)) return "Fel";
    const heatOutputKw = v.flowRateLs * 4.19 * v.temperatureDifference;
    return `${getCommonText("transferred_power")}: ${heatOutputKw.toFixed(2)} kW`;
};

const calculateWaterExpansion = (v) => {
    if (!valid(v.systemVolumeM3, v.coldTemperature, v.hotTemperature)) return "Fel";
    const expansionFactor = (v.hotTemperature - v.coldTemperature) * 0.00035; 
    const expansionVolumeLiters = v.systemVolumeM3 * 1000 * expansionFactor;
    
    return `${getCommonText("volume_increase")}: ${expansionVolumeLiters.toFixed(1)} ${getCommonText("liters")}\n` +
       `${getCommonText("new_total_volume")}: ${(v.systemVolumeM3 * 1000 + expansionVolumeLiters).toFixed(1)} ${getCommonText("liters")}`;

};

const calculateBrineHeatTransfer = (v) => {
    if (!valid(v.flowRateLs, v.temperatureDifference)) return "Fel";
    const heatOutputKw = v.flowRateLs * 4.0 * v.temperatureDifference;
    return `${getCommonText("brine_heat_transfer_result")}: ${heatOutputKw.toFixed(2)} kW`;
};

// --- Kalkyl-array (VS) ---
export const plumbingCalculations = [
    {
        id: "required_radiator_flow",
        nameKey: "required_radiator_flow",
        categories: ["plumbing"],
        unit: "l/h",
        decimaler: 1,
        inputs: [
			{ id: "heatOutput", labelKey: "radiator_heat_output", unit: ["W"] },
			{ id: "temperatureDifference", labelKey: "temperature_difference", unit: ["°C"] }
		],
        calc: calculateRequiredRadiatorFlow,
        info: {
			descriptionKey: "required_radiator_flow_desc",
			detailsKey: "required_radiator_flow_details",
			formula: {
				nameKey: "required_radiator_flow_formula_name",
				descriptionKey: "required_radiator_flow_formula_desc"
			}
		}
    },
	
    {
        id: "valve_kv_value",
        nameKey: "valve_kv_value",
        categories: ["plumbing"],
        unit: "",
        decimaler: 2,
        inputs: [
			{ id: "flowRateM3h", labelKey: "flow_rate_q", unit: ["m³/h"] },
			{ id: "pressureDrop", labelKey: "valve_pressure_drop", unit: ["bar"] }
		],
        calc: calculateKvValue,
        info: {
            description: "Beräknar ventilens K<sub>v</sub>-värde för flödesinställning.",
            details: "K<sub>v</sub>-värdet definieras som det flöde i m³/h som passerar ventilen vid ett tryckfall på 1 bar. Viktigt verktyg vid injustering av stam- och radiatordon.",
			formula: {
				name: "Kv-värde",
				description: "Kv = Flöde / √Tryckfall"
			}
        }
    },
	
    {
        id: "radiator_output_at_new_temperature",
        nameKey: "radiator_output_at_new_temperature",
        categories: ["plumbing"],
        unit: "W",
        decimaler: 0,
        inputs: [
			{ id: "designHeatOutput", labelKey: "design_heat_output", unit: ["W"] },
			{ id: "newTemperatureDifference", labelKey: "new_temperature_difference", unit: ["°C"] },
			{ id: "oldTemperatureDifference", labelKey: "old_temperature_difference", unit: ["°C"] },
			{ id: "radiatorExponent", labelKey: "radiator_exponent" }
		],
        calc: calculateRadiatorOutputAtNewTemperature,
        info: {
			descriptionKey: "radiator_output_at_new_temperature_desc",
			detailsKey: "radiator_output_at_new_temperature_details",
			formula: {
				nameKey: "radiator_output_at_new_temperature_formula_name",
				descriptionKey: "radiator_output_at_new_temperature_formula_desc"
			}
		}
    },
	
    {
        id: "balancing_ratio",
        nameKey: "balancing_ratio",
        categories: ["plumbing"],
        unit: "",
        decimaler: 2,
        inputs: [
			{ id: "measuredFlow", labelKey: "measured_flow", unit: ["l/h", "m³/h"] },
			{ id: "designFlow", labelKey: "design_flow", unit: ["l/h", "m³/h"] }
		],
        calc: calculateBalancingRatio,
        info: {
			descriptionKey: "balancing_ratio_desc",
			detailsKey: "balancing_ratio_details",
			formula: {
				nameKey: "balancing_ratio_formula_name",
				descriptionKey: "balancing_ratio_formula_desc"
			}
		}
    },
	
    {
        id: "pipe_pressure_drop",
        nameKey: "pipe_pressure_drop",
        categories: ["plumbing"],
        unit: "",
        decimaler: 0,
        inputs: [
			{ id: "frictionResistance", labelKey: "friction_resistance", unit: ["Pa/m"] },
			{ id: "pipeLength", labelKey: "pipe_length_total", unit: ["m"] }
		],
        calc: calculatePipePressureDrop,
        info: {
			descriptionKey: "pipe_pressure_drop_desc",
			detailsKey: "pipe_pressure_drop_details",
			formula: {
				nameKey: "pipe_pressure_drop_formula_name",
				descriptionKey: "pipe_pressure_drop_formula_desc"
			}
		}
    },
	
    {
        id: "pump_affinity_laws",
        nameKey: "pump_affinity_laws",
        categories: ["plumbing"],
        decimaler: 2,
       inputs: [
			{ id: "currentSpeed", labelKey: "current_speed" },
			{ id: "newSpeed", labelKey: "new_speed" },
			{ id: "currentFlow", labelKey: "current_flow_ls" },
			{ id: "currentPressure", labelKey: "current_pressure_kpa" },
			{ id: "currentPower", labelKey: "current_power_kw" }
		],
        calc: calculatePumpAffinityLaws,
        info: {
			descriptionKey: "pump_affinity_laws_desc",
			detailsKey: "pump_affinity_laws_details",
			formula: {
				nameKey: "pump_affinity_laws_formula_name",
				descriptionKey: "pump_affinity_laws_formula_desc"
			}
		}
    },
	
    {
        id: "one_pipe_temperature_drop",
        nameKey: "one_pipe_temperature_drop",
        categories: ["plumbing"],
        unit: "°C",
        decimaler: 1,
        inputs: [
			{ id: "supplyTemperature", labelKey: "supply_temperature", unit: ["celsius"] },
			{ id: "heatOutput", labelKey: "radiator_heat_output", unit: ["W"] },
			{ id: "loopFlow", labelKey: "loop_flow", unit: ["l/h"] }
		],
        calc: calculateOnePipeTemperatureDrop,
        info: {
			descriptionKey: "one_pipe_temperature_drop_desc",
			detailsKey: "one_pipe_temperature_drop_details",
			formula: {
				nameKey: "one_pipe_temperature_drop_formula_name",
				descriptionKey: "one_pipe_temperature_drop_formula_desc"
			}
		}
    },
    {
        id: "heat_output_from_flow",
        nameKey: "heat_output_from_flow",
        categories: ["plumbing"],
        unit: "kW",
        decimaler: 2,
        inputs: [
			{ id: "flowRateLs", labelKey: "water_flow_rate", unit: ["l/s"] },
			{ id: "temperatureDifference", labelKey: "temperature_difference_flow_return", unit: ["°C"] }
		],
        calc: calculateHeatOutputFromFlow,
        info: {
			descriptionKey: "heat_output_from_flow_desc",
			detailsKey: "heat_output_from_flow_details",
			formula: {
				nameKey: "heat_output_from_flow_formula_name",
				descriptionKey: "heat_output_from_flow_formula_desc"
			}
		}
    },
    {
        id: "water_expansion",
        nameKey: "water_expansion",
        categories: ["plumbing"],
        unit: "liter",
        decimaler: 1,
        inputs: [
			{ id: "systemVolumeM3", labelKey: "system_volume", unit: ["m³"] },
			{ id: "coldTemperature", labelKey: "cold_temperature_fill", unit: ["°C"] },
			{ id: "hotTemperature", labelKey: "hot_temperature_max", unit: ["°C"] }
		],
        calc: calculateWaterExpansion,
        info: {
			descriptionKey: "water_expansion_desc",
			detailsKey: "water_expansion_details",
			formula: {
				nameKey: "water_expansion_formula_name",
				descriptionKey: "water_expansion_formula_desc"
			}
		}
    },
    {
        id: "brine_heat_transfer",
        nameKey: "brine_heat_transfer",
        categories: ["energy", "plumbing"],
        decimaler: 2,
        inputs: [
			{ id: "flowRateLs", labelKey: "brine_flow_rate", unit: ["l/s"] },
			{ id: "temperatureDifference", labelKey: "temperature_difference_in_out", unit: ["°C"] }
		],
        calc: calculateBrineHeatTransfer,
        info: {
			descriptionKey: "brine_heat_transfer_desc",
			detailsKey: "brine_heat_transfer_details",
			formula: {
				nameKey: "brine_heat_transfer_formula_name",
				descriptionKey: "brine_heat_transfer_formula_desc"
			}
		}
    }
];
