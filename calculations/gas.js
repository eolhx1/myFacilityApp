// =================================================================
// GAS KALKYLER
// =================================================================
import { valid } from './hjalpmedel.js';

const beraknaAnvandningstidGas = (v) => {
    // Validera alla indata. Om minTryck inte anges kan det sättas till 0 som standard.
    const minTryck = v.minTryck || 0;

    if (!valid(v.volym, v.tryck, v.flode, minTryck) || v.flode === 0) return "Fel";

    // Det tillgängliga trycket som faktiskt kan användas
    const tillgangligtTryck = v.tryck - minTryck;

    // Om trycket i flaskan är lägre än eller lika med minimitrycket släpps ingen gas ut
    if (tillgangligtTryck <= 0) return 0;

    return (v.volym * tillgangligtTryck) / (v.flode * 60);
};

export const gasKalkyler = [{
    id: "gas_anvandningstid",
    namn: "Användningstid gasflaska",
    kategorier: ["gas"],
    decimaler: 1,
    inputs: [
        { id: "volym", label: "Flaskans volym", unit: ["L"] },
        { id: "tryck", label: "Tryck i flaskan", unit: ["bar"] },
        { id: "minTryck", label: "Regulatorns min. tryck (resttryck)", unit: ["bar"] },
        { id: "flode", label: "Ordinerat flöde", unit: ["L/min"] }
    ],
    calc: beraknaAnvandningstidGas,
    info: {
        beskrivning: "Beräknar uppskattad räcker-tid för en gasflaska vid givet uttag med hänsyn till regulatorns minimitryck.",
        detaljer: "Används för att beräkna hur länge en gasflaska räcker baserat på flaskans vattenvolym, aktuellt tryck, regulatorns lägsta driftstryck och det uttagna flödet."
    }
}];