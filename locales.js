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
        const [common, calculations, info] = await Promise.all([
            fetch(`./locales/${lang}/common.json`).then(r => r.json()),
            fetch(`./locales/${lang}/calculations.json`).then(r => r.json()),
            fetch(`./locales/${lang}/info.json`).then(r => r.json())
        ]);

        translations.common = common;
        translations.calculations = calculations;
        translations.info = info;

        return true;
    } catch (error) {
        console.error("Kunde inte ladda språkfiler:", error);
        return false;
    }
}

export function getTranslations() {
    return translations;
}