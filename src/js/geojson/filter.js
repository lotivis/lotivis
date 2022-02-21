import { copy as geojsonCopy } from "./copy.js";
import { FEATURE_ID_ACCESSOR } from "./feature.accessors.js";

/**
 * Returns a new generated GeoJSON containing only the Features having the
 * ids specified.
 *
 * @param {GeoJSON} json The GeoJSON with Features to remove
 * @param {Array} ids The ids of Features to remove
 * @param {*} idValue An id accessor for the Features
 * @returns {GeoJSON} The new generated GeoJSON
 */
export function filter(json, ids, idValue = FEATURE_ID_ACCESSOR) {
    return geojsonCopy(json, ids, (f) => ids.includes(idValue(f)));
}
