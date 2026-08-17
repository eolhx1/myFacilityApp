//
// filenamne: ./calculations/ventilation.js
//

// =================================================================
// VENTILATION KALKYLER (js/ventilation.js)
// =================================================================
import { valid, toM3h, toLs } from './config.js';
import { getCommonText } from '../locales.js';

const calculateAirChangeRate = (v) => {
    if (!v.roomVolume || v.roomVolume <= 0 || !v.airflow)
		return getCommonText("error");
	
    const airChangeRate =
    toM3h(v.airflow, v.airflow_unit || "m3h") / v.roomVolume;

return `${getCommonText("air_change_rate_result")}: ${airChangeRate.toFixed(1)} h⁻¹`;
};

const calculateCoolingCapacity = (v) => {
    const airflowLs = toLs(v.airflow, v.airflow_unit || "ls");
    const dT = v.roomTemperature - v.supplyAirTemperature;
   const coolingCapacity = (1.2 * airflowLs * dT) / 1000;

return `${getCommonText("cooling_capacity_result")}: ${coolingCapacity.toFixed(2)} kW`;
};

const calculateAirflowFromVelocity = (v) => {
    if (!valid(v.airVelocity, v.ductArea)) return getCommonText("error");
    const airflow = (v.airVelocity * v.ductArea) * 1000;

return `${getCommonText("airflow_result")}: ${airflow.toFixed(1)} l/s`;
};

const calculateAirflowFromKFactor = (v) => {
    if (!valid(v.kFactor, v.pressureDifference) || v.pressureDifference < 0) return getCommonText("error");
    const airflow =
    v.kFactor * Math.sqrt(v.pressureDifference);

return `${getCommonText("airflow_result")}: ${airflow.toFixed(1)} l/s`;
};

const calculateSpecificFanPower = (v) => {
    if (!valid(v.totalPower, v.airflow) || v.airflow === 0) return getCommonText("error");
    const flowUnit = v.airflow_unit || "ls";
    const airflowM3s = toM3h(v.airflow, flowUnit) / 3600;
    const sfp = v.totalPower / airflowM3s;

return `${getCommonText("sfp_result")}: ${sfp.toFixed(2)} kW/(m³/s)`;

};

const calculateFanAffinityLaws = (v) => {
    if (!valid(v.currentSpeed, v.newSpeed, v.currentFlow, v.currentPressure, v.currentPower)) return getCommonText("error");
    
    const speedRatio = v.newSpeed / v.currentSpeed;
    const newFlow = v.currentFlow * speedRatio;
    const newPressure = v.currentPressure * Math.pow(speedRatio, 2);
    const newPower = v.currentPower * Math.pow(speedRatio, 3);
    
return `${getCommonText("new_flow")}: ${newFlow.toFixed(2)} m³/s\n` +
       `${getCommonText("new_pressure")}: ${newPressure.toFixed(1)} Pa\n` +
       `${getCommonText("new_power")}: ${newPower.toFixed(2)} kW`;

};

const calculateEquivalentDuctDiameter = (v) => {
    if (!valid(v.ductWidth, v.ductHeight) || (v.ductWidth + v.ductHeight) === 0) return getCommonText("error");
    const diameter =
    (2 * v.ductWidth * v.ductHeight) /
    (v.ductWidth + v.ductHeight);

return `${getCommonText("equivalent_duct_diameter_result")}: ${diameter.toFixed(0)} mm`;

};

const calculateAirflowFromEffectiveArea = (v) => {
    if (!valid(v.airVelocity, v.effectiveArea)) return getCommonText("error");
    const airflow =
    (v.airVelocity * v.effectiveArea) * 1000;

return `${getCommonText("airflow_result")}: ${airflow.toFixed(1)} l/s`;
};

const calculateHeatRecoveryEfficiency = (v) => {
    if (!valid(v.supplyAirTemperature, v.outdoorAirTemperature, v.extractAirTemperature)) return getCommonText("error");
    const temperatureDifference = v.extractAirTemperature - v.outdoorAirTemperature;
    if (temperatureDifference === 0)
		return getCommonText("division_by_zero_error");
    const efficiency =
    (v.supplyAirTemperature - v.outdoorAirTemperature) /
    temperatureDifference;

return `${getCommonText("temperature_efficiency_result")}: ${(efficiency * 100).toFixed(1)} %`;
};

const calculateMixedAirTemperature = (v) => {
    if (!valid(v.outdoorAirflow, v.outdoorAirTemperature, v.returnAirflow, v.returnAirTemperature, v.totalAirflow) || v.totalAirflow === 0) return getCommonText("error");
   const mixedAirTemperature =
    ((v.outdoorAirflow * v.outdoorAirTemperature) +
     (v.returnAirflow * v.returnAirTemperature)) /
    v.totalAirflow;

return `${getCommonText("mixed_air_temperature_result")}: ${mixedAirTemperature.toFixed(1)} °C`;
};

export const ventilationCalculations = [
    {
		id: "air_change_rate",
		nameKey: "air_change_rate",
        categories: ["ventilation"],
        unit: "h⁻¹",
        decimaler: 1,
        inputs: [
			{ id: "roomVolume", labelKey: "room_volume_m3" },
			{ id: "airflow", labelKey: "airflow", unit: ["ls", "m3h"], base: "m3h" }
		],
        calc: calculateAirChangeRate,
		info: {
			descriptionKey: "air_change_rate_desc",
			detailsKey: "air_change_rate_details",
			formula: {
				nameKey: "air_change_rate_formula_name",
				descriptionKey: "air_change_rate_formula_desc"
			}
		}
    },
	
    {
        id: "supply_air_cooling_capacity",
        nameKey: "supply_air_cooling_capacity",
        categories: ["ventilation"],
        unit: "kW",
        decimaler: 2,
        inputs: [
			{ id: "airflow", labelKey: "airflow", unit: ["ls", "m3h"], base: "ls" },
			{ id: "roomTemperature", labelKey: "room_temperature_c" },
			{ id: "supplyAirTemperature", labelKey: "supply_air_temperature_c" }
		],
        calc: (v) =>
			!valid(v.airflow, v.roomTemperature, v.supplyAirTemperature)
				? getCommonText("error")
				: calculateCoolingCapacity(v),
		
        info: {
			descriptionKey: "supply_air_cooling_capacity_desc",
			detailsKey: "supply_air_cooling_capacity_details",
			formula: {
				nameKey: "supply_air_cooling_capacity_formula_name",
				descriptionKey: "supply_air_cooling_capacity_formula_desc"
			}
		}
    },
    {
        id: "airflow_from_velocity",
        nameKey: "airflow_from_velocity",
        categories: ["ventilation"],
        unit: "l/s",
        decimaler: 1,
        inputs: [
			{ id: "airVelocity", labelKey: "air_velocity", unit: ["m/s"] },
			{ id: "ductArea", labelKey: "duct_area", unit: ["m²"] }
		],
        calc: calculateAirflowFromVelocity,
        info: {
			descriptionKey: "airflow_from_velocity_desc",
			detailsKey: "airflow_from_velocity_details",
			formula: {
				nameKey: "airflow_from_velocity_formula_name",
				descriptionKey: "airflow_from_velocity_formula_desc"
			}
		}
    },
    {
        id: "airflow_from_k_factor",
        nameKey: "airflow_from_k_factor",
        categories: ["ventilation"],
        unit: "l/s",
        decimaler: 1,
        inputs: [
			{ id: "kFactor", labelKey: "k_factor" },
			{ id: "pressureDifference", labelKey: "pressure_difference", unit: ["Pa"] }
		],
        calc: calculateAirflowFromKFactor,
        info: {
			descriptionKey: "airflow_from_k_factor_desc",
			detailsKey: "airflow_from_k_factor_details",
			formula: {
				nameKey: "airflow_from_k_factor_formula_name",
				descriptionKey: "airflow_from_k_factor_formula_desc"
			}
		}
    },
    {
        id: "ventilation_balancing_ratio",
        nameKey: "ventilation_balancing_ratio",
        categories: ["ventilation"],
        unit: "",
        decimaler: 2,
		inputs: [
			{ id: "measuredFlow", labelKey: "measured_flow", unit: ["ls", "m3h"], base: "ls" },
			{ id: "designFlow", labelKey: "design_flow", unit: ["ls", "m3h"], base: "ls" }
		],

		calc: (v) => {
			if (!valid(v.measuredFlow, v.designFlow) || v.designFlow === 0) return getCommonText("error");

			const measuredFlowLs = toLs(v.measuredFlow, v.measuredFlow_unit || "ls");
			const designFlowLs = toLs(v.designFlow, v.designFlow_unit || "ls");

			const ratio = measuredFlowLs / designFlowLs;

			return `${getCommonText("balancing_ratio_result")}: ${ratio.toFixed(2)}`;
		},

        info: {
			descriptionKey: "ventilation_balancing_ratio_desc",
			detailsKey: "ventilation_balancing_ratio_details",
			formula: {
				nameKey: "ventilation_balancing_ratio_formula_name",
				descriptionKey: "ventilation_balancing_ratio_formula_desc"
			}
		}
    },
    {
        id: "specific_fan_power",
        nameKey: "specific_fan_power",
        categories: ["ventilation", "building"],
        unit: "kW/(m³/s)",
        decimaler: 1,
		
        inputs: [
			{ id: "totalPower", labelKey: "total_power", unit: ["kW"] },
			{ id: "airflow", labelKey: "largest_airflow", unit: ["ls", "m3h"], base: "ls" }
		],
		
        calc: calculateSpecificFanPower,
		
		info: {
			descriptionKey: "specific_fan_power_desc",
			detailsKey: "specific_fan_power_details",
			formula: {
				nameKey: "specific_fan_power_formula_name",
				descriptionKey: "specific_fan_power_formula_desc"
			}
		}
    },
	
    {
        id: "fan_affinity_laws",
        nameKey: "fan_affinity_laws",
        categories: ["ventilation"],
        decimaler: 2,
        inputs: [
			{ id: "currentSpeed", labelKey: "current_speed" },
			{ id: "newSpeed", labelKey: "new_speed" },
			{ id: "currentFlow", labelKey: "current_flow" },
			{ id: "currentPressure", labelKey: "current_pressure" },
			{ id: "currentPower", labelKey: "current_power" }
		],
        calc: calculateFanAffinityLaws,
		info: {
			descriptionKey: "fan_affinity_laws_desc",
			detailsKey: "fan_affinity_laws_details",
			formula: {
				nameKey: "fan_affinity_laws_formula_name",
				descriptionKey: "fan_affinity_laws_formula_desc"
			}
		}
    },
    {
        id: "equivalent_duct_diameter",
        nameKey: "equivalent_duct_diameter",
        categories: ["ventilation"],
        unit: "mm",
        decimaler: 0,
        inputs: [
			{ id: "ductWidth", labelKey: "duct_width", unit: ["mm", "m"] },
			{ id: "ductHeight", labelKey: "duct_height", unit: ["mm", "m"] }
		],
        calc: calculateEquivalentDuctDiameter,
        info: {
			descriptionKey: "equivalent_duct_diameter_desc",
			detailsKey: "equivalent_duct_diameter_details",
			formula: {
				nameKey: "equivalent_duct_diameter_formula_name",
				descriptionKey: "equivalent_duct_diameter_formula_desc"
			}
		}
    },
	
    {
        id: "airflow_from_effective_area",
        nameKey: "airflow_from_effective_area",
        categories: ["ventilation"],
        unit: "l/s",
        decimaler: 1,
        inputs: [
			{ id: "airVelocity", labelKey: "average_air_velocity", unit: ["m/s"] },
			{ id: "effectiveArea", labelKey: "effective_area", unit: ["m²"] }
		],
        calc: calculateAirflowFromEffectiveArea,
        info: {
			descriptionKey: "airflow_from_effective_area_desc",
			detailsKey: "airflow_from_effective_area_details",
			formula: {
				nameKey: "airflow_from_effective_area_formula_name",
				descriptionKey: "airflow_from_effective_area_formula_desc"
			}
		}
    },
    {
        id: "heat_recovery_efficiency",
        nameKey: "heat_recovery_efficiency",
        categories: ["ventilation"],
        unit: "",
        decimaler: 2,
        inputs: [
			{ id: "supplyAirTemperature", labelKey: "supply_air_after_hex", unit: ["celsius"] },
			{ id: "outdoorAirTemperature", labelKey: "outdoor_air_before_hex", unit: ["celsius"] },
			{ id: "extractAirTemperature", labelKey: "extract_air_before_hex", unit: ["celsius"] }
		],
        calc: calculateHeatRecoveryEfficiency,
		info: {
			descriptionKey: "heat_recovery_efficiency_desc",
			detailsKey: "heat_recovery_efficiency_details",
			formula: {
				nameKey: "heat_recovery_efficiency_formula_name",
				descriptionKey: "heat_recovery_efficiency_formula_desc"
			}
		}

    },
    {
        id: "mixed_air_temperature",
        nameKey: "mixed_air_temperature",
        categories: ["ventilation", "controls"],
        unit: "°C",
        decimaler: 1,
		inputs: [
			{ id: "outdoorAirflow", labelKey: "outdoor_airflow", unit: ["ls", "m3h"], base: "ls" },
			{ id: "outdoorAirTemperature", labelKey: "outdoor_air_temperature", unit: ["celsius"] },
			{ id: "returnAirflow", labelKey: "return_airflow", unit: ["ls", "m3h"], base: "ls" },
			{ id: "returnAirTemperature", labelKey: "return_air_temperature", unit: ["celsius"] },
			{ id: "totalAirflow", labelKey: "total_mixed_airflow", unit: ["ls", "m3h"], base: "ls" }
		],

        calc: calculateMixedAirTemperature,
		info: {
			descriptionKey: "mixed_air_temperature_desc",
			detailsKey: "mixed_air_temperature_details",
			formula: {
				nameKey: "mixed_air_temperature_formula_name",
				descriptionKey: "mixed_air_temperature_formula_desc"
			}
		}
    }
];