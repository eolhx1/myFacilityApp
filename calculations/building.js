//
// filenamne: ./calculations/building.js
//

// =================================================================
// BYGG KALKYLER
// =================================================================
import { valid } from './config.js';
import { getCommonText } from '../locales.js';


const calculateStairDesign = (v) => {
    if (!valid(v.totalHeight, v.treadDepth))
        return getCommonText("error");

    if (v.totalHeight <= 0 || v.treadDepth <= 0)
        return getCommonText("dimensions_must_be_greater_than_zero");

    const estimatedStepCount =
        Math.round(v.totalHeight / 180);

    const stepCount =
        estimatedStepCount > 0
            ? estimatedStepCount
            : 1;

    const stepHeight =
        v.totalHeight / stepCount;

    const blondelValue =
        (2 * stepHeight) + v.treadDepth;

    let comfortRating =
        getCommonText("approved_comfortable_stair");

    if (stepHeight < 120 || stepHeight > 220) {
        comfortRating =
            getCommonText("unusual_step_height");
    }

    if (blondelValue < 600) {
        comfortRating =
            getCommonText("stair_too_steep");
    } else if (blondelValue > 630) {
        comfortRating =
            getCommonText("stair_too_long");
    }

    return `${getCommonText("number_of_steps")}: ${stepCount} ${getCommonText("pieces")}
${getCommonText("step_height")}: ${stepHeight.toFixed(1)} mm
${getCommonText("tread_depth")}: ${v.treadDepth} mm
${getCommonText("blondel_measure")}: ${blondelValue.toFixed(0)} mm
${getCommonText("status")}: ${comfortRating}`;
};

export const buildingCalculations = [{
    id: "stair_design",
    nameKey: "stair_design",
    categories: ["building"],
    decimaler: 1,

    inputs: [
        {
            id: "totalHeight",
            labelKey: "total_floor_height_mm"
        },
        {
            id: "treadDepth",
            labelKey: "tread_depth_b_mm"
        }
    ],

    calc: calculateStairDesign,

    info: {
        descriptionKey: "stair_design_desc",
        detailsKey: "stair_design_details",

        formula: {
            nameKey: "stair_design_formula_name",
            descriptionKey: "stair_design_formula_desc"
        }
    }
}];