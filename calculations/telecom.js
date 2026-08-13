//
// filenamne: ./calculations/telecom.js
//

// =================================================================
// TELE & DATA KALKYLER
// =================================================================
import { valid } from './config.js';

const calculateFiberLossBudget = (v) => {
    if (!valid(v.fiberLengthKm, v.spliceCount, v.connectorCount)) return "Fel";
    
    const fiberLoss = v.fiberLengthKm * 0.4;
    const spliceLoss = v.spliceCount * 0.05;
    const connectorLoss = v.connectorCount * 0.5;
    const totalLoss = fiberLoss + spliceLoss + connectorLoss;
    
    return `Max tillåten dämpning: ${totalLoss.toFixed(2)} dB\n` +
           `- Fiber (${v.fiberLengthKm} km): ${fiberLoss.toFixed(2)} dB\n` +
           `- Svetsar (${v.spliceCount} st): ${spliceLoss.toFixed(2)} dB\n` +
           `- Kontakter (${v.connectorCount} st): ${connectorLoss.toFixed(2)} dB`;
};

const calculatePoEVoltageDrop = (v) => {
    if (!valid(v.cableLengthM, v.powerW)) return "Fel";
    
    const voltageOutputV = 48;
    const resistanceOhm = v.cableLengthM * 0.1;
    const currentA = v.powerW / voltageOutputV;
    const voltageDropV = resistanceOhm * currentA;
    const deviceVoltageV = voltageOutputV - voltageDropV;
    
    let status = "OK - Spänningen räcker till enheten.";
    if (v.cableLengthM > 100) {
        status = "Varning: Kabeln är längre än 100 m (Ethernet-gräns)!";
    } else if (deviceVoltageV < 37) {
        status = "Varning: För stort spänningsfall! Enheten riskerar att inte starta.";
    }

    return `Framme vid enhet: ${deviceVoltageV.toFixed(1)} V\n` +
           `Spänningsfall: ${voltageDropV.toFixed(2)} V\n` +
           `Status: ${status}`;
};

export const telecomCalculations = [
    {
        id: "fiber_loss_budget",
        name: "Dämpningsbudget för Fiberlänk",
        categories: ["telecom"],
        decimaler: 2,
        inputs: [
            { id: "fiberLengthKm", label: "Fiberlängd [km]" },
            { id: "spliceCount", label: "Antal svetsar" },
            { id: "connectorCount", label: "Antal kontaktpar (hane/hona)" }
        ],
        calc: calculateFiberLossBudget,
        info: {
            description: "Beräknar maximalt tillåten dämpning för en fiberlänk.",
            details: "Används för att säkerställa att optiska länkar klarar dämpningskraven baserat på standardvärden för fiberkablar, svetsar och anslutningskontakter.",
            formula: { 
			name: "Dämpningsbudget för fiberlänk", 
			description: "Total dämpning = (Fiberlängd × 0,4 dB/km) + (Antal svetsar × 0,05 dB) + (Antal kontaktpar × 0,5 dB)" }
        }
    },
    {
        id: "poe_voltage_drop",
        name: "PoE Spänningsfall och Kabellängd",
        categories: ["telecom"],
        decimaler: 2,
        inputs: [
            { id: "cableLengthM", label: "Kabellängd [m]" },
            { id: "powerW", label: "Enhetens effektförbrukning [W]" }
        ],
        calc: calculatePoEVoltageDrop,
        info: {
            description: "Kontrollerar spänningsfall och kabellängd för PoE-matade nätverksenheter.",
            details: "Beräknar spänningsfallet i kopparkabeln (AWG24) för att säkerställa att spänningen framme vid enheten (t.ex. IP-kamera eller accesspunkt) inte understiger kritiska nivåer.",
            formula: { name: "Spänningsfall i tråd", description: "U_fall = R × (P / U_ut)" }
        }
    }
];