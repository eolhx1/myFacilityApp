//
// filenamne: ./calculations/building.js
//

// =================================================================
// BYGG KALKYLER
// =================================================================
import { valid } from './config.js';

const calculateStairDesign = (v) => {
    if (!valid(v.totalHeight, v.treadDepth)) return "Fel";
    if (v.totalHeight <= 0 || v.treadDepth <= 0) return "Måtten måste vara större än 0";

    const estimatedStepCount = Math.round(v.totalHeight / 180);
    const stepCount = estimatedStepCount > 0 ? estimatedStepCount : 1;

    const stepHeight = v.totalHeight / stepCount;
    const blondelValue = (2 * stepHeight) + v.treadDepth;

    let comfortRating = "Godkänd / Bekväm trappa";

    if (blondelValue < 600) {
        comfortRating = "⚠️ Trappan kan upplevas som brant / korta steg";
    } else if (blondelValue > 630) {
        comfortRating = "⚠️ Trappan kan upplevas som långsam / långa steg";
    }

    return `Antal steg: ${stepCount} st
Steghöjd: ${stepHeight.toFixed(1)} mm
Stegdjup: ${v.treadDepth} mm
Blondels mått (2H + B): ${blondelValue.toFixed(0)} mm
Status: ${comfortRating}`;
};

export const buildingCalculations = [{
    id: "stair_design",
    name: "Trappberäkning (Stigning & Steg)",
    categories: ["building"],
    decimaler: 1,
    inputs: [
{ id: "totalHeight", label: "Total höjd (golv till golv) [mm]" },
{ id: "treadDepth", label: "Plansteg / Stegdjup (B) [mm]" }
    ],
    calc: calculateStairDesign,
    info: {
        description: "Beräknar steghöjd och komfort för trappor enligt Blondels formel.",
        details: "Hjälper till att dimensionera bekväma och säkra trappor genom att beräkna antal steg, exakt stigningshöjd och kontrollera mot ergonomiska standarder.",
        formula: { name: "Blondels formel", description: "2 × Steghöjd (H) + Stegdjup (B) bör ligga mellan 600 och 630 mm." }
    }
}];