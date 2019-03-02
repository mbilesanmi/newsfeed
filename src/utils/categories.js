const categs = [
    'business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'
];

let categories = categs.map(c => {
    return {
        value: c,
        label: c.charAt(0).toUpperCase() + c.slice(1)
    }
});

categories = [{
    value: '',
    label: 'Select One'
}, ...categories];

export default categories;
