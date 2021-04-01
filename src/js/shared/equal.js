/**
 * Compares the string version of each oof the two given values for equality.
 * @param value1 The first value to compare.
 * @param value2 The second value to compare.
 * @returns {boolean} True if the string versions are equal, false if not.
 */
export function equals(value1, value2) {
  return String(value1) === String(value2);
}


export function objectsEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  let string1 = JSON.stringify(obj1);
  let string2 = JSON.stringify(obj2);
  return string1 === string2;
}
