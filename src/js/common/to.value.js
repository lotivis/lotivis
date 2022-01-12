import { LOTIVIS_CONFIG } from "./config";

/**
 * Returns the value if it evaluates to true or is 0.  Returns `LOTIVIS_CONFIG.unknown` else.
 *
 * @param value The value to check.
 * @returns The value or `LOTIVIS_CONFIG.unknown`.
 */
export function toValue(value) {
  return value || (value === 0 ? 0 : LOTIVIS_CONFIG.unknown);
}
