/**
 * Returns the hash of the given string.
 * @param aString The string to create the hash of.
 * @returns {number} The hash of the given string.
 */
export function hashCode(aString) {
  let hash = 0, i, chr;
  for (i = 0; i < aString.length; i++) {
    chr = aString.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
