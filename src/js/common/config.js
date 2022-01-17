export const DEFAULT_NUMBER_FORMAT = new Intl.NumberFormat("en-EN", {
  maximumFractionDigits: 3,
});

export const GERMAN_NUMBER_FORMAT = new Intl.NumberFormat("de-DE", {
  maximumFractionDigits: 3,
});

export var LOTIVIS_CONFIG = {
  // The default margin to use for charts.
  defaultMargin: 60,
  // The default offset for the space between an object an the toolbar.
  tooltipOffset: 7,
  // The default radius to use for bars drawn on a chart.
  barRadius: 5,
  // A Boolean value indicating whether the debug logging is enabled.
  debugLog: false,
  // A Boolean value indicating whether the debug logging is enabled.
  debug: true,
  // A string which is used as prefix for download.
  downloadFilePrefix: "lotivis",
  // A string which is used as separator between components when creating a file name.
  filenameSeparator: "_",
  // A string which is used for unknown values.
  unknown: "LOTIVIS_UNKNOWN",
  // The default number formatter used by all charts.
  numberFormat: GERMAN_NUMBER_FORMAT.format,
};

export const DEFAULT_MARGIN = {
  top: LOTIVIS_CONFIG.defaultMargin,
  right: LOTIVIS_CONFIG.defaultMargin,
  bottom: LOTIVIS_CONFIG.defaultMargin,
  left: LOTIVIS_CONFIG.defaultMargin,
};
