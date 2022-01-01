/**
 * Returns a new version of the given string by trimming the given char from the beginning and the end of the string.
 * @param string The string to be trimmed.
 * @param character The character to trim.
 * @returns {string} The trimmed version of the string.
 */
export function trimByChar(string, character) {
  const saveString = String(string);
  const first = [...saveString].findIndex((char) => char !== character);
  const last = [...saveString]
    .reverse()
    .findIndex((char) => char !== character);
  return saveString.substring(first, saveString.length - last);
}
