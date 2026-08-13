//
// filenamne: ./calculations/controls.js
//

// =================================================================
// STYR & REGLER KALKYLER
// =================================================================
import {
    valid
} from './config.js';

const calculateProcessValueFromVoltage = (v) =>
    `Värde: ${(((v.voltage / 10) * (v.max - v.min) + v.min)).toFixed(2)}`;
	
const calculateProcessValueFromCurrent = (v) => 
	`Värde: ${(((v.currentmA - 4) / 16) * (v.max - v.min) + v.min).toFixed(2)}`;

const calculateProportionalBand = (v) => 
	`P-band (Xp): ${(v.outputSignal / v.controlError).toFixed(2)}`;

const calculateSystemTimeConstant = (v) => 
	`Tidskonstant: ${((v.volume / v.flow) * 60).toFixed(1)} minuter`;

const calculateTheoreticalZeroValue = (inMin, inMax, physicalMin, physicalMax) => {
    return ((0 - inMin) / (inMax - inMin)) * (physicalMax - physicalMin) + physicalMin;
};

export const controlsCalculations = [
    {
        id: "current_to_process_value",
        name: "Givarskalning 4-20mA",
        categories: ["controls"],
        decimaler: 2,
        inputs: [
            { id: "currentmA", label: "mA" },
            { id: "min", label: "Min" },
            { id: "max", label: "Max" }
        ],
        calc: (v) => !valid(v.currentmA, v.min, v.max) ? "Fyll i alla fält" : calculateProcessValueFromCurrent(v),
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
        categories: ["controls"],
        label: "Resultat",
        unit: "",
        decimaler: 2,
        inputs: [
            { id: "voltage", label: "Uppmätt spänning (V)" },
            { id: "min", label: "Minvärde" },
            { id: "max", label: "Maxvärde" }
        ],
        calc: (v) => !valid(v.voltage, v.min, v.max) ? "Fel" : calculateProcessValueFromVoltage(v),
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
        categories: ["controls"],
        decimaler: 2,
        inputs: [
            { id: "outputSignal", label: "% Utsignal" },
            { id: "controlError", label: "Δ Ärvärde" }
        ],
        calc: (v) => !valid(v.outputSignal, v.controlError) || v.controlError === 0 ? "Felaktiga värden" : calculateProportionalBand(v),
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
        categories: ["controls"],
        decimaler: 1,
        inputs: [
            { id: "volume", label: "Volym (m³)" },
            { id: "flow", label: "Flöde (m³/h)" }
        ],
        calc: (v) => !valid(v.volume, v.flow) || v.flow === 0 ? "Fel" : calculateSystemTimeConstant(v),
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
        id: "zero_current_process_value",
        name: "Teoretiskt värde vid 0 mA",
        categories: ["controls"],
        decimaler: 2,
        inputs: [
            { id: "inputMinmA", label: "In Min (mA)" },
            { id: "inputMaxmA", label: "In Max (mA)" },
            { id: "physicalMin", label: "Fys Min" },
            { id: "physicalMax", label: "Fys Max" }
        ],
        calc: (v) => !valid(v.inputMinmA, v.inputMaxmA, v.physicalMin, v.physicalMax) ? "Fyll i fält" :
        `PLC KONFIGURATION:\nIn: ${v.inputMinmA}-${v.inputMaxmA}mA\nUt: ${v.physicalMin}-${v.physicalMax}\n\nDIAGNOS VID 0mA:\nPLC visar: ${calculateTheoreticalZeroValue(v.inputMinmA, v.inputMaxmA, v.physicalMin, v.physicalMax).toFixed(2)}`,
        info: {
            description: "Beräknar vilket processvärde en PLC eller DUC teoretiskt visar om den analoga insignalen faller till 0 mA.",
            details: "Används vid felsökning av analoga insignaler och kabelbrott. Kalkylen visar vilket värde styrsystemet kommer att presentera när en transmitter som normalt arbetar inom ett konfigurerat mA-område plötsligt levererar 0 mA.",
            formula: {
                name: "Teoretiskt värde vid 0 mA",
                description: "Teoretiskt värde vid 0 mA = ((0 mA − Givarens minström) / (Givarens maxström − Givarens minström)) × (Fysiskt maxvärde − Fysiskt minvärde) + Fysiskt minvärde"
            }
        }
    }
];
