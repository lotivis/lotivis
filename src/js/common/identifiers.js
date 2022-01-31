// https://stackoverflow.com/questions/70579/what-are-valid-values-for-the-id-attribute-in-html
// ids must not contain whitespaces
// ids should avoid ".", ":" and "/"

/**
 * @param {*} id The id to escape from invalid characters
 * @returns A safe to use version of the id
 */
export function safeId(id) {
  return id
    .split(` `)
    .join(`-`)
    .split(`/`)
    .join(`-`)
    .split(`.`)
    .join(`-`)
    .split(`:`)
    .join(`-`);
}

/**
 * Creates and returns a unique generated string.
 */
export const uniqueId = (function () {
  var prefix = "ltv";
  var unique = 0;
  var random = () => Math.random().toString(36).substring(2, 8);

  return function (type = "id") {
    return [prefix, type, "" + unique++, random()].join("-");
  };
})();
