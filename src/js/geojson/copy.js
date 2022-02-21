/**
 * Returns a copy the passed
 * @param {*} json
 * @param {*} ids
 * @param {*} featuresFilter
 * @returns
 */
export function copy(json, ids, featuresFilter) {
    if (!Array.isArray(ids)) {
        throw new Error("invalid ids. not an array");
    }
    if (!Array.isArray(json.features)) {
        throw new Error("no features in geojson");
    }

    // copy to do not modify original
    let theCopy = JSON.parse(JSON.stringify(json));
    theCopy.features = theCopy.features.filter(featuresFilter);
    return theCopy;
}
