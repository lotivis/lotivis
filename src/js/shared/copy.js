/**
 * Returns a copy of the passed object.  The copy is created by using the
 * JSON's `parse` and `stringify` functions.
 *
 * @param object The java script object to copy.
 * @returns {any} The copy of the object.
 */
export function copy(object) {
  return JSON.parse(JSON.stringify(object));
}
