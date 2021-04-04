import {hashCode} from "./hash";

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
  return theID.replaceAll(' ', '-').replaceAll('/', '-');
}

/**
 * Creates and returns a unique (save to use for elements) id.  The id is created by calculating the hash of the
 * dataset's label.
 * @param dataset The dataset.
 * @returns {number} The created id.
 */
export function createIDFromDataset(dataset) {
  if (!dataset || !dataset.label) return 0;
  return hashCode(dataset.label);
}
