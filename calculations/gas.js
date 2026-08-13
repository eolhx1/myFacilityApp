//
// filenamne: ./calculations/gas.js
//

// =================================================================
// GAS KALKYLER
// =================================================================
import { valid } from './config.js';

const calculateCylinderRuntime = (v) => {
    if (!valid(v.cylinderVolume, v.pressure, v.flowRate) || v.flowRate === 0) return "Fel";

    const runtimeHours = (v.cylinderVolume * v.pressure) / (v.flowRate * 60);

    return `Drifttid: ${runtimeHours.toFixed(1)} h`;
};

export const gasCalculations = [{
    id: "cylinder_runtime",
    name: "Drifttid gasflaska",
    categories: ["gas"],
    decimaler: 1,
    inputs: [
        { id: "cylinderVolume", label: "Flaskans volym", unit: ["L"] },
        { id: "pressure", label: "Tryck", unit: ["bar"] },
        { id: "flowRate", label: "Ordinerat flöde", unit: ["L/min"] }
    ],
    calc: calculateCylinderRuntime,
    info: {
        description: "Beräknar hur länge en gasflaska räcker vid ett givet gasuttag.",
        details: "Används inom medicinska gaser, svetsning och industri för att uppskatta återstående drifttid baserat på flaskvolym, fyllnadstryck och aktuellt gasuttag.",
		formula: {
			name: "Drifttid gasflaska",
			description: "Tid = (Flaskans volym × Tryck) / (Flöde × 60)"
		}
    }
}];