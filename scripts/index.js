const { createApp, ref, watch, computed } = Vue

const mode = ref('raw');

// change right arrow to down if on mobile
var arrowDir = "right"
if (matchMedia('only screen and (max-width: 900px)').matches) arrowDir = "down";


// validate raw percent input
const rawPercent = ref('');
watch(rawPercent, (newVal, oldVal) => {
    if (newVal === '') return;
    let val = parseInt(newVal);
    if (isNaN(val) || val < 0 || val > 100) {
        rawPercent.value = oldVal;
    }
});

// validate fraction inputs
const fracNumerator = ref('');
const fracDenominator = ref('');
watch([fracNumerator, fracDenominator], ([newNum, newDen], [oldNum, oldDen]) => {
    if (newNum === '' || newDen === '') return;
    let numVal = parseFloat(newNum);
    let denVal = parseFloat(newDen);
    if (isNaN(numVal) || isNaN(denVal) || numVal < 0 || denVal <= 0) {
        fracNumerator.value = oldNum;
        fracDenominator.value = oldDen;
    }
});


const subjectData = ref({});

// re-fetch data when subject changes
async function loadSubject(data) {
    const [jsonURL, name] = data.split(' - ');
    subjectData.value = await fetchSubjectData(jsonURL);
    subjectData.value.name = name;
};

// Autoselect first subject
const firstGroup = Object.keys(subjects)[0];
const firstSubject = Object.keys(subjects[firstGroup])[0];
loadSubject(subjects[firstGroup][firstSubject] + ' - ' + firstSubject);


// live conversions
const converted = computed(() => {
    if (mode.value === 'raw' && rawPercent.value !== '') {
        return convert(parseFloat(rawPercent.value), 100);
    } else if (mode.value === 'frac' && fracNumerator.value !== '' && fracDenominator.value !== '') {
        return convert(parseFloat(fracNumerator.value), parseFloat(fracDenominator.value));
    } else {
        return { level: null, percent: null };
    }
});

// Mount vue
const app = createApp({
    data() {
        return {
            arrowDir,
            mode,
            rawPercent,
            fracNumerator,
            fracDenominator,
            subjects,
            loadSubject,
            subjectData,
            levelDescriptors,
            converted,
        }
    }
});

app.config.compilerOptions = app.config.compilerOptions || {};
app.config.compilerOptions.isCustomElement = (tag) => {return tag === 'amp-ad'};

app.mount('body')