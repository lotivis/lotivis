import { LOTIVIS_CONFIG } from "./config";

/**
 * Appends the given string in extension to the given string filename if filename not already ends with this extension.
 *
 * @param filename A string with or without an extension.
 * @param extension The extension the filename will end with.
 *
 * @returns {*|string} The filename with the given extension.
 */
export function appendExtensionIfNeeded(filename, extension) {
  if (extension === "" || extension === ".") return filename;
  extension = extension.startsWith(".") ? extension : `.${extension}`;
  return filename.endsWith(extension) ? filename : `${filename}${extension}`;
}

export function createDownloadFilename() {
  let components = [LOTIVIS_CONFIG.downloadFilePrefix];
  let separator = LOTIVIS_CONFIG.filenameSeparator;
  for (let i = 0; i < arguments.length; i++) {
    components.push(String(arguments[i]));
  }
  return components.join(separator);
}
