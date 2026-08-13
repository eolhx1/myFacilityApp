//
// filenamne: ./calculations/ventilation.js
//

// =================================================================
// VENTILATION KALKYLER (js/ventilation.js)
// =================================================================
import { valid, toM3h, toLs } from './config.js';

const calculateAirChangeRate = (v) => {
    if (!v.roomVolume || v.roomVolume <= 0 || !v.airflow) return "Fel";
    return toM3h(v.airflow, v.airflow_unit || "m3h") / v.roomVolume;
};

const calculateCoolingCapacity = (v) => {
    const airflowLs = toLs(v.airflow, v.airflow_unit || "ls");
    const dT = v.roomTemperature - v.supplyAirTemperature;
    return (1.2 * airflowLs * dT) / 1000;
};

const calculateAirflowFromVelocity = (v) => {
    if (!valid(v.airVelocity, v.ductArea)) return "Fel";
    return (v.airVelocity * v.ductArea) * 1000;
};

const calculateAirflowFromKFactor = (v) => {
    if (!valid(v.kFactor, v.pressureDifference) || v.pressureDifference < 0) return "Fel";
    return v.kFactor * Math.sqrt(v.pressureDifference);
};

const calculateSpecificFanPower = (v) => {
    if (!valid(v.totalPower, v.airflow) || v.airflow === 0) return "Fel";
    const flowUnit = v.airflow_unit || "ls";
    let airflowM3s = flowUnit === "ls" ? v.airflow / 1000 : v.airflow / 3600;
    return v.totalPower / airflowM3s;
};

const calculateFanAffinityLaws = (v) => {
    if (!valid(v.currentSpeed, v.newSpeed, v.currentFlow, v.currentPressure, v.currentPower)) return "Fel";
    
    const speedRatio = v.newSpeed / v.currentSpeed;
    const newFlow = v.currentFlow * speedRatio;
    const newPressure = v.currentPressure * Math.pow(speedRatio, 2);
    const newPower = v.currentPower * Math.pow(speedRatio, 3);
    
return `Nytt flöde (Q2): ${newFlow.toFixed(2)} m³/s\n` +
       `Nytt tryck (P2): ${newPressure.toFixed(1)} Pa\n` +
       `Ny effekt (E2): ${newPower.toFixed(2)} kW`;

};

const calculateEquivalentDuctDiameter = (v) => {
    if (!valid(v.ductWidth, v.ductHeight) || (v.ductWidth + v.ductHeight) === 0) return "Fel";
    return (2 * v.ductWidth * v.ductHeight) / (v.ductWidth + v.ductHeight);
};

const calculateAirflowFromEffectiveArea = (v) => {
    if (!valid(v.airVelocity, v.effectiveArea)) return "Fel";
    return (v.airVelocity * v.effectiveArea) * 1000;
};

const calculateHeatRecoveryEfficiency = (v) => {
    if (!valid(v.supplyAirTemperature, v.outdoorAirTemperature, v.extractAirTemperature)) return "Fel";
    const temperatureDifference = v.extractAirTemperature - v.outdoorAirTemperature;
    if (temperatureDifference === 0) return "Fel (0-division)";
    return (v.supplyAirTemperature - v.outdoorAirTemperature) / temperatureDifference;
};

const calculateMixedAirTemperature = (v) => {
    if (!valid(v.outdoorAirflow, v.outdoorAirTemperature, v.returnAirflow, v.returnAirTemperature, v.totalAirflow) || v.totalAirflow === 0) return "Fel";
    return ((v.outdoorAirflow * v.outdoorAirTemperature) + (v.returnAirflow * v.returnAirTemperature)) / v.totalAirflow;
};

export const ventilationCalculations = [
    {
        id: "air_change_rate",
        name: "Luftomsättning",
        categories: ["ventilation"],
        unit: "h⁻¹",
        label: "Luftomsättning",
        decimaler: 1,
        inputs: [
            { id: "roomVolume", label: "Rumsvolym (m³)" },
            { id: "airflow", label: "Flöde", unit: ["ls", "m3h"], base: "m3h" }
        ],
        calc: calculateAirChangeRate,
        info: {
            description: "Beräknar hur många gånger per timme rumsvolymen byts ut.",
            details: "Används för att kontrollera att ett rum eller utrymme uppfyller gällande krav på luftväxling per timme.",
			formula: {
				name: "Luftomsättning",
				description: "n = Flöde / Volym"
			}
        }
    },
	
    {
        id: "supply_air_cooling_capacity",
        name: "Kyleffekt luft",
        categories: ["ventilation"],
        unit: "kW",
        decimaler: 2,
        inputs: [
            { id: "airflow", label: "Flöde", unit: ["ls", "m3h"], base: "ls" },
            { id: "roomTemperature", label: "Rumstemperatur (°C)" },
            { id: "supplyAirTemperature", label: "Tilluftstemperatur (°C)" }
        ],
        calc: (v) => !valid(v.airflow, v.roomTemperature, v.supplyAirTemperature) ? "Fel" : calculateCoolingCapacity(v),
        info: {
            description: "Beräknar tilluftsventilationens kyleffekt baserat på flöde och ΔT.",
            details: "Visar hur mycket kyla som tillförs lokalen via tilluften vid en viss temperaturskillnad mellan rum och tilluft.",
			formula: {
				name: "Kyleffekt luft",
				description: "P = 1,2 × q × ΔT"
			}
        }
    },
    {
        id: "airflow_from_velocity",
        name: "Flöde & Lufthastighet",
        categories: ["ventilation"],
        unit: "l/s",
        decimaler: 1,
        inputs: [
            { id: "airVelocity", label: "Lufthastighet", unit: ["m/s"] },
            { id: "ductArea", label: "Kanalarea", unit: ["m²"] }
        ],
        calc: calculateAirflowFromVelocity,
        info: {
            description: "Beräknar luftflöde utifrån lufthastighet och kanalarea.",
            details: "Används vid injustering och flödesmätningar i kanaler baserat på kontinuitetsekvationen (Flöde = Hastighet × Area).",
			formula: {
				name: "Kontinuitetsekvationen",
				description: "Flöde = Hastighet × Area"
			}
        }
    },
    {
        id: "airflow_from_k_factor",
        name: "K-faktor flödesberäkning",
        categories: ["ventilation"],
        unit: "l/s",
        decimaler: 1,
        inputs: [
            { id: "kFactor", label: "K-faktor (k)" },
            { id: "pressureDifference", label: "Differenstryck (Δp)", unit: ["Pa"] }
        ],
        calc: calculateAirflowFromKFactor,
        info: {
            description: "Beräknar luftflöde genom don med känd K-faktor och mätt tryck.",
            details: "Standardberäkning vid mätning på mätuttag i ventilationsdon.",
            formula: { name: "K-faktor", description: "Flöde = K × √Δp" }
        }
    },
    {
        id: "ventilation_balancing_ratio",
        name: "Proportionalitetsmetoden",
        categories: ["ventilation"],
        unit: "",
        decimaler: 2,
inputs: [
    { id: "measuredFlow", label: "Uppmätt flöde", unit: ["ls", "m3h"], base: "ls" },
    { id: "designFlow", label: "Projekterat flöde", unit: ["ls", "m3h"], base: "ls" }
],
        calc: (v) => {
if (!valid(v.measuredFlow, v.designFlow) || v.designFlow === 0) return "Fel";

const measuredFlowLs = toLs(v.measuredFlow, v.measuredFlow_unit || "ls");
const designFlowLs = toLs(v.designFlow, v.designFlow_unit || "ls");

return measuredFlowLs / designFlowLs;
        },
        info: {
            description: "Beräknar injusteringskvot för ventilationsgrenar.",
            details: "Används vid injustering av ventilationssystem för att beräkna flödesförhållanden mellan uppmätta och projekterade värden."
        }
    },
    {
        id: "specific_fan_power",
        name: "Specifik Fläkteffekt (SFP)",
        categories: ["ventilation", "building"],
        unit: "kW/(m³/s)",
        decimaler: 1,
        inputs: [
            { id: "totalPower", label: "Total tillförd effekt", unit: ["kW"] },
            { id: "airflow", label: "Största flöde", unit: ["ls", "m3h"], base: "ls" }
        ],
        calc: calculateSpecificFanPower,
        info: {
            description: "Beräknar fläktarnas specifika energianvändning (SFP-tal).",
            details: "Visar hur mycket eleffekt fläktarna kräver per flödesenhet, vilket är en viktig energiparameter vid OVK och dimensionering.",
            formula: { name: "SFP", description: "SFP = Total tillförd effekt / Flöde (m³/s)" }
        }
    },
    {
        id: "fan_affinity_laws",
        name: "Affinitetslagar (Fläkt)",
        categories: ["ventilation"],
        decimaler: 2,
        inputs: [
            { id: "currentSpeed", label: "Nuvarande varvtal / frekvens [varv/min eller Hz]" },
            { id: "newSpeed", label: "Nytt varvtal / frekvens [varv/min eller Hz]" },
            { id: "currentFlow", label: "Nuvarande flöde [m³/s]" },
            { id: "currentPressure", label: "Nuvarande tryck [Pa]" },
            { id: "currentPower", label: "Nuvarande effekt [kW]" }
        ],
        calc: calculateFanAffinityLaws,
        info: {
            description: "Beräknar nytt flöde, tryck och effekt vid ändrat varvtal för fläktar.",
            details: "Baserat på fläktarnas affinitetslagar vid varvtalsändring (t.ex. via frekvensomriktare).",
            formula: {
				name: "Affinitetslagarna",
				description: "Nytt flode = Befintligt flode x (Nytt varvtal / Befintligt varvtal), Nytt tryck = Befintligt tryck x (Nytt varvtal / Befintligt varvtal)^2, Ny effekt = Befintlig effekt x (Nytt varvtal / Befintligt varvtal)^3"
			}
        }
    },
    {
        id: "equivalent_duct_diameter",
        name: "Ekvivalent kanaldiameter",
        categories: ["ventilation"],
        unit: "mm",
        decimaler: 0,
        inputs: [
            { id: "ductWidth", label: "Kanalens bredd (a)", unit: ["mm", "m"] },
            { id: "ductHeight", label: "Kanalens höjd (b)", unit: ["mm", "m"] }
        ],
        calc: calculateEquivalentDuctDiameter,
        info: {
            description: "Beräknar hydraulisk/ekvivalent diameter för rektangulära kanaler.",
            details: "Används för att omvandla rektangulära kanaldimensioner till motsvarande cirkulär diameter vid tryckfallsberäkningar.",
			formula: {
				name: "Hydraulisk diameter",
				description: "D = (2 × a × b) / (a + b)"
			}
        }
    },
    {
        id: "airflow_from_effective_area",
        name: "Flöde via effektiv area (Don/Galler)",
        categories: ["ventilation"],
        unit: "l/s",
        decimaler: 1,
        inputs: [
            { id: "airVelocity", label: "Uppmätt medelhastighet (v_medel)", unit: ["m/s"] },
            { id: "effectiveArea", label: "Effektiv area (A_eff)", unit: ["m²"] }
        ],
        calc: calculateAirflowFromEffectiveArea,
        info: {
            description: "Beräknar flöde genom don/galler baserat på mätt hastighet och area.",
            details: "Används vid mätning med mätvinge eller tratt direkt mot donets effektiva area.",
			formula: {
				name: "Flöde via area",
				description: "Flöde = Hastighet × Effektiv area"
			}
        }
    },
    {
        id: "heat_recovery_efficiency",
        name: "Temperaturverkningsgrad (Värmeväxlare)",
        categories: ["ventilation"],
        unit: "",
        decimaler: 2,
        inputs: [
            { id: "supplyAirTemperature", label: "Tilluft efter växlare (t_till)", unit: ["celsius"] },
            { id: "outdoorAirTemperature", label: "Uteluft före växlare (t_ute)", unit: ["celsius"] },
            { id: "extractAirTemperature", label: "Frånluft före växlare (t_från)", unit: ["celsius"] }
        ],
        calc: calculateHeatRecoveryEfficiency,
        info: {
            description: "Beräknar värmeväxlarens temperaturverkningsgrad.",
            details: "Visar hur effektivt värmeåtervinningsaggregatet överför värme från frånluften till uteluften.",
            formula: { name: "Verkningsgrad", description: "η = (t_till - t_ute) / (t_från - t_ute)" }
        }
    },
    {
        id: "mixed_air_temperature",
        name: "Blandningstemperatur (Recirkulation)",
        categories: ["ventilation", "controls"],
        unit: "°C",
        decimaler: 1,
        inputs: [
            { id: "outdoorAirflow", label: "Uteluftsflöde", unit: ["ls", "m3h"], base: "ls" },
            { id: "outdoorAirTemperature", label: "Uteluftstemperatur (t_ute)", unit: ["celsius"] },
            { id: "returnAirflow", label: "Återluftsflöde (q_åter)", unit: ["ls", "m3h"], base: "ls" },
            { id: "returnAirTemperature", label: "Återluftstemperatur", unit: ["celsius"] },
            { id: "totalAirflow", label: "Totalt blandningsflöde", unit: ["ls", "m3h"], base: "ls" }
        ],
        calc: calculateMixedAirTemperature,
        info: {
            description: "Beräknar sluttemperatur vid blandning av uteluft och återluft.",
            details: "Används i ventilationssammanhang för att beräkna temperaturen efter spjäll eller återluftskammare.",
			formula: {
				name: "Blandningstemperatur",
				description: "T = ((q1 x T1) + (q2 x T2)) / q_total"
			}
        }
    }
];