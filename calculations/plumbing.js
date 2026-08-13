//
// filenamne: ./calculations/plumbing.js
//

// =================================================================
// Fil: kalkyler/plumbing.js
// =================================================================

import { valid, formatResult } from './config.js';

// --- Beräkningsfunktioner (VS & Värme) ---
const calculateRequiredRadiatorFlow = (v) => {
    if (!valid(v.effekt, v.dt)) return "Fel";
    if (v.dt === 0) return "Fel (0-division)";
    const flode_lh = (v.effekt / (4180 * v.dt)) * 3600;
    
    let resultatText = `Flöde: ${formatResult(flode_lh, 1)} l/h\n`;
    resultatText += `Flöde: ${formatResult(flode_lh / 3600, 4)} l/s`;
    return resultatText;
};

const calculateKvValue = (v) => {
    if (!valid(v.flode_m3h, v.tryckfall) || v.tryckfall <= 0) return "Fel";
    const kv = v.flode_m3h / Math.sqrt(v.tryckfall);
    return kv;
};

const calculateRadiatorOutputAtNewTemperature = (v) => {
    if (!valid(v.p_proj, v.dt_ny, v.dt_gammal, v.exponent) || v.dt_gammal === 0) return "Fel";
    const p_ny = v.p_proj * Math.pow(v.dt_ny / v.dt_gammal, v.exponent);
    return p_ny;
};

const calculateBalancingRatio = (v) => {
    if (!valid(v.q_matt, v.q_proj) || v.q_proj === 0) return "Fel";
    return v.q_matt / v.q_proj;
};

const calculatePipePressureDrop = (v) => {
    if (!valid(v.R, v.L)) return "Fel";
    const delta_p_pa = v.R * v.L;
    const delta_p_total = delta_p_pa * 1.4;

    let resultatText = `Rörnätets tryckfall: ${formatResult(delta_p_total, 0)} Pa\n`;
    resultatText += `Inkl. kopplingar (~40%): ${formatResult(delta_p_total / 1000, 2)} kPa`;
    return resultatText;
};

// Affinitetslagar för Pumpar
const calculatePumpAffinityLaws = (v) => {
    if (!valid(v.n1, v.n2, v.q1, v.p1, v.e1)) return "Fel";
    
    const kvot = v.n2 / v.n1;
    const q2 = v.q1 * kvot;
    const p2 = v.p1 * Math.pow(kvot, 2);
    const e2 = v.e1 * Math.pow(kvot, 3);
    
    return `Nytt flöde (Q2): ${q2.toFixed(2)} l/s\n` +
           `Nytt tryck / uppfordringshöjd (p2): ${p2.toFixed(1)} kPa\n` +
           `Ny effekt (P2): ${e2.toFixed(2)} kW`;
};

const calculateOnePipeTemperatureDrop = (v) => {
    if (!valid(v.t_fram, v.effekt, v.q_slinga) || v.q_slinga === 0) return "Fel";
    const flode_m3s = v.q_slinga / 3600000;
    const namnare = flode_m3s * 4180 * 1000;

    if (namnare === 0) return "Fel (0-division)";
    const t_nasta = v.t_fram - (v.effekt / namnare);
    return t_nasta;
};

const calculateHeatOutputFromFlow = (v) => {
    if (!valid(v.flode_ls, v.dt)) return "Fel";
    const effekt_kw = v.flode_ls * 4.19 * v.dt;
    return `Överförd effekt: ${effekt_kw.toFixed(2)} kW`;
};

const calculateWaterExpansion = (v) => {
    if (!valid(v.volym_m3, v.t_kall, v.t_varm)) return "Fel";
    const expansion_procent = (v.t_varm - v.t_kall) * 0.00035; 
    const expansionsvolym_liter = v.volym_m3 * 1000 * expansion_procent;
    
    return `Volymökning: ${expansionsvolym_liter.toFixed(1)} liter\n` +
           `Total ny volym: ${(v.volym_m3 * 1000 + expansionsvolym_liter).toFixed(1)} liter`;
};

const calculateBrineHeatTransfer = (v) => {
    if (!valid(v.flode_ls, v.dt)) return "Fel";
    const effekt_kw = v.flode_ls * 4.0 * v.dt;
    return `Kyl- / Värmebärareeffekt: ${effekt_kw.toFixed(2)} kW`;
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
            { id: "effekt", label: "Radiatoreffekt (P)", unit: ["W"] },
            { id: "dt", label: "Temperaturskillnad (ΔT)", unit: ["°C"] }
        ],
        calc: calculateRequiredRadiatorFlow,
        info: {
            description: "Beräknar erforderligt vattenflöde för en given radiatoreffekt.",
            details: "Används för att bestämma det flöde i l/h eller l/s som krävs för att avge en specifik effekt vid vald temperaturskillnad (ΔT). Bygger på vattnets specifika värmekapacitet."
        }
    },
    {
        id: "valve_kv_value",
        name: "K<sub>v</sub>-värde (Ventilinställning)",
        categories: ["plumbing"],
        unit: "",
        decimaler: 2,
        inputs: [
            { id: "flode_m3h", label: "Flöde (q)", unit: ["m³/h"] },
            { id: "tryckfall", label: "Tryckfall över ventil (Δp)", unit: ["bar"] }
        ],
        calc: calculateKvValue,
        info: {
            description: "Beräknar ventilens K<sub>v</sub>-värde för flödesinställning.",
            details: "K<sub>v</sub>-värdet definieras som det flöde i m³/h som passerar ventilen vid ett tryckfall på 1 bar. Viktigt verktyg vid injustering av stam- och radiatordon."
        }
    },
    {
        id: "radiator_output_at_new_temperature",
        name: "Radiatoreffekt vid ny temperatur",
        categories: ["plumbing"],
        unit: "W",
        decimaler: 0,
        inputs: [
            { id: "p_proj", label: "Projekterad effekt", unit: ["W"] },
            { id: "dt_ny", label: "Ny övertemperatur (ΔT_ny)", unit: ["°C"] },
            { id: "dt_gammal", label: "Gammal övertemperatur (ΔT_gammal)", unit: ["°C"] },
            { id: "exponent", label: "Radiatorexponent (n)" }
        ],
        calc: calculateRadiatorOutputAtNewTemperature,
        info: {
            description: "Beräknar förändrad radiatoreffekt vid sänkt framledningstemperatur.",
            details: "Hjälper till att utreda om befintliga radiatorer klarar att hålla värmen vid övergång till lågtemperatursystem (t.ex. konvertering från direktverkande el eller olja till värmepump)."
        }
    },
    {
        id: "balancing_ratio",
        name: "Proportionalitetsmetoden (VS)",
        categories: ["plumbing"],
        unit: "",
        decimaler: 2,
        inputs: [
            { id: "q_matt", label: "Uppmätt flöde", unit: ["l/h", "m³/h"] },
            { id: "q_proj", label: "Projekterat flöde", unit: ["l/h", "m³/h"] }
        ],
        calc: calculateBalancingRatio,
        info: {
            description: "Beräknar injusteringskvoten för stammar och ventiler.",
            details: "Används vid injustering enligt proportionalitetsmetoden för att snabbt räkna ut inställningsvärden baserat på förhållandet mellan uppmätt och projekterat flöde."
        }
    },
    {
        id: "pipe_pressure_drop",
        name: "Tryckfall i rör (VS)",
        categories: ["plumbing"],
        unit: "",
        decimaler: 0,
        inputs: [
            { id: "R", label: "Friktionsmotstånd (R) [Pa/m]", unit: ["Pa/m"] },
            { id: "L", label: "Rörsatsens totala längd (fram + retur)", unit: ["m"] }
        ],
        calc: calculatePipePressureDrop,
        info: {
            description: "Beräknar tryckfall i rörnätet inklusive schablon för kopplingar.",
            details: "Multiplicerar rörlängden med friktionsmotståndet och lägger schablonmässigt till 40 % extra tryckfall för att kompensera för rördelar, ventiler och kopplingar."
        }
    },
    {
        id: "pump_affinity_laws",
        name: "Affinitetslagar (Pump)",
        categories: ["plumbing"],
        decimaler: 2,
        inputs: [
            { id: "n1", label: "Nuvarande varvtal / frekvens [varv/min eller Hz]" },
            { id: "n2", label: "Nytt varvtal / frekvens [varv/min eller Hz]" },
            { id: "q1", label: "Nuvarande flöde [l/s]" },
            { id: "p1", label: "Nuvarande tryck [kPa]" },
            { id: "e1", label: "Nuvarande effekt [kW]" }
        ],
        calc: calculatePumpAffinityLaws,
        info: {
            description: "Beräknar nytt flöde, tryck och effekt vid ändrat pumpvarvtal.",
            details: "Baserat på affinitetslagarna: flödet är direkt proportionellt mot varvtalet, trycket mot kvadraten och effekten mot kubiken på varvtalsändringen."
        }
    },
    {
        id: "one_pipe_temperature_drop",
        name: "Framledningstemperatur Ettrörssystem",
        categories: ["plumbing"],
        unit: "°C",
        decimaler: 1,
        inputs: [
            { id: "t_fram", label: "Ingående framledningstemp (T_fram)", unit: ["celsius"] },
            { id: "effekt", label: "Radiatoreffekt (P)", unit: ["W"] },
            { id: "q_slinga", label: "Slingans totala vattenflöde", unit: ["l/h"] }
        ],
        calc: calculateOnePipeTemperatureDrop,
        info: {
            description: "Beräknar avkylningen per radiator i en seriekopplad ettrörsslinga.",
            details: "Visar hur mycket framledningstemperaturen sjunker efter en radiator beroende på dess effektuttag och slingans totala vattenflöde."
        }
    },
    {
        id: "heat_output_from_flow",
        name: "Värmeeffekt från Flöde & ΔT",
        categories: ["plumbing"],
        unit: "kW",
        decimaler: 2,
        inputs: [
            { id: "flode_ls", label: "Vattenflöde [l/s]", unit: ["l/s"] },
            { id: "dt", label: "Temperaturskillnad (fram - retur) [°C]", unit: ["°C"] }
        ],
        calc: calculateHeatOutputFromFlow,
        info: {
            description: "Beräknar överförd värmeeffekt i kW baserat på flöde och ΔT.",
            details: "Används ofta vid mätning eller verifiering av effekten i kulvertar, värmeväxlare eller större värmekretsar."
        }
    },
    {
        id: "water_expansion",
        name: "Vattenexpansion i system",
        categories: ["plumbing"],
        unit: "liter",
        decimaler: 1,
        inputs: [
            { id: "volym_m3", label: "Systemets totala vattenvolym [m³]", unit: ["m³"] },
            { id: "t_kall", label: "Kallvattentemperatur (fyllning) [°C]", unit: ["°C"] },
            { id: "t_varm", label: "Max drifttemperatur [°C]", unit: ["°C"] }
        ],
        calc: calculateWaterExpansion,
        info: {
            description: "Beräknar vattenexpansion vid uppvärmning från fyll- till drifttemperatur.",
            details: "Hjälper till att bestämma volymökningen i ett slutet värmesystem, vilket är grundläggande vid dimensionering eller kontroll av expansionskärl."
        }
    },
    {
        id: "brine_heat_transfer",
        name: "Effekt köldbärare (Flöde & ΔT)",
        categories: ["enery", "plumbing"],
        decimaler: 2,
        inputs: [
            { id: "flode_ls", label: "Köldbärarens flöde [l/s]" },
            { id: "dt", label: "Temperaturskillnad (In - Ut) [°C]" }
        ],
        calc: calculateBrineHeatTransfer,
        info: {
            description: "Beräknar kyleffekt eller värmeeffekt i köld-/värmebärarsystem.",
            details: "Anpassad för system med köldbärare (t.ex. glykolblandningar) där värmekapaciteten avviker något från rent vatten."
        }
    }
];
