//
// Fil: ./calculations/utils.js
//

export const valid = (...values) => values.every(v => v !== undefined && v !== null && !isNaN(v) && v !== '');
export const toM3h = (val, unit) => (unit === "ls" ? val * 3.6 : val);
export const toLs = (val, unit) => (unit === "m3h" ? val / 3.6 : val);

export const UNIT_MAP = {
    "ls": "l/s",
    "m3h": "m³/h",
    "kw": "kW",
    "kpa": "kPa",
    "pa": "Pa",
    "mm": "mm",
    "celsius": "°C"
};

export const CATEGORIES = {
    styr: {
        name: "Styr & Regler",
        ikon: "⚙️"
    },
    vent: {
        name: "Ventilation",
        ikon: "💨"
    },
    vs: {
        name: "VS & Värme",
        ikon: "💧"
    },
    el: {
        name: "Elkraft",
        ikon: "⚡"
    },
    tele: {
        name: "Tele & Data",
        ikon: "📡"
    },
    gas: {
        name: "Gas",
        ikon: "🔥"
    },
    bygg: {
        name: "Bygg",
        ikon: "🧱"
    },
    energi: {
        name: "Energi",
        ikon: "🔋"
    }
};


export const formatResult = (value, precision = 2) => {
    if (isNaN(value)) return "0";
    return new Intl.NumberFormat('sv-SE', {
        minimumFractionDigits: 0,
        maximumFractionDigits: precision
    }).format(value);
};
