//
// filename: ./locales.js
//

let translations = {
    common: {},
    info: {}
};

export async function loadLanguage(lang = "sv") {
    try {
        const [common, info] = await Promise.all([
            fetch(`./locales/${lang}/common.json`).then(r => r.json()),
            fetch('./info.json').then(r => r.json())
        ]);

        translations.common = common;
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

export function getCalculationInfo(key) {
    return translations.info?.[key] || {};
}

export function getCommonText(key) {
    return translations.common?.[key] || key;
}