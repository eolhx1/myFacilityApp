//
// filenamne: ./calculations/electrical.js
//

// =================================================================
// EL KALKYLER
// =================================================================
import { valid } from './config.js';

const calculateOhmsLaw = (v) => {
    if (!valid(v.value1, v.value2)) return "Fel";

    const mode = v.calculationMode_unit || "U";

    if (mode === "U") {
        return `Spänning (U): ${(v.value1 * v.value2).toFixed(2)} V`;
    }

    if (mode === "I") {
        return `Ström (I): ${(v.value1 / v.value2).toFixed(2)} A`;
    }

    if (mode === "R") {
        return `Resistans (R): ${(v.value1 / v.value2).toFixed(2)} Ω`;
    }

    return "Fel";
};

export const electricalCalculations = [{
    id: "ohms_law",
    name: "Ohms lag",
    categories: ["electrical", "telecom"],
    decimaler: 2,
    inputs: [
        { id: "calculationMode", label: "Vad vill du räkna ut?", unit: ["U", "I", "R"], requiresInput: false },
        { id: "value1", label: "Ström (I) [A]" },
        { id: "value2", label: "Resistans (R) [Ω]" }
    ],
    calc: calculateOhmsLaw,
		info: {
			description: "Beräknar spänning (U), ström (I) eller resistans (R) utifrån två kända värden enligt Ohms lag.",
			details: "Används vid felsökning, dimensionering och utbildning inom elteknik. Välj vilket värde som ska beräknas och ange de två återstående storheterna.",
			formula: {
				name: "Ohms lag",
				description: "U = I × R, I = U / R, R = U / I"
			}
		}
}];
