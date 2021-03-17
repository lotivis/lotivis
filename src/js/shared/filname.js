/**
 * Returns the last path component of the given url.
 * @param url The url with components.
 * @returns {string} The last path component.
 */
export function getFilename(url) {
  return url.substring(url.lastIndexOf('/') + 1);
}
