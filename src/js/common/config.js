import { ltv_debug } from "./debug";
import { GERMAN_NUMBER_FORMAT } from "./formats";

/**
 * lotivis wide default values
 */
export const DEFAULTS = {
  /**
   * A string which is used for unknown values
   */
  unknown: "LOTIVIS_UNKNOWN",

  /**
   * The border style
   */
  borderStyle: "solid 1px lightgray",

  /**
   * The default number formatter used by all charts.
   */
  numberFormat: GERMAN_NUMBER_FORMAT,

  /**
   * The default margin to use for charts
   */
  margin: 60,

  /**
   *  The default offset for the space between an object an the toolbar
   */
  tooltipOffset: 7,

  /**
   * The default radius to use for bars drawn on a chart
   */
  barRadius: 5,

  /**
   * A string which is used as prefix for download.
   */
  downloadFilePrefix: "ltv",

  /**
   * The deault filename generator.
   */
  // filenameGenerator: FILENAME_GENERATOR,
};

/**
 * lotivis wide configuration
 */
export const CONFIG = {
  /**  A Boolean value indicating whether the debug logging is enabled */
  debug: true,

  /** The default margin to use for charts */
  defaultMargin: DEFAULTS.margin,

  /** The default offset for the space between an object an the toolbar */
  tooltipOffset: DEFAULTS.tooltipOffset,

  /** The default radius to use for bars drawn on a chart */
  barRadius: DEFAULTS.barRadius,

  /** The opacity to use for selection. */
  selectionOpacity: 0.1,

  /** A string which is used as prefix for download. */
  downloadFilePrefix: DEFAULTS.downloadFilePrefix,

  /** A string which is used as separator between components when creating a file name. */
  filenameSeparator: DEFAULTS.filenameSeparator,

  /** The default number formatter used by all charts. */
  numberFormat: DEFAULTS.numberFormat,

  /** The default id for a container displying the current url */
  debugURLDivId: "DEBUG-ltv-url-DEBUG",

  debugDataDivId: "DEBUG-ltv-data-DEBUG",

  /**
   * The deault filename generator.
   */
  // filenameGenerator: DEFAULTS.filenameGenerator,
};

/**
 * Gets or sets the configuration of lotivis.
 * @param {*} input
 */
export function config(input) {
  // return config object for no arguments
  if (!arguments.length) return CONFIG;

  // return the value for the given key if input is string
  if (arguments.length === 1 && typeof input === "string")
    return Object.hasOwnProperty.call(CONFIG, input) ? CONFIG[input] : null;

  // iterate values of input, add them to lotivis config
  for (const key in input) {
    if (!Object.hasOwnProperty.call(input, key)) continue;
    if (Object.hasOwnProperty.call(CONFIG, key)) {
      CONFIG[key] = input[key];
      ltv_debug("update config", key, " = ", CONFIG[key]);
    } else {
      ltv_debug("unknown config key", key);
    }
  }
}
