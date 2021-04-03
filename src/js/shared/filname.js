/**
 * Returns the last path component of the given url.
 * @param url The url with components.
 * @returns {string} The last path component.
 */
export function getFilename(url) {
  return url.substring(url.lastIndexOf('/') + 1);
}

/**
 * Appends the given string in extension to the given string filename if filename not already ends with this extension.
 * @param filename A string with or without an extension.
 * @param extension The extension the filename will end with.
 * @returns {*|string} The filename with the given extension.
 */
export function appendExtensionIfNeeded(filename, extension) {
  if (extension === '' || extension === '.') return filename;
  extension = extension.startsWith(".") ? extension : `.${extension}`;
  return filename.endsWith(extension) ? filename : `${filename}${extension}`;
}
