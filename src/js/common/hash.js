/**
 * Returns the hash of the given string.
 * @param aString The string to create the hash of.
 * @returns {number} The hash of the given string.
 */
export function hash_str(s) {
  let hash = 0,
    i,
    chr;
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

export function hash_obj(o) {
  return hash_str(JSON.stringify(o));
}
