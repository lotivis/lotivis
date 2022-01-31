/**
 * Returns `true` if the given value not evaluates to false and is not 0. false else.
 * @param value The value to check.
 * @returns {boolean} A Boolean value indicating whether the given value is valid.
 */
export function isValue(value) {
  return Boolean(value || value === 0);
}

export function isString(value) {
  return value && typeof value === "string";
}

export function isFunction(value) {
  return value && typeof value === "function";
}

export function isNumber(value) {
  return typeof value === "number";
}

export function isEmpty(value) {
  return value ? value.length === 0 : false;
}

export function copy(object) {
  return JSON.parse(JSON.stringify(object));
}
