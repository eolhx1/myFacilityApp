//
// filenamne: ./calculations/controls.js
//

// =================================================================
// STYR & REGLER KALKYLER
// =================================================================
import {
    valid
} from './config.js';

const calculateProcessValueFromVoltage = (v) => (v.volt / 10) * (v.max - v.min) + v.min;

const calculateProcessValueFromCurrent = (v) => `Värde: ${(((v.ma - 4) / 16) * (v.max - v.min) + v.min).toFixed(2)}`;

const calculateProportionalBand = (v) => `P-band (Xp): ${(v.utgang / v.fel).toFixed(2)}`;

const calculateSystemTimeConstant = (v) => `Tidskonstant: ${((v.volym / v.flode) * 60).toFixed(1)} minuter`;

const calculateTheoreticalZeroValue = (inMin, inMax, fysMin, fysMax) => {
    return ((0 - inMin) / (inMax - inMin)) * (fysMax - fysMin) + fysMin;
};

export const controlsCalculations = [
    {
        id: "current_to_process_value",
        name: "Givarskalning 4-20mA",
        categories: ["styr"],
        decimaler: 2,
        inputs: [
            { id: "ma", label: "mA" },
            { id: "min", label: "Min" },
            { id: "max", label: "Max" }
        ],
        calc: (v) => !valid(v.ma, v.min, v.max) ? "Fyll i alla fält" : beraknaSkalning420mA(v),
        info: {
            description: "Omvandlar en analog strömsignal (4-20mA) till ett motsvarande fysiskt processvärde.",
            details: "Oumbärligt verktyg vid idrifttagning, injustering och felsökning i fält. Verifierar att givarens strömutgång korrelerar korrekt mot det uppmätta värdet i styrsystemet.",
            formula: {
                name: "Linjär 4-20mA omvandling",
                description: "Värde = ((mA - 4) / (20 - 4)) × (Max - Min) + Min"
            }
        }
    },




    {
        id: "voltage_to_process_value",
        name: "Givarskalning 0-10V",
        categories: ["styr"],
        label: "Resultat",
        unit: "",
        decimaler: 2,
        inputs: [
            { id: "volt", label: "Uppmätt spänning (V)" },
            { id: "min", label: "Minvärde" },
            { id: "max", label: "Maxvärde" }
        ],
        calc: (v) => !valid(v.volt, v.min, v.max) ? "Fel" : beraknaSkalning010V(v),
        info: {
            description: "Skalar om en 0-10V styrsignal till fysiskt mätvärde.",
            details: "Används vid felsökning och injustering av styr- och reglersystem för att översätta insignaler från givare till korrekta fysiska storheter.",
            formula: {
                name: "Linjär skalning",
                description: "Värde = (Volt / 10) * (Max - Min) + Min"
            }
        }
    },
	

	
    {
        id: "proportional_band",
        name: "P-bandsberäkning (Xp)",
        categories: ["styr"],
        decimaler: 2,
        inputs: [
            { id: "utgang", label: "% Utsignal" },
            { id: "fel", label: "Δ Ärvärde" }
        ],
        calc: (v) => !valid(v.utgang, v.fel) || v.fel === 0 ? "Felaktiga värden" : beraknaPband(v),
        info: {
            description: "Beräknar regulatorns proportionella band (Xp) baserat på aktuell utsignal och styrfel.",
            details: "Används för att analysera eller ställa in P- och PID-regulatorers förstärkning. P-bandet definierar det avvikelseområde där styrsystemets utsignal färdas från 0% till 100%.",
            formula: {
                name: "Proportionellt band",
                description: "Xp = (% Utsignal / Δ Ärvärde)"
            }
        }
    },
    {
        id: "system_time_constant",
        name: "Tidskonstant (Värme)",
        categories: ["styr"],
        decimaler: 1,
        inputs: [
            { id: "volym", label: "Volym (m³)" },
            { id: "flode", label: "Flöde (m³/h)" }
        ],
        calc: (v) => !valid(v.volym, v.flode) || v.flode === 0 ? "Fel" : beraknaTidskonstant(v),
        info: {
            description: "Beräknar ett VVS-systems teoretiska tidskonstant (uppehållstid) som mått på tröghet.",
            details: "Används som en snabb tumregel inom styr och regler för att uppskatta hur snabbt ett system (t.ex. en värmeväxlare eller akkumulatortank) reagerar på förändringar.",
            formula: {
                name: "Tidskonstant",
                description: "Tid = (Volym / Flöde) × 60 [minuter]"
            }
        }
    },
    {
        id: "plc_signal_scaling",
        name: "PLC Skalningsverktyg",
        categories: ["styr"],
        decimaler: 2,
        inputs: [
            { id: "givar_min_ma", label: "In Min (mA)" },
            { id: "givar_max_ma", label: "In Max (mA)" },
            { id: "fys_min", label: "Fys Min" },
            { id: "fys_max", label: "Fys Max" }
        ],
        calc: (v) => !valid(v.givar_min_ma, v.givar_max_ma, v.fys_min, v.fys_max) ? "Fyll i fält" :
        `PLC KONFIGURATION:\nIn: ${v.givar_min_ma}-${v.givar_max_ma}mA\nUt: ${v.fys_min}-${v.fys_max}\n\nDIAGNOS VID 0mA:\nPLC visar: ${getTeoretisktNoll(v.givar_min_ma, v.givar_max_ma, v.fys_min, v.fys_max).toFixed(2)}`,
        info: {
            description: "Avancerat konfigurations- och beräkningsverktyg för PLC-arkitekter och automationsingenjörer.",
            details: "Mappar givarens konfigurerade mätområde mot fysiska enheter samt förbereder larmdiagnos. Beräknar direkt vilket teoretiskt värde styrsystemet läser av vid ett eventuellt kabelbrott (0mA).",
            formula: {
                name: "Teoretiskt nollvärde (vid 0mA)",
                description: "Värde = ((0 - In_Min) / (In_Max - In_Min)) × (Fys_Max - Fys_Min) + Fys_Min"
            }
        }
    }
];
