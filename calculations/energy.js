//
// filenamne: ./calculations/energy.js
//

// =================================================================
// ENERGI KALKYLER
// =================================================================
import { valid } from './config.js';

const calculateTransmissionHeatLoss = (v) => {
    if (!valid(v.uValue, v.area, v.indoorTemperature, v.outdoorTemperature)) return "Fel";
    const deltaT = v.indoorTemperature - v.outdoorTemperature;
    const heatLossW = v.uValue * v.area * deltaT;
    const heatLossKW = heatLossW / 1000;
    
    return `Effektförlust: ${heatLossW.toFixed(0)} W\n` +
           `Vilket motsvarar: ${heatLossKW.toFixed(2)} kW`;
};

const calculateCOP = (v) => {
    if (!valid(v.heatingOutput, v.electricalInput) || v.electricalInput === 0) return "Fel";
    const cop = v.heatingOutput / v.electricalInput;
    return `Värmefaktor (COP): ${cop.toFixed(2)}\n` +
           `Snabbkoll: För varje kW el får du ut ${cop.toFixed(1)} kW värme.`;
};

const calculateEER = (v) => {
    if (!valid(v.coolingOutput, v.electricalInput) || v.electricalInput === 0) return "Fel";
    const eer = v.coolingOutput / v.electricalInput;
    return `Kylfaktor (EER): ${eer.toFixed(2)}\n` +
           `Snabbkoll: För varje kW el får du ut ${eer.toFixed(1)} kW kyla.`;
};

export const energyCalculations = [
    {
        id: "transmission_heat_loss",
        name: "Värmeförlust (Transmissionsförlust)",
        categories: ["energy"],
        decimaler: 0,
        inputs: [
            { id: "uValue", label: "U-värde [W/(m²·K)]" },
            { id: "area", label: "Ytans area [m²]" },
            { id: "indoorTemperature", label: "Innetemperatur [°C]" },
            { id: "outdoorTemperature", label: "Utetemperatur (t.ex. DUT) [°C]" }
        ],
        calc: calculateTransmissionHeatLoss,
        info: {
            description: "Beräknar värmeeffekt som läcker ut genom byggnadsdelar.",
            details: "Används för att uppskatta transmissionsförluster genom väggar, tak och fönster baserat på materialets U-värde, ytarea och temperaturskillnad.",
            formula: { name: "Transmissionsförlust", description: "P = U × A × ΔT" }
        }
    },
    {
        id: "heat_pump_cop",
        name: "Värmefaktor (COP)",
        categories: ["energy"],
        decimaler: 2,
        inputs: [
            { id: "heatingOutput", label: "Avgiven värmeeffekt [kW]" },
            { id: "electricalInput", label: "Tillförd eleffekt [kW]" }
        ],
        calc: calculateCOP,
        info: {
            description: "Beräknar värmepumpens värmefaktor (COP).",
            details: "Visar förhållandet mellan producerad värmeenergi och tillförd elektrisk energi under driftförhållanden.",
            formula: { name: "COP", description: "COP = Avgiven värmeeffekt / Tillförd eleffekt" }
        }
    },
    {
        id: "cooling_eer",
        name: "Kylfaktor (EER)",
        categories: ["energy"],
        decimaler: 2,
        inputs: [
            { id: "coolingOutput", label: "Avgiven kyleffekt [kW]" },
            { id: "electricalInput", label: "Tillförd eleffekt [kW]" }
        ],
        calc: calculateEER,
        info: {
            description: "Beräknar kylanläggningens kylfaktor (EER).",
            details: "Visar effektiviteten för kylanläggningar genom att ställa levererad kyleffekt i relation till tillförd driftel.",
            formula: { name: "EER", description: "EER = Avgiven kyleffekt / Tillförd eleffekt" }
        }
    }
];