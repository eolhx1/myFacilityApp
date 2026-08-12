//
// filenamne: ./calculations/gas.js
//

// =================================================================
// GAS KALKYLER
// =================================================================
import { valid } from './config.js';

const calculateCylinderRuntime = (v) => {
    if (!valid(v.volym, v.tryck, v.flode) || v.flode === 0) return "Fel";
    return (v.volym * v.tryck) / (v.flode * 60);
};

export const gasCalculations = [{
    id: "cylinder_runtime",
    name: "Användningstid gasflaska",
    categories: ["gas"],
    decimaler: 1,
    inputs: [
        { id: "volym", label: "Flaskans volym", unit: ["L"] },
        { id: "tryck", label: "Tryck", unit: ["bar"] },
        { id: "flode", label: "Ordinerat flöde", unit: ["L/min"] }
    ],
    calc: calculateCylinderRuntime,
    info: {
        description: "Beräknar uppskattad räcker-tid för en gasflaska vid givet uttag.",
        details: "Används för att beräkna hur länge en gasol- eller gasflaska räcker baserat på flaskans vattenvolym, aktuellt tryck och det uttagna flödet."
    }
}];