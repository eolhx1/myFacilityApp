// =================================================================
// EL KALKYLER
// =================================================================
import { valid } from './config.js';

const beraknaOhmsLag = (v) => {
    if (!valid(v.varde1, v.varde2)) return "Fel";
    const läge = v.lage_unit || "U";
    if (läge === "U") return v.varde1 * v.varde2;
    if (läge === "I" || läge === "R") return v.varde1 / v.varde2;
    return "Fel";
};

export const electricalCalculations = [{
    id: "el_ohms_lag",
    name: "Ohms lag",
    categories: ["el", "tele"],
    decimaler: 2,
    inputs: [
        { id: "lage", label: "Vad vill du räkna ut?", unit: ["U", "I", "R"], requiresInput: false },
        { id: "varde1", label: "Ström (I) [A]" },
        { id: "varde2", label: "Resistans (R) [Ω]" }
    ],
    calc: beraknaOhmsLag,
    info: {
        description: "Räknar ut spänning, ström eller resistans med Ohms lag.",
        details: "Grundläggande el-beräkning för att snabbt ta reda på saknade värden i en elektrisk krets."
    }
}];
