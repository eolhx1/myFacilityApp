//
// filenamne: ./locales.js
//

let translations = {
    common: {},
    calculations: {},
    info: {}
};

export async function loadLanguage(lang = "sv") {
    try {

        const commonResponse =
            await fetch(`./locales/${lang}/common.json`);

        const calculationsResponse =
            await fetch(`./locales/${lang}/calculations.json`);

        const infoResponse =
            await fetch(`./locales/${lang}/info.json`);

        const commonText = await commonResponse.text();
        const calculationsText = await calculationsResponse.text();
        const infoText = await infoResponse.text();

        console.log("COMMON:");
        console.log(commonText);

        console.log("CALCULATIONS:");
        console.log(calculationsText);

        console.log("INFO:");
        console.log(infoText);

        translations.common = JSON.parse(commonText);
        translations.calculations = JSON.parse(calculationsText);
        translations.info = JSON.parse(infoText);

        return true;

    } catch (error) {
        console.error(error);
        return false;
    }
}