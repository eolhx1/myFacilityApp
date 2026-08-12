// =================================================================
// VENTILATION KALKYLER (js/ventilation.js)
// =================================================================
import { valid, formatResult, toM3h, toLs } from './config.js';

const beraknaOmsattning = (v) => {
    if (!v.volym || v.volym <= 0 || !v.flode) return "Fel";
    return toM3h(v.flode, v.flode_unit || "m3h") / v.volym;
};

const beraknaKyleffekt = (v) => {
    const flode_ls = toLs(v.flode, v.flode_unit || "ls");
    const dT = v.tRum - v.tTill;
    return (1.2 * flode_ls * dT) / 1000;
};

const beraknaFlodeKontinuitet = (v) => {
    if (!valid(v.hastighet, v.area)) return "Fel";
    return (v.hastighet * v.area) * 1000;
};

const beraknaKfaktor = (v) => {
    if (!valid(v.k_faktor, v.delta_p) || v.delta_p < 0) return "Fel";
    return v.k_faktor * Math.sqrt(v.delta_p);
};

const beraknaSFP = (v) => {
    if (!valid(v.p_tot, v.flode) || v.flode === 0) return "Fel";
    const enhet = v.flode_unit || "ls";
    let flode_m3s = enhet === "ls" ? v.flode / 1000 : v.flode / 3600;
    return v.p_tot / flode_m3s;
};

const beraknaFlaktAffinitet = (v) => {
    if (!valid(v.n1, v.n2, v.q1, v.p1, v.e1)) return "Fel";
    
    const kvot = v.n2 / v.n1;
    const q2 = v.q1 * kvot;
    const p2 = v.p1 * Math.pow(kvot, 2);
    const e2 = v.e1 * Math.pow(kvot, 3);
    
    return `Nytt flöde (Q2): ${q2.toFixed(2)} m³/s\n` +
           `Nytt tryck (p2): ${p2.toFixed(1)} Pa\n` +
           `Ny effekt (P2): ${e2.toFixed(2)} kW`;
};

const beraknaEkvivalentDiameter = (v) => {
    if (!valid(v.bredd, v.hojd) || (v.bredd + v.hojd) === 0) return "Fel";
    return (2 * v.bredd * v.hojd) / (v.bredd + v.hojd);
};

const beraknaGallerFlode = (v) => {
    if (!valid(v.hastighet, v.a_eff)) return "Fel";
    return (v.hastighet * v.a_eff) * 1000;
};

const beraknaTemperaturverkningsgrad = (v) => {
    if (!valid(v.t_till, v.t_ute, v.t_fran)) return "Fel";
    const nämnare = v.t_fran - v.t_ute;
    if (nämnare === 0) return "Fel (0-division)";
    return (v.t_till - v.t_ute) / nämnare;
};

const beraknaBlandningstemperatur = (v) => {
    if (!valid(v.q_ute, v.t_ute, v.q_ater, v.t_ater, v.q_total) || v.q_total === 0) return "Fel";
    return ((v.q_ute * v.t_ute) + (v.q_ater * v.t_ater)) / v.q_total;
};

export const ventilationCalculations = [
    {
        id: "vent_luft_omsattning",
        name: "Luftomsättning",
        categories: ["vent"],
        unit: "h⁻¹",
        label: "Luftomsättning",
        decimaler: 1,
        inputs: [
            { id: "volym", label: "Rumsvolym (m³)" },
            { id: "flode", label: "Flöde", unit: ["ls", "m3h"], base: "m3h" }
        ],
        calc: beraknaOmsattning,
        info: {
            description: "Beräknar hur många gånger per timme rumsvolymen byts ut.",
            details: "Används för att kontrollera att ett rum eller utrymme uppfyller gällande krav på luftväxling per timme."
        }
    },
    {
        id: "vent_luft_kyleffekt",
        name: "Kyleffekt luft",
        categories: ["vent"],
        unit: "kW",
        decimaler: 2,
        inputs: [
            { id: "flode", label: "Flöde", unit: ["ls", "m3h"], base: "ls" },
            { id: "tRum", label: "Rumstemperatur (°C)" },
            { id: "tTill", label: "Tilluftstemperatur (°C)" }
        ],
        calc: (v) => !valid(v.flode, v.tRum, v.tTill) ? "Fel" : beraknaKyleffekt(v),
        info: {
            description: "Beräknar tilluftsventilationens kyleffekt baserat på flöde och ΔT.",
            details: "Visar hur mycket kyla som tillförs lokalen via tilluften vid en viss temperaturskillnad mellan rum och tilluft."
        }
    },
    {
        id: "vent_kontinuitet_flode",
        name: "Flöde & Lufthastighet",
        categories: ["vent"],
        unit: "l/s",
        decimaler: 1,
        inputs: [
            { id: "hastighet", label: "Lufthastighet", unit: ["m/s"] },
            { id: "area", label: "Kanalarea", unit: ["m²"] }
        ],
        calc: beraknaFlodeKontinuitet,
        info: {
            description: "Beräknar luftflöde utifrån lufthastighet och kanalarea.",
            details: "Används vid injustering och flödesmätningar i kanaler baserat på kontinuitetsekvationen (Flöde = Hastighet × Area)."
        }
    },
    {
        id: "vent_kfaktor_flode",
        name: "K-faktor flödesberäkning",
        categories: ["vent"],
        unit: "l/s",
        decimaler: 1,
        inputs: [
            { id: "k_faktor", label: "K-faktor (k)" },
            { id: "delta_p", label: "Differenstryck (Δp)", unit: ["Pa"] }
        ],
        calc: beraknaKfaktor,
        info: {
            description: "Beräknar luftflöde genom don med känd K-faktor och mätt tryck.",
            details: "Standardberäkning vid mätning på mätuttag i ventilationsdon.",
            formula: { name: "K-faktor", beskrivning: "Flöde = K × √Δp" }
        }
    },
    {
        id: "vent_proportionalitetsmetoden",
        name: "Proportionalitetsmetoden",
        categories: ["vent"],
        unit: "",
        decimaler: 2,
        inputs: [
            { id: "q_matt", label: "Uppmätt flöde", unit: ["ls", "m3h"], base: "ls" },
            { id: "q_proj", label: "Projekterat flöde", unit: ["ls", "m3h"], base: "ls" }
        ],
        calc: (v) => {
            if (!valid(v.q_matt, v.q_proj) || v.q_proj === 0) return "Fel";
            const mattLs = toLs(v.q_matt, v.q_matt_unit || "ls");
            const projLs = toLs(v.q_proj, v.q_proj_unit || "ls");
            return mattLs / projLs;
        },
        info: {
            description: "Beräknar injusteringskvot för ventilationsgrenar.",
            details: "Används vid injustering av ventilationssystem för att beräkna flödesförhållanden mellan uppmätta och projekterade värden."
        }
    },
    {
        id: "vent_sfp",
        name: "Specifik Fläkteffekt (SFP)",
        categories: ["vent", "bygg"],
        unit: "kW/(m³/s)",
        decimaler: 1,
        inputs: [
            { id: "p_tot", label: "Total tillförd effekt (P_tot)", unit: ["kW"] },
            { id: "flode", label: "Största flöde", unit: ["ls", "m3h"], base: "ls" }
        ],
        calc: beraknaSFP,
        info: {
            description: "Beräknar fläktarnas specifika energianvändning (SFP-tal).",
            details: "Visar hur mycket eleffekt fläktarna kräver per flödesenhet, vilket är en viktig energiparameter vid OVK och dimensionering.",
            formula: { name: "SFP", beskrivning: "SFP = P_tot / Flöde (m³/s)" }
        }
    },
    {
        id: "vent_affinitet_flakt",
        name: "Affinitetslagar (Fläkt)",
        categories: ["vent"],
        decimaler: 2,
        inputs: [
            { id: "n1", label: "Nuvarande varvtal / frekvens [varv/min eller Hz]" },
            { id: "n2", label: "Nytt varvtal / frekvens [varv/min eller Hz]" },
            { id: "q1", label: "Nuvarande flöde [m³/s]" },
            { id: "p1", label: "Nuvarande tryck [Pa]" },
            { id: "e1", label: "Nuvarande effekt [kW]" }
        ],
        calc: beraknaFlaktAffinitet,
        info: {
            description: "Beräknar nytt flöde, tryck och effekt vid ändrat varvtal för fläktar.",
            details: "Baserat på fläktarnas affinitetslagar vid varvtalsändring (t.ex. via frekvensomriktare).",
            formula: { name: "Affinitetslagarna", beskrivning: "Q2 = Q1×(n2/n1), p2 = p1×(n2/n1)², P2 = P1×(n2/n1)³" }
        }
    },
    {
        id: "vent_ekvivalent_diameter",
        name: "Ekvivalent kanaldiameter",
        categories: ["vent"],
        unit: "mm",
        decimaler: 0,
        inputs: [
            { id: "bredd", label: "Kanalens bredd (a)", unit: ["mm", "m"] },
            { id: "hojd", label: "Kanalens höjd (b)", unit: ["mm", "m"] }
        ],
        calc: beraknaEkvivalentDiameter,
        info: {
            description: "Beräknar hydraulisk/ekvivalent diameter för rektangulära kanaler.",
            details: "Används för att omvandla rektangulära kanaldimensioner till motsvarande cirkulär diameter vid tryckfallsberäkningar."
        }
    },
    {
        id: "vent_galler_effektiv_area",
        name: "Flöde via effektiv area (Don/Galler)",
        categories: ["vent"],
        unit: "l/s",
        decimaler: 1,
        inputs: [
            { id: "hastighet", label: "Uppmätt medelhastighet (v_medel)", unit: ["m/s"] },
            { id: "a_eff", label: "Effektiv area (A_eff)", unit: ["m²"] }
        ],
        calc: beraknaGallerFlode,
        info: {
            description: "Beräknar flöde genom don/galler baserat på mätt hastighet och area.",
            details: "Används vid mätning med mätvinge eller tratt direkt mot donets effektiva area."
        }
    },
    {
        id: "vent_temperaturverkningsgrad",
        name: "Temperaturverkningsgrad (Värmeväxlare)",
        categories: ["vent"],
        unit: "",
        decimaler: 2,
        inputs: [
            { id: "t_till", label: "Tilluft efter växlare (t_till)", unit: ["celsius"] },
            { id: "t_ute", label: "Uteluft före växlare (t_ute)", unit: ["celsius"] },
            { id: "t_fran", label: "Frånluft före växlare (t_från)", unit: ["celsius"] }
        ],
        calc: beraknaTemperaturverkningsgrad,
        info: {
            description: "Beräknar värmeväxlarens temperaturverkningsgrad.",
            details: "Visar hur effektivt värmeåtervinningsaggregatet överför värme från frånluften till uteluften.",
            formula: { name: "Verkningsgrad", beskrivning: "η = (t_till - t_ute) / (t_från - t_ute)" }
        }
    },
    {
        id: "ventil_blandningstemperatur",
        name: "Blandningstemperatur (Recirkulation)",
        categories: ["vent", "styr"],
        unit: "°C",
        decimaler: 1,
        inputs: [
            { id: "q_ute", label: "Uteluftsflöde (q_ute)", unit: ["ls", "m3h"], base: "ls" },
            { id: "t_ute", label: "Uteluftstemperatur (t_ute)", unit: ["celsius"] },
            { id: "q_ater", label: "Återluftsflöde (q_åter)", unit: ["ls", "m3h"], base: "ls" },
            { id: "t_ater", label: "Återluftstemperatur (t_ater)", unit: ["celsius"] },
            { id: "q_total", label: "Totalt blandningsflöde (q_total)", unit: ["ls", "m3h"], base: "ls" }
        ],
        calc: beraknaBlandningstemperatur,
        info: {
            description: "Beräknar sluttemperatur vid blandning av uteluft och återluft.",
            details: "Används i ventilationssammanhang för att beräkna temperaturen efter spjäll eller återluftskammare."
        }
    }
];