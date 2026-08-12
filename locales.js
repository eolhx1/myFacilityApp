//
// filename: ./locales.js
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
        console.error("Failed to load language files:", error);
        return false;
    }
}

export function getTranslations() {
    return translations;
}

export function getCalculationTitle(key) {
    return translations.calculations?.[key]?.title || key;
}

export function getCalculationInfo(key) {
    return translations.info?.[key] || {};
}

export function getCommonText(key) {
    return translations.common?.[key] || key;
}