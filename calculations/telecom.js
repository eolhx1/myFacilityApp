//
// filenamne: ./calculations/telecom.js
//

// =================================================================
// TELE & DATA KALKYLER
// =================================================================
import { valid } from './config.js';
import { getCommonText } from '../locales.js';


const calculateFiberLossBudget = (v) => {
    if (!valid(
        v.fiberLengthKm,
        v.spliceCount,
        v.connectorCount
    )) {
        return getCommonText("error");
    }

    const lengthKm = Number(v.fiberLengthKm);
    const spliceCount = Number(v.spliceCount);
    const connectorCount = Number(v.connectorCount);

    // =============================================================
    // Fibertyper och dämpningsvärden
    // =============================================================
    //
    // attenuationDbKm = schablonvärde för fiberns dämpning i dB/km.
    //
    // OS2:
    // 1310 nm = 0,35 dB/km
    // 1550 nm = 0,22 dB/km
    //
    // OM3 / OM4:
    // 850 nm  = 2,3 dB/km
    // 1300 nm = 0,6 dB/km
    //
    // =============================================================

    const fiberTypes = {
        os2_1310: {
            type: "OS2",
            wavelengthNm: 1310,
            attenuationDbKm: 0.35
        },

        os2_1550: {
            type: "OS2",
            wavelengthNm: 1550,
            attenuationDbKm: 0.22
        },

        om3_850: {
            type: "OM3",
            wavelengthNm: 850,
            attenuationDbKm: 2.3
        },

        om3_1300: {
            type: "OM3",
            wavelengthNm: 1300,
            attenuationDbKm: 0.6
        },

        om4_850: {
            type: "OM4",
            wavelengthNm: 850,
            attenuationDbKm: 2.3
        },

        om4_1300: {
            type: "OM4",
            wavelengthNm: 1300,
            attenuationDbKm: 0.6
        }
    };

    // =============================================================
    // Schablonvärden för passiva komponenter
    // =============================================================

    const spliceLossDb = 0.05;
    const connectorLossDb = 0.5;

    // =============================================================
    // Val från appen
    // =============================================================

    const fiberKey =
        v.fiberType_unit || "os2_1310";

    const fiber =
        fiberTypes[fiberKey];

    // =============================================================
    // Validering
    // =============================================================

    if (!fiber) {
        return getCommonText("invalid_values");
    }

    if (
		lengthKm <= 0 ||
		spliceCount < 0 ||
		connectorCount < 0 ||
		!Number.isInteger(spliceCount) ||
		!Number.isInteger(connectorCount)
	) {
		return getCommonText("invalid_values");
	}


    // =============================================================
    // Beräkning
    // =============================================================

    const fiberLoss =
        lengthKm *
        fiber.attenuationDbKm;

    const spliceLoss =
        spliceCount *
        spliceLossDb;

    const connectorLoss =
        connectorCount *
        connectorLossDb;

    const totalLoss =
        fiberLoss +
        spliceLoss +
        connectorLoss;

    // =============================================================
    // Resultat
    // =============================================================

    return (
        `${getCommonText("fiber_type")}: ${fiber.type}\n` +

        `${getCommonText("wavelength")}: ${fiber.wavelengthNm} nm\n` +

        `${getCommonText("fiber_attenuation_factor")}: ${fiber.attenuationDbKm.toFixed(2)} dB/km\n` +

        `${getCommonText("fiber_length")}: ${lengthKm.toFixed(3)} km\n` +

        `\n` +

        `${getCommonText("fiber_loss")}: ${fiberLoss.toFixed(2)} dB\n` +

		`${getCommonText("splice_loss")} (${spliceCount} × ${spliceLossDb.toFixed(2)} dB): ${spliceLoss.toFixed(2)} dB\n` +

		`${getCommonText("connector_loss")} (${connectorCount} × ${connectorLossDb.toFixed(2)} dB): ${connectorLoss.toFixed(2)} dB\n` +

        `\n` +

        `${getCommonText("calculated_link_loss")}: ${totalLoss.toFixed(2)} dB`
    );
};


const calculatePoEVoltageDrop = (v) => {
    if (!valid(v.cableLengthM, v.powerW))
        return getCommonText("error");

    const lengthM = Number(v.cableLengthM);
    const powerW = Number(v.powerW);

    // =============================================================
    // PoE-standarder
    // =============================================================
    //
    // pseVoltage:
    // Konservativ matningsspänning som används i beräkningen.
    //
    // maxPdPower:
    // Maximal garanterad effekt till den matade enheten (PD).
    //
    // poweredPairs:
    // Antal kabelpar som antas användas för effektöverföringen.
	// Type 3 beräknas här som 4-pars PoE.
    //
    // =============================================================

	const poeStandards = {
		af: {
			name: "IEEE 802.3af (PoE)",
			pseVoltage: 44,
			minPdVoltage: 37,
			maxPdPower: 12.95,
			poweredPairs: 2
		},

		at: {
			name: "IEEE 802.3at (PoE+)",
			pseVoltage: 50,
			minPdVoltage: 42.5,
			maxPdPower: 25.5,
			poweredPairs: 2
		},

		bt3: {
			name: "IEEE 802.3bt Type 3 (PoE++)",
			pseVoltage: 50,
			minPdVoltage: 42.5,
			maxPdPower: 51,
			poweredPairs: 4
		},

		bt4: {
			name: "IEEE 802.3bt Type 4 (PoE++)",
			pseVoltage: 52,
			minPdVoltage: 41.1,
			maxPdPower: 71.3,
			poweredPairs: 4
		}
	};

    // =============================================================
    // Ungefärlig DC-resistans för kopparledare vid 20 °C
    // Anges i ohm per meter och ledare.
    // =============================================================

    const awgResistance = {
        "22": 0.053,
        "23": 0.067,
        "24": 0.084,
        "26": 0.134,
        "28": 0.213
    };


    // Värden från appens select-fält
    const poeKey = v.poeStandard_unit || "af";
    const awgKey = v.awg_unit || "24";

    const poe = poeStandards[poeKey];
    const conductorResistance = awgResistance[awgKey];


    // =============================================================
    // Validering
    // =============================================================

    if (!poe || conductorResistance === undefined)
        return getCommonText("invalid_values");

    if (lengthM <= 0 || powerW <= 0)
        return getCommonText("invalid_values");


    // =============================================================
    // Effektiv kabelresistans
    // =============================================================
    //
    // PoE använder två ledare parallellt inom respektive polaritet.
    //
    // Vid 2-pars PoE motsvarar den effektiva loopresistansen ungefär
    // resistansen hos en enskild ledare gånger kabellängden.
    //
    // Vid 4-pars PoE arbetar två matningsvägar parallellt vilket
    // ungefär halverar den effektiva resistansen.
    //
    // =============================================================

    const pairFactor =
        poe.poweredPairs === 4
            ? 0.5
            : 1;

    const loopResistanceOhm =
        conductorResistance *
        lengthM *
        pairFactor;


	// =============================================================
	// Beräkna spänning och ström vid konstant effekt
	// =============================================================
	//
	// Sambandet:
	// U_PD = U_PSE - (P / U_PD) × R
	//
	// kan lösas som:
	//
	// U_PD² - U_PSE × U_PD + P × R = 0
	//
	// Den fysikaliskt relevanta lösningen är den högre roten.
	// =============================================================

	const discriminant =
		Math.pow(poe.pseVoltage, 2) -
		4 * powerW * loopResistanceOhm;

	let deviceVoltageV = 0;
	let currentA = 0;

	if (discriminant >= 0) {

		deviceVoltageV =
			(
				poe.pseVoltage +
				Math.sqrt(discriminant)
			) / 2;

		currentA =
			powerW / deviceVoltageV;
	}


    // =============================================================
    // Resultat
    // =============================================================

    const voltageDropV =
        poe.pseVoltage -
        deviceVoltageV;

    const cableLossW =
        currentA *
        currentA *
        loopResistanceOhm;

    const estimatedPsePowerW =
        powerW +
        cableLossW;


// =============================================================
// Status
// =============================================================

const warnings = [];

// Kontrollera Ethernet-kanalens längd
if (lengthM > 100) {
    warnings.push(
        getCommonText("ethernet_length_warning")
    );
}

// Kontrollera vald PoE-standards effektgräns
if (powerW > poe.maxPdPower) {
    warnings.push(
        getCommonText("poe_power_warning")
    );
}

// Kontrollera om elektrisk arbetspunkt kan beräknas
if (discriminant < 0) {
    warnings.push(
        getCommonText("poe_supply_impossible")
    );
}

// Kontrollera spänningen vid PD
if (
    discriminant >= 0 &&
    deviceVoltageV < poe.minPdVoltage
) {
    warnings.push(
        getCommonText("voltage_drop_warning")
    );
}

const status =
    warnings.length === 0
        ? getCommonText("poe_status_ok")
        : warnings.join("\n");

// =============================================================
// Presentera resultat
// =============================================================

// Om ingen stabil arbetspunkt kan beräknas,
// visa inte missvisande värden för spänning och ström.
if (discriminant < 0) {
    return (
        `${getCommonText("poe_standard")}: ${poe.name}\n` +
        `${getCommonText("conductor_size")}: AWG ${awgKey}\n` +
        `${getCommonText("cable_length")}: ${lengthM.toFixed(0)} m\n` +
        `${getCommonText("device_power")}: ${powerW.toFixed(1)} W\n` +
        `${getCommonText("poe_power_pairs")}: ${poe.poweredPairs}\n` +
        `${getCommonText("cable_resistance")}: ${loopResistanceOhm.toFixed(2)} Ω\n` +
        `${getCommonText("minimum_pd_voltage")}: ${poe.minPdVoltage.toFixed(1)} V\n` +
        `${getCommonText("max_pd_power")}: ${poe.maxPdPower.toFixed(2)} W\n` +
        `\n` +
        `${getCommonText("status")}: ${status}`
    );
}

// Normal resultatutskrift
return (
    `${getCommonText("poe_standard")}: ${poe.name}\n` +
    `${getCommonText("conductor_size")}: AWG ${awgKey}\n` +
    `${getCommonText("cable_length")}: ${lengthM.toFixed(0)} m\n` +
    `${getCommonText("device_power")}: ${powerW.toFixed(1)} W\n` +
    `${getCommonText("poe_power_pairs")}: ${poe.poweredPairs}\n` +
    `${getCommonText("cable_resistance")}: ${loopResistanceOhm.toFixed(2)} Ω\n` +
    `${getCommonText("max_pd_power")}: ${poe.maxPdPower.toFixed(2)} W\n` +
    `\n` +
    `${getCommonText("pse_voltage")}: ${poe.pseVoltage.toFixed(1)} V\n` +
    `${getCommonText("voltage_at_device")}: ${deviceVoltageV.toFixed(1)} V\n` +
    `${getCommonText("minimum_pd_voltage")}: ${poe.minPdVoltage.toFixed(1)} V\n` +
    `${getCommonText("voltage_drop")}: ${voltageDropV.toFixed(2)} V\n` +
    `${getCommonText("calculated_current")}: ${currentA.toFixed(2)} A\n` +
    `${getCommonText("cable_loss")}: ${cableLossW.toFixed(2)} W\n` +
    `${getCommonText("estimated_pse_power")}: ${estimatedPsePowerW.toFixed(1)} W\n` +
    `\n` +
    `${getCommonText("status")}: ${status}`
);
};


export const telecomCalculations = [
    {
        id: "fiber_loss_budget",
        nameKey: "fiber_loss_budget",
        categories: ["telecom"],
        decimaler: 2,

		inputs: [
			{
				id: "fiberType",
				labelKey: "fiber_type_wavelength",
				unit: [
					"os2_1310",
					"os2_1550",
					"om3_850",
					"om3_1300",
					"om4_850",
					"om4_1300"
				],
				requiresInput: false
			},

			{
				id: "fiberLengthKm",
				labelKey: "fiber_length_km"
			},

			{
				id: "spliceCount",
				labelKey: "splice_count"
			},

			{
				id: "connectorCount",
				labelKey: "connector_connection_count"
			}
		],

        calc: calculateFiberLossBudget,

        info: {
            descriptionKey: "fiber_loss_budget_desc",
            detailsKey: "fiber_loss_budget_details",

            formula: {
                nameKey: "fiber_loss_budget_formula_name",
                descriptionKey: "fiber_loss_budget_formula_desc"
            }
        }
    },

    {
        id: "poe_voltage_drop",
        nameKey: "poe_voltage_drop",
        categories: ["telecom"],
        decimaler: 2,

		inputs: [
			{
				id: "poeStandard",
				labelKey: "poe_standard",
				unit: [
					"af",
					"at",
					"bt3",
					"bt4"
				],
				requiresInput: false
			},

			{
				id: "awg",
				labelKey: "conductor_size",
				unit: [
					"24",
					"23",
					"22",
					"26",
					"28"
				],
				requiresInput: false
			},

			{
				id: "cableLengthM",
				labelKey: "cable_length_m"
			},

			{
				id: "powerW",
				labelKey: "device_power_w"
			}
		],

        calc: calculatePoEVoltageDrop,

        info: {
            descriptionKey: "poe_voltage_drop_desc",
            detailsKey: "poe_voltage_drop_details",

            formula: {
                nameKey: "poe_voltage_drop_formula_name",
                descriptionKey: "poe_voltage_drop_formula_desc"
            }
        }
    }
];