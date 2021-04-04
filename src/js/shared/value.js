import {LotivisConfig} from "./config";

/**
 * Returns `true` if the given value not evaluates to false and is not 0. false else.
 * @param value The value to check.
 * @returns {boolean} A Boolean value indicating whether the given value is valid.
 */
export function isValue(value) {
  return Boolean(value || value === 0);
}

/**
 * Returns the value if it evaluates to true or is 0.  Returns `GlobalConfig.unknown` else.
 * @param value The value to check.
 * @returns The value or `GlobalConfig.unknown`.
 */
export function toValue(value) {
  return value || (value === 0 ? 0 : LotivisConfig.unknown);
}
