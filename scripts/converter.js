const subjects = {
    "Group 1: Language & Literature": {
        "HL English": "./data/eng.json",
    },
    "Group 2: Language Acquisition": {
        "SL French": "./data/fsf.json",
        "HL French": "./data/fif.json",
        "SL Spanish": "./data/esp.json",
    },
    "Group 3: Individuals & Societies": {
        "HL Economics": "./data/econ.json",
        "HL Geography": "./data/geo.json",
        "SL Business": "./data/bbb.json",
    },
    "Group 4: Sciences": {
        "SL Chemistry": "./data/scha.json",
        "HL Chemistry": "./data/schb.json",
        "SL Biology": "./data/sbia.json",
        "HL Biology": "./data/sbib.json",
        "SL Physics": "./data/sph.json",
    },
    "Group 5: Mathematics": {
        "SL Math": "./data/mtha.json",
        "HL Math": "./data/mthb.json"
    },
    // "Group 6: The Arts": {
    // }
};

const levelDescriptors = [
    ["#f94144", "./assets/images/level1.avif"],
    ["#f3722c", "./assets/images/level2.avif"],
    ["#f8961e", "./assets/images/level3.avif"],
    ["#f9c74f", "./assets/images/level4.avif"],
    ["#90be6d", "./assets/images/level5.avif"],
    ["#43aa8b", "./assets/images/level6.avif"],
    ["#2CBCED", "./assets/images/level7.avif"]
]


async function fetchSubjectData(subjectJson) {
    return fetch(subjectJson)
        .then(response => response.json()).then(rawData => {
            data = {
                raw: [], // index is raw mark, value is converted mark
                gradeBoundaries: {}
            }

            for (let level in rawData) {
                // raw data -> converted percentage
                let parsedData = [[], []]; // [rawPercent, converted] for grade boundaries
                for (let rawMark in rawData[level]) {
                    parsedData[0].push(parseInt(rawMark));
                    parsedData[1].push(rawData[level][rawMark]);

                    data.raw.push(rawData[level][rawMark]);
                }

                // boundaries
                data.gradeBoundaries[level] = {
                    raw: [Math.min(...parsedData[0]), Math.max(...parsedData[0])],
                    converted: [Math.min(...parsedData[1]), Math.max(...parsedData[1])]
                };
            }

            return data;
        });
}

function convert(numerator, denominator) {
    if (denominator === 0) return { level: null, percent: null };
    const percent = parseInt((numerator / denominator) * 100);
    
    if (!isFinite(percent) || percent < 0 || percent >= subjectData.value.raw.length) return { level: -1, percent: -1 };
    const convertedPercent = subjectData.value.raw[percent];
    let level = null;
    // Find IB level for this raw mark
    for (const [lvl, bounds] of Object.entries(subjectData.value.gradeBoundaries)) {
        if (percent >= bounds.raw[0] && percent <= bounds.raw[1]) {
            // Extract number from 'Level X' string
            const match = lvl.match(/Level (\d+)/);
            if (match) {
                level = parseInt(match[1]);
            }
            break;
        }
    }
    // console.log(level, convertedPercent);
    return { level, percent: convertedPercent };
}
