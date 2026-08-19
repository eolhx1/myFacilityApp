//
// filename: ./locales.js
//
// Hantering av språkfiler och översättningar.
//

// ==========================================================================
// 1. GLOBAL STATE
// ==========================================================================

let translations = {
    common: {},
    info: {}
};

// ==========================================================================
// 2. SPRÅKINLÄSNING
// ==========================================================================

export async function loadLanguage(lang = "sv") {

    try {

        const [common, info] = await Promise.all([
            fetch(`./locales/${lang}/common.json`)
                .then(r => r.json()),

            fetch('./info.json')
                .then(r => r.json())
        ]);

        translations.common = common;
        translations.info = info;

        return true;

    } catch (error) {

        console.error(
            "Failed to load language files:",
            error
        );

        return false;
    }
}

// ==========================================================================
// 3. HÄMTA ÖVERSÄTTNINGAR
// ==========================================================================

// ----------------------------------
// Hämta alla översättningar
// ----------------------------------

export function getTranslations() {
    return translations;
}

// ----------------------------------
// Hämta kalkylinformation
// ----------------------------------

export function getCalculationInfo(key) {
    return translations.info?.[key] || {};
}

// ----------------------------------
// Hämta översatt text
// ----------------------------------

export function getCommonText(key) {
    return translations.common?.[key] || key;
}