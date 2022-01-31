import { isEmpty } from "./values";
import { safeId } from "./identifiers";

const MAX_FILENAME_LENGTH_OS = 255;

const MAX_FILENAME_LENGTH = MAX_FILENAME_LENGTH_OS - 30;

function trim(input) {
  return input.length >= MAX_FILENAME_LENGTH
    ? input.substring(0, MAX_FILENAME_LENGTH)
    : input;
}

/**
 * The default filename creator.
 * @param {*} data
 * @param {*} dc
 * @returns
 */
export const FILENAME_GENERATOR = function (data, dc) {
  let name = "";
  let comps = isEmpty(data.stacks) ? data.labels : data.stacks;
  let amount = comps.length;
  let joined = comps.map((c) => safeId(c)).join(";");
  let short = trim(joined) + "---+" + amount + "";
  return short;
};
