import {flatDatasets} from "../data.juggle/dataset.flat";

/**
 *
 * @param input
 * @returns {FlatData}
 * @constructor
 */
export function FlatData(input) {
  let datasets = Array.isArray(input) ? input : [input];
  this.data = flatDatasets(datasets);
  return this;
}
