/**
 * Creates and returns a unique ID.
 */
export var createID;
(function () {
  let uniquePrevious = 0;
  createID = function () {
    return 'lotivis-id-' + uniquePrevious++;
  };
}());

/**
 * Returns a 'save-to-use' id for a HTML element by replacing whitespace with dashes.
 * @param theID The id for a HTML element.
 * @returns {string} The save version of the given id.
 */
export function toSaveID(theID) {
  return theID.replaceAll(' ', '-');
}
