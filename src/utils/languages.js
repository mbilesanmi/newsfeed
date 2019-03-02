import { getLanguage } from 'country-language';

const availableLanguages = [
    'ar', 'de', 'en', 'es', 'fr', 'he', 'it', 'nl', 'no', 'pt', 'ru', 'se', 'zh'
];

let languages = availableLanguages.map(lang => {
    const lan = getLanguage(lang, (err, language) => {
        if (!err) {
            return language.name[0];
        } else {
            console.log(err);
        }
    });
    return {
        value: lang,
        label: lan
    }
});

languages = [{
    value: '',
    label: 'Select One'
}, ...languages];

export default languages;
