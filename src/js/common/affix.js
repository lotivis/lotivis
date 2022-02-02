/**
 * Appends the passed value in suffix to the passed value of string if string not
 * already ends with suffix.
 *
 * @param {*} string The source string to be extended
 * @param {*} suffix The suffix to append
 * @returns {string} The string with the passed suffix
 */
// export function append(string, suffix) {
//   return ("" + string).endsWith(suffix || "") ? string : string + suffix;
// }

function str(src) {
  return "" + src;
}

export function prefix(src, pre) {
  return (src = str(src)), src.startsWith(pre || "") ? src : pre + src;
}

export function postfix(src, post) {
  return (src = str(src)), src.endsWith(post || "") ? src : src + post;
}
