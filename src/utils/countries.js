import { getName } from 'country-list';
import { sortBy } from 'lodash';

const availableCountries = [
    'ae', 'ar', 'at', 'au', 'be', 'bg', 'br', 'ca', 'ch', 'cn', 'co', 'cu', 'cz', 'de', 'eg', 'fr',
    'gb', 'gr', 'hk', 'hu', 'id', 'ie', 'il', 'in', 'it', 'jp', 'kr', 'lt', 'lv', 'ma', 'mx', 'my',
    'ng', 'nl', 'no', 'nz', 'ph', 'pl', 'pt', 'ro', 'rs', 'ru', 'sa', 'se', 'sg', 'si', 'sk', 'th',
    'tr', 'tw', 'ua', 'us', 've', 'za'
];

let countryList = availableCountries.map(c => {
    return {
        value: c,
        label: getName(c.toUpperCase())
    }
});

countryList = sortBy(countryList, 'name');

countryList = [{
    value: '',
    label: 'Select One'
}, ...countryList];

export default countryList;
