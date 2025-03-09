/**
 * Hash identification module
 * Provides functionality to identify hash types from various sources
 */

/**
 * Fetches hash types from pyWhat database
 * @returns {Promise<Array>} Array of hash type objects
 */
export async function getPyWhatHashTypes() {
    const knownHashTypes = [];
    const resp = await fetch("https://raw.githubusercontent.com/bee-san/pyWhat/main/pywhat/Data/regex.json");
    const data = await resp.json();

    for (let i = data.length - 1; i >= 0; i--) {
        try {
            const r = new RegExp(data[i].Regex, 'i');
            knownHashTypes.push({
                name: "pyWhat: " + data[i].Name,
                re: r,
            });
        } catch(err) {
            continue;
        }
    }

    return knownHashTypes;
}

/**
 * Fetches hash types from Haiti database
 * @returns {Promise<Array>} Array of hash type objects
 */
export async function getHaitiHashTypes() {
    const knownHashTypes = [];
    const resp = await fetch("https://raw.githubusercontent.com/noraj/haiti/master/data/prototypes.json");
    const data = await resp.json();

    for (let i = data.length - 1; i >= 0; i--) {
        const r = new RegExp(data[i].regex, 'i');
        for (let j = data[i].modes.length - 1; j >= 0; j--) {
            knownHashTypes.push({
                name: "haiti: " + data[i].modes[j].name,
                re: r,
                hashcat: data[i].modes[j].hashcat,
                john: data[i].modes[j].john,
            });
        }
    }

    return knownHashTypes;
}

/**
 * Fetches hash types from Name-That-Hash database
 * @returns {Promise<Array>} Array of hash type objects
 */
export async function getNTHHashTypes() {
    const knownHashTypes = [];
    const resp = await fetch("https://raw.githubusercontent.com/HashPals/Name-That-Hash/main/name_that_hash/hashes.py");
    const data = await resp.text();

    const hashProto = new RegExp(/re\.compile\(r\"(.+?)\".*?modes=\[(.*?)\]/, 'gms');
    const regexExtractor = new RegExp(/re\.compile\(r\"(.*?)\"/, 'gms');
    const nameExtractor = new RegExp(/name=.?\"(.*?)\"/, 'gms');
    const hashcatExtractor = new RegExp(/hashcat=(\d+?),/, 'gms');
    const johnExtractor = new RegExp(/john=\"(.+?)\",/, 'gms');

    const found = data.match(hashProto);
    for (let i = found.length - 1; i >= 0; i--) {
        const regexes = [...found[i].matchAll(regexExtractor)];
        const names = [...found[i].matchAll(nameExtractor)];
        const hashcatModes = [...found[i].matchAll(hashcatExtractor)];
        const johnModes = [...found[i].matchAll(johnExtractor)];

        if (regexes !== undefined) {
            const r = new RegExp(regexes[0][1], 'i');

            let hashcatMode;
            if (hashcatModes !== undefined && hashcatModes.length > 0) {
                hashcatMode = hashcatModes[0][1];
            }
            
            let johnMode;
            if (johnModes !== undefined && johnModes.length > 0) {
                johnMode = johnModes[0][1];
            }

            knownHashTypes.push({
                name: "NTH: " + names[0][1],
                re: r,
                hashcat: hashcatMode,
                john: johnMode,
            });
        }
    }
    return knownHashTypes;
}

/**
 * Identifies hash type from a given hash string
 * @param {Array} hashTypes Array of hash type objects
 * @param {string} hash Hash string to identify
 * @returns {Array} Array of matching hash types
 */
export function identifyHash(hashTypes, hash) {
    const results = [];
    for (let j = hashTypes.length - 1; j >= 0; j--) {
        const match = hash.match(hashTypes[j].re);
        if (match !== null) {
            results.push({
                hash: hash,
                hashType: hashTypes[j],
            });
        }
    }
    return results;
}

/**
 * Displays hash identification results in the DOM
 * @param {Array} results Array of hash identification results
 */
export function displayResults(results) {
    let table = "";
    let row = "";
    for (let i = results.length - 1; i >= 0; i--) {
        const result = results[i];
        if (results[i].hashType !== undefined) {
            row = `<tr>
                <td class="wordwrap">${result.hash}</td>
                <td>${result.hashType.name}</td>
                <td>${result.hashType.hashcat}</td>
                <td>${result.hashType.john}</td>
            </tr>`;
        } else {
            row = `<tr>
                <td>${result.hash}</td>
                <td>?</td>
                <td>?</td>
                <td>?</td>
            </tr>`;
        }
        table += row;
    }

    document.getElementById("results").innerHTML = table;
    document.getElementById("results").parentNode.classList.remove('d-none');
}

/**
 * Main function to identify hashes from input field
 */
export async function identify() {
    const hashesFieldValue = document.getElementById("hashesInputField").value;
    const hashes = hashesFieldValue.split("\n");
    const haitiHashTypes = await getHaitiHashTypes();
    const nthHashTypes = await getNTHHashTypes();
    const pywhatHashTypes = await getPyWhatHashTypes();

    let hashTypes = haitiHashTypes.concat(nthHashTypes);
    hashTypes = hashTypes.concat(pywhatHashTypes);

    const results = [];
    for (let i = hashes.length - 1; i >= 0; i--) {
        const detected = identifyHash(hashTypes, hashes[i]);
        for (let j = detected.length - 1; j >= 0; j--) {
            results.push(detected[j]);
        }
    }
    displayResults(results);
}
