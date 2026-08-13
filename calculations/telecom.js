//
// filenamne: ./calculations/telecom.js
//

// =================================================================
// TELE & DATA KALKYLER
// =================================================================
import { valid } from './config.js';

const calculateFiberLossBudget = (v) => {
    if (!valid(v.langd_km, v.antal_svetsar, v.antal_kontakter)) return "Fel";
    
    const dampningFiber = v.langd_km * 0.4;
    const dampningSvetsar = v.antal_svetsar * 0.05;
    const dampningKontakter = v.antal_kontakter * 0.5;
    const totalDampning = dampningFiber + dampningSvetsar + dampningKontakter;
    
    return `Max tillåten dämpning: ${totalDampning.toFixed(2)} dB\n` +
           `- Fiber (${v.langd_km} km): ${dampningFiber.toFixed(2)} dB\n` +
           `- Svetsar (${v.antal_svetsar} st): ${dampningSvetsar.toFixed(2)} dB\n` +
           `- Kontakter (${v.antal_kontakter} st): ${dampningKontakter.toFixed(2)} dB`;
};

const calculatePoEVoltageDrop = (v) => {
    if (!valid(v.kabellangd_m, v.effekt_w)) return "Fel";
    
    const utspänningV = 48;
    const resistansOhm = v.kabellangd_m * 0.1;
    const stromA = v.effekt_w / utspänningV;
    const spanningsfallV = resistansOhm * stromA;
    const slutSpanningV = utspänningV - spanningsfallV;
    
    let status = "OK - Spänningen räcker till enheten.";
    if (v.kabellangd_m > 100) {
        status = "Varning: Kabeln är längre än 100 m (Ethernet-gräns)!";
    } else if (slutSpanningV < 37) {
        status = "Varning: För stort spänningsfall! Enheten riskerar att inte starta.";
    }

    return `Framme vid enhet: ${slutSpanningV.toFixed(1)} V\n` +
           `Spänningsfall: ${spanningsfallV.toFixed(2)} V\n` +
           `Status: ${status}`;
};

export const telecomCalculations = [
    {
        id: "fiber_loss_budget",
        name: "Dämpningsbudget Fiberlänk",
        categories: ["telecom"],
        decimaler: 2,
        inputs: [
            { id: "langd_km", label: "Fiberlängd [km]" },
            { id: "antal_svetsar", label: "Antal svetsar" },
            { id: "antal_kontakter", label: "Antal kontaktpar (hane/hona)" }
        ],
        calc: calculateFiberLossBudget,
        info: {
            description: "Beräknar maximalt tillåten dämpning för en fiberlänk.",
            details: "Används för att säkerställa att optiska länkar klarar dämpningskraven baserat på standardvärden för fiberkablar, svetsar och anslutningskontakter.",
            formula: { name: "Loss Budget", description: "Totalt = (Längd × 0.4) + (Svetsar × 0.05) + (Kontakter × 0.5)" }
        }
    },
    {
        id: "poe_voltage_drop",
        name: "PoE Spänningsfall & Längdkoll",
        categories: ["telecom"],
        decimaler: 2,
        inputs: [
            { id: "kabellangd_m", label: "Kabellängd [m]" },
            { id: "effekt_w", label: "Enhetens effektförbrukning [W]" }
        ],
        calc: calculatePoEVoltageDrop,
        info: {
            description: "Kollar spänning och kabellängd för PoE-matade nätverksenheter.",
            details: "Beräknar spänningsfallet i kopparkabeln (AWG24) för att säkerställa att spänningen framme vid enheten (t.ex. IP-kamera eller accesspunkt) inte understiger kritiska nivåer.",
            formula: { name: "Spänningsfall i tråd", description: "U_fall = R × (P / U_ut)" }
        }
    }
];