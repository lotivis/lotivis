import { datatext } from "../datatext";
import { GERMAN_NUMBER_FORMAT } from "./formats";

export var LOTIVIS_CONFIG = {
  // The default margin to use for charts.
  defaultMargin: 60,
  // The default offset for the space between an object an the toolbar.
  tooltipOffset: 7,
  // The default radius to use for bars drawn on a chart.
  barRadius: 5,
  // A Boolean value indicating whether the debug logging is enabled.
  debug: true,
  // A string which is used as prefix for download.
  downloadFilePrefix: "lotivis",
  // A string which is used as separator between components when creating a file name.
  filenameSeparator: "_",
  // A string which is used for unknown values.
  unknown: "LOTIVIS_UNKNOWN",
  // The default number formatter used by all charts.
  numberFormat: GERMAN_NUMBER_FORMAT,

  // the border style
  defaultBorder: "solid 1px lightgray",

  selectionOpacity: 0.1,
};

/**
 * Appends the passed value in appendix to the passed value of string if string not
 * already ends with appendix.
 *
 * @param {*} string
 * @param {*} appendix
 * @returns {string} The passed string having the passed appendix
 */
export function append(string, appendix) {
  return ("" + string).endsWith(appendix) ? string : string + appendix;
}

/**
 * Initiates a download of the passed blob with the passed name.
 * @param {*} blob The blob to download
 * @param {*} filename The name of the downloaded file
 */
export function download(blob, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  }
}

// DEBUG

/**
 * Sets whether lotivis prints debug log messages to the console.
 * @param enabled A Boolean value indicating whether to enable debug logging.
 * @param printConfig A Boolean value indicating whether to print the global lotivis configuration.  Default is false.
 */
export function debug(enabled) {
  LOTIVIS_CONFIG.debug = enabled;
  console.log(`[ltv]  ${enabled ? "En" : "Dis"}abled debug mode.`);
}

/**
 * Returns a Boolean value indicating whether lotivis
 * runs in the browser (else it will probably run in an
 * environment like Node.js)
 * */
export function runsInBrowser() {
  return !(typeof document === "undefined");
}

export function data_preview(dc) {
  if (!dc || !LOTIVIS_CONFIG.debug || !runsInBrowser()) return;
  if (!document.getElementById("ltv-data")) return;
  datatext().selector("#ltv-data").dataController(dc).run();
}
