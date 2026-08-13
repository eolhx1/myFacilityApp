//
// filenamne: ./calculations/energy.js
//

// =================================================================
// ENERGI KALKYLER
// =================================================================
import { valid } from './config.js';

const calculateTransmissionHeatLoss = (v) => {
    if (!valid(v.u_varde, v.area, v.inne_temp, v.ute_temp)) return "Fel";
    const deltaT = v.inne_temp - v.ute_temp;
    const effekt_W = v.u_varde * v.area * deltaT;
    const effekt_kW = effekt_W / 1000;
    
    return `Effektförlust: ${effekt_W.toFixed(0)} W\n` +
           `Vilket motsvarar: ${effekt_kW.toFixed(2)} kW`;
};

const calculateCOP = (v) => {
    if (!valid(v.avgiven_effekt, v.tillford_eleffekt) || v.tillford_eleffekt === 0) return "Fel";
    const cop = v.avgiven_effekt / v.tillford_eleffekt;
    return `Värmefaktor (COP): ${cop.toFixed(2)}\n` +
           `Snabbkoll: För varje kW el får du ut ${cop.toFixed(1)} kW värme.`;
};

const calculateEER = (v) => {
    if (!valid(v.kyleffekt, v.tillford_eleffekt) || v.tillford_eleffekt === 0) return "Fel";
    const eer = v.kyleffekt / v.tillford_eleffekt;
    return `Kylfaktor (EER): ${eer.toFixed(2)}\n` +
           `Snabbkoll: För varje kW el får ut ${eer.toFixed(1)} kW kyla.`;
};

export const energyCalculations = [
    {
        id: "transmission_heat_loss",
        name: "Värmeförlust (Transmissionsförlust)",
        categories: ["energy"],
        decimaler: 0,
        inputs: [
            { id: "u_varde", label: "U-värde [W/(m²·K)]" },
            { id: "area", label: "Ytans area [m²]" },
            { id: "inne_temp", label: "Innetemperatur [°C]" },
            { id: "ute_temp", label: "Utetemperatur (t.ex. DUT) [°C]" }
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
        name: "Värmepumpens Verkningsgrad (COP)",
        categories: ["energy"],
        decimaler: 2,
        inputs: [
            { id: "avgiven_effekt", label: "Avgiven värmeeffekt [kW]" },
            { id: "tillford_eleffekt", label: "Tillförd eleffekt [kW]" }
        ],
        calc: calculateCOP,
        info: {
            description: "Beräknar värmepumpens aktuella verkningsgrad (COP).",
            details: "Visar förhållandet mellan producerad värmeenergi och tillförd elektrisk energi under driftförhållanden.",
            formula: { name: "COP", description: "COP = Avgiven värmeeffekt / Tillförd eleffekt" }
        }
    },
    {
        id: "cooling_eer",
        name: "Kylmaskinens Verkningsgrad (EER)",
        categories: ["energy"],
        decimaler: 2,
        inputs: [
            { id: "kyleffekt", label: "Avgiven kyleffekt [kW]" },
            { id: "tillford_eleffekt", label: "Tillförd eleffekt [kW]" }
        ],
        calc: calculateEER,
        info: {
            description: "Beräknar kylmaskinens aktuella verkningsgrad (EER).",
            details: "Visar effektiviteten för kylanläggningar genom att ställa levererad kyleffekt i relation till tillförd driftel.",
            formula: { name: "EER", description: "EER = Avgiven kyleffekt / Tillförd eleffekt" }
        }
    }
];