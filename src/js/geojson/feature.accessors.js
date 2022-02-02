import { isValue } from "../common/values";

/**
 * Default accessor for the id of a feature.
 * @param {*} f The feature to get an id for
 * @returns The id of the feature
 */
export const FEATURE_ID_ACCESSOR = function (f) {
    if (f.id || f.id === 0) return f.id;
    if (f.properties && isValue(f.properties.id)) return f.properties.id;
    if (f.properties && isValue(f.properties.code)) return f.properties.code;
    return f.properties ? hash(f.properties) : hash(f);
};

/**
 * Default accessor for the name of a feature.
 * @param {*} f The feature to get an name for
 * @returns The name of the feature
 */
export const FEATURE_NAME_ACCESSOR = function (f) {
    if (isValue(f.name)) return f.name;
    if (f.properties && isValue(f.properties.name)) return f.properties.name;
    if (f.properties && isValue(f.properties.nom)) return f.properties.nom;
    return FEATURE_ID_ACCESSOR(f);
};
