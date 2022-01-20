import { LOTIVIS_CONFIG } from "./config";

/** lotivis-wide global variable for enabling debug logging */
export var D_LOG = false;

/**
 * Sets whether lotivis prints debug log messages to the console.
 * @param enabled A Boolean value indicating whether to enable debug logging.
 * @param printConfig A Boolean value indicating whether to print the global lotivis configuration.  Default is false.
 */
export function debug(enabled) {
  LOTIVIS_CONFIG.debug = enabled;
  D_LOG = enabled;
  console.log(`[ltv]  ${enabled ? "En" : "Dis"}abled debug mode.`);
}

/**
 * Return a Boolean value indicating whether the given
 * value is a string.
 *
 * @param {*} v The value to check.
 * @returns true if given value is a string
 */
function isString(v) {
  return typeof v === "string" || v instanceof String;
}

/**
 * Returns a Boolean value indicating whether lotivis
 * runs in the browser (else it will probably run in an
 * environment like node)
 * */
export function runsInBrowser() {
  return !(typeof document === "undefined");
}

export function set_data_preview(v) {
  if (!v || !LOTIVIS_CONFIG.debug) return;
  if (typeof document === "undefined") return;
  let s = isString(v) ? v : JSON.stringify(v, null, 2);
  let e = document.getElementById("ltv-data-preview");
  if (e) e.textContent = s;
}
