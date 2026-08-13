//
// filenamne: ./calculations/plumbing.js
//

// =================================================================
// Fil: kalkyler/plumbing.js
// =================================================================

import { valid, formatResult } from './config.js';

// --- Beräkningsfunktioner (VS & Värme) ---
const calculateRequiredRadiatorFlow = (v) => {
    if (!valid(v.heatOutput, v.temperatureDifference)) return "Fel";
    if (v.temperatureDifference === 0) return "Fel (0-division)";
    const flowRateLh = (v.heatOutput / (4180 * v.temperatureDifference)) * 3600;
    
    let resultText = `Flöde: ${formatResult(flowRateLh, 1)} l/h\n`;
    resultText += `Flöde: ${formatResult(flowRateLh / 3600, 4)} l/s`;
    return resultText;
};

const calculateKvValue = (v) => {
    if (!valid(v.flowRateM3h, v.pressureDrop) || v.pressureDrop <= 0) return "Fel";

    const kvValue = v.flowRateM3h / Math.sqrt(v.pressureDrop);

    return `Kv-värde: ${kvValue.toFixed(2)}`;
};

const calculateRadiatorOutputAtNewTemperature = (v) => {
    if (!valid(v.designHeatOutput, v.newTemperatureDifference, v.oldTemperatureDifference, v.radiatorExponent) || v.oldTemperatureDifference === 0) return "Fel";
    const newHeatOutput = v.designHeatOutput * Math.pow(v.newTemperatureDifference / v.oldTemperatureDifference, v.radiatorExponent);
    return `Ny radiatoreffekt: ${newHeatOutput.toFixed(0)} W`;
};

const calculateBalancingRatio = (v) => {
    if (!valid(v.measuredFlow, v.designFlow) || v.designFlow === 0) return "Fel";
    const ratio = v.measuredFlow / v.designFlow;
return `Injusteringskvot: ${ratio.toFixed(2)}`;
};

const calculatePipePressureDrop = (v) => {
    if (!valid(v.frictionResistance, v.pipeLength)) return "Fel";
    const pressureDropPa = v.frictionResistance * v.pipeLength;
    const totalPressureDrop = pressureDropPa * 1.4;

    let resultText = `Rörnätets tryckfall: ${formatResult(totalPressureDrop, 0)} Pa\n`;
    resultText += `Inkl. kopplingar (~40%): ${formatResult(totalPressureDrop / 1000, 2)} kPa`;
    return resultText;
};

// Affinitetslagar för Pumpar
const calculatePumpAffinityLaws = (v) => {
    if (!valid(v.currentSpeed, v.newSpeed, v.currentFlow, v.currentPressure, v.currentPower)) return "Fel";
    
const speedRatio = v.newSpeed / v.currentSpeed;
const newFlow = v.currentFlow * speedRatio;
const newPressure = v.currentPressure * Math.pow(speedRatio, 2);
const newPower = v.currentPower * Math.pow(speedRatio, 3);
    
return `Nytt flöde (Q2): ${newFlow.toFixed(2)} l/s\n` +
       `Nytt tryck / uppfordringshöjd (P2): ${newPressure.toFixed(1)} kPa\n` +
       `Ny effekt (E2): ${newPower.toFixed(2)} kW`;
};

const calculateOnePipeTemperatureDrop = (v) => {
    if (!valid(v.supplyTemperature, v.heatOutput, v.loopFlow) || v.loopFlow === 0) return "Fel";
    const flowRateM3s = v.loopFlow / 3600000;
    const denominator = flowRateM3s * 4180 * 1000;

    if (denominator === 0) return "Fel (0-division)";
    const nextTemperature = v.supplyTemperature - (v.heatOutput / denominator);
    return `Framledning efter radiator: ${nextTemperature.toFixed(1)} °C`;
};

const calculateHeatOutputFromFlow = (v) => {
    if (!valid(v.flowRateLs, v.temperatureDifference)) return "Fel";
    const heatOutputKw = v.flowRateLs * 4.19 * v.temperatureDifference;
    return `Överförd effekt: ${heatOutputKw.toFixed(2)} kW`;
};

const calculateWaterExpansion = (v) => {
    if (!valid(v.systemVolumeM3, v.coldTemperature, v.hotTemperature)) return "Fel";
    const expansionFactor = (v.hotTemperature - v.coldTemperature) * 0.00035; 
    const expansionVolumeLiters = v.systemVolumeM3 * 1000 * expansionFactor;
    
    return `Volymökning: ${expansionVolumeLiters.toFixed(1)} liter\n` +
           `Total ny volym: ${(v.systemVolumeM3 * 1000 + expansionVolumeLiters).toFixed(1)} liter`;
};

const calculateBrineHeatTransfer = (v) => {
    if (!valid(v.flowRateLs, v.temperatureDifference)) return "Fel";
    const heatOutputKw = v.flowRateLs * 4.0 * v.temperatureDifference;
    return `Kyl- / Värmebärareeffekt: ${heatOutputKw.toFixed(2)} kW`;
};

// --- Kalkyl-array (VS) ---
export const plumbingCalculations = [
    {
        id: "required_radiator_flow",
        name: "Radiatorflöde & Effekt (VS)",
        categories: ["plumbing"],
        unit: "l/h",
        decimaler: 1,
        inputs: [
            { id: "heatOutput", label: "Radiatoreffekt (P)", unit: ["W"] },
            { id: "temperatureDifference", label: "Temperaturskillnad (ΔT)", unit: ["°C"] }
        ],
        calc: calculateRequiredRadiatorFlow,
        info: {
            description: "Beräknar erforderligt vattenflöde för en given radiatoreffekt.",
            details: "Används för att bestämma det flöde i l/h eller l/s som krävs för att avge en specifik effekt vid vald temperaturskillnad (ΔT). Bygger på vattnets specifika värmekapacitet.",
			formula: {
				name: "Radiatorflöde",
				description: "Flöde = Effekt / (4180 × ΔT)"
			}
        }
    },
    {
        id: "valve_kv_value",
        name: "K<sub>v</sub>-värde (Ventilinställning)",
        categories: ["plumbing"],
        unit: "",
        decimaler: 2,
        inputs: [
            { id: "flowRateM3h", label: "Flöde (q)", unit: ["m³/h"] },
            { id: "pressureDrop", label: "Tryckfall över ventil (Δp)", unit: ["bar"] }
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
        name: "Radiatoreffekt vid ny temperatur",
        categories: ["plumbing"],
        unit: "W",
        decimaler: 0,
        inputs: [
            { id: "designHeatOutput", label: "Projekterad effekt", unit: ["W"] },
            { id: "newTemperatureDifference", label: "Ny övertemperatur (ΔT_ny)", unit: ["°C"] },
            { id: "oldTemperatureDifference", label: "Gammal övertemperatur (ΔT_gammal)", unit: ["°C"] },
            { id: "radiatorExponent", label: "Radiatorexponent (n)" }
        ],
        calc: calculateRadiatorOutputAtNewTemperature,
        info: {
            description: "Beräknar förändrad radiatoreffekt vid sänkt framledningstemperatur.",
            details: "Hjälper till att utreda om befintliga radiatorer klarar att hålla värmen vid övergång till lågtemperatursystem (t.ex. konvertering från direktverkande el eller olja till värmepump).",
			formula: {
				name: "Radiatoreffekt vid ny temperatur",
				description: "P₂ = P₁ × (ΔT₂ / ΔT₁)^n"
			}
        }
    },
	
    {
        id: "balancing_ratio",
        name: "Proportionalitetsmetoden (VS)",
        categories: ["plumbing"],
        unit: "",
        decimaler: 2,
        inputs: [
            { id: "measuredFlow", label: "Uppmätt flöde", unit: ["l/h", "m³/h"] },
            { id: "designFlow", label: "Projekterat flöde", unit: ["l/h", "m³/h"] }
        ],
        calc: calculateBalancingRatio,
        info: {
            description: "Beräknar injusteringskvoten för stammar och ventiler.",
            details: "Används vid injustering enligt proportionalitetsmetoden för att snabbt räkna ut inställningsvärden baserat på förhållandet mellan uppmätt och projekterat flöde.",
			formula: {
				name: "Proportionalitetsmetoden",
				description: "Kvot = Uppmätt flöde / Projekterat flöde"
			}
        }
    },
	
    {
        id: "pipe_pressure_drop",
        name: "Tryckfall i rör (VS)",
        categories: ["plumbing"],
        unit: "",
        decimaler: 0,
        inputs: [
            { id: "frictionResistance", label: "Friktionsmotstånd (R) [Pa/m]", unit: ["Pa/m"] },
            { id: "pipeLength", label: "Rörsatsens totala längd (fram + retur)", unit: ["m"] }
        ],
        calc: calculatePipePressureDrop,
        info: {
            description: "Beräknar tryckfall i rörnätet inklusive schablon för kopplingar.",
            details: "Multiplicerar rörlängden med friktionsmotståndet och lägger schablonmässigt till 40 % extra tryckfall för att kompensera för rördelar, ventiler och kopplingar.",
			formula: {
				name: "Tryckfall i rör",
				description: "Δp = R × L × 1,4"
			}
        }
    },
	
    {
        id: "pump_affinity_laws",
        name: "Affinitetslagar (Pump)",
        categories: ["plumbing"],
        decimaler: 2,
        inputs: [
            { id: "currentSpeed", label: "Nuvarande varvtal / frekvens [varv/min eller Hz]" },
            { id: "newSpeed", label: "Nytt varvtal / frekvens [varv/min eller Hz]" },
            { id: "currentFlow", label: "Nuvarande flöde [l/s]" },
            { id: "currentPressure", label: "Nuvarande tryck [kPa]" },
            { id: "currentPower", label: "Nuvarande effekt [kW]" }
        ],
        calc: calculatePumpAffinityLaws,
        info: {
            description: "Beräknar nytt flöde, tryck och effekt vid ändrat pumpvarvtal.",
            details: "Baserat på affinitetslagarna: flödet är direkt proportionellt mot varvtalet, trycket mot kvadraten och effekten mot kubiken på varvtalsändringen.",
			formula: {
				name: "Affinitetslagar för pumpar",
				description: "Q₂/Q₁ = n₂/n₁, P₂/P₁ = (n₂/n₁)², E₂/E₁ = (n₂/n₁)³"
			}
        }
    },
	
    {
        id: "one_pipe_temperature_drop",
        name: "Framledningstemperatur Ettrörssystem",
        categories: ["plumbing"],
        unit: "°C",
        decimaler: 1,
        inputs: [
            { id: "supplyTemperature", label: "Ingående framledningstemperatur", unit: ["celsius"] },
            { id: "heatOutput", label: "Radiatoreffekt (P)", unit: ["W"] },
            { id: "loopFlow", label: "Slingans totala vattenflöde", unit: ["l/h"] }
        ],
        calc: calculateOnePipeTemperatureDrop,
        info: {
            description: "Beräknar avkylningen per radiator i en seriekopplad ettrörsslinga.",
            details: "Visar hur mycket framledningstemperaturen sjunker efter en radiator beroende på dess effektuttag och slingans totala vattenflöde.",
			formula: {
				name: "Temperatursänkning",
				description: "T₂ = T₁ − (P / (q × ρ × cp))"
			}

        }
    },
    {
        id: "heat_output_from_flow",
        name: "Värmeeffekt från Flöde & ΔT",
        categories: ["plumbing"],
        unit: "kW",
        decimaler: 2,
        inputs: [
            { id: "flowRateLs", label: "Vattenflöde [l/s]", unit: ["l/s"] },
            { id: "temperatureDifference", label: "Temperaturskillnad (fram - retur) [°C]", unit: ["°C"] }
        ],
        calc: calculateHeatOutputFromFlow,
        info: {
            description: "Beräknar överförd värmeeffekt i kW baserat på flöde och ΔT.",
            details: "Används ofta vid mätning eller verifiering av effekten i kulvertar, värmeväxlare eller större värmekretsar.",
			formula: {
				name: "Värmeeffekt",
				description: "P = q × 4,19 × ΔT"
			}
        }
    },
    {
        id: "water_expansion",
        name: "Vattenexpansion i system",
        categories: ["plumbing"],
        unit: "liter",
        decimaler: 1,
        inputs: [
            { id: "systemVolumeM3", label: "Systemets totala vattenvolym [m³]", unit: ["m³"] },
            { id: "coldTemperature", label: "Kallvattentemperatur (fyllning) [°C]", unit: ["°C"] },
            { id: "hotTemperature", label: "Max drifttemperatur [°C]", unit: ["°C"] }
        ],
        calc: calculateWaterExpansion,
        info: {
            description: "Beräknar vattenexpansion vid uppvärmning från fyll- till drifttemperatur.",
            details: "Hjälper till att bestämma volymökningen i ett slutet värmesystem, vilket är grundläggande vid dimensionering eller kontroll av expansionskärl.",
			formula: {
				name: "Vattenexpansion",
				description: "Expansionsvolym = Systemvolym × Temperaturökning × 0,00035"
			}
        }
    },
    {
        id: "brine_heat_transfer",
        name: "Effekt köldbärare (Flöde & ΔT)",
        categories: ["energy", "plumbing"],
        decimaler: 2,
        inputs: [
            { id: "flowRateLs", label: "Köldbärarens flöde [l/s]" },
            { id: "temperatureDifference", label: "Temperaturskillnad (In - Ut) [°C]" }
        ],
        calc: calculateBrineHeatTransfer,
        info: {
            description: "Beräknar kyleffekt eller värmeeffekt i köld-/värmebärarsystem.",
            details: "Anpassad för system med köldbärare (t.ex. glykolblandningar) där värmekapaciteten avviker något från rent vatten.",
			formula: {
				name: "Köldbärareffekt",
				description: "P = q × 4,0 × ΔT"
			}

        }
    }
];
