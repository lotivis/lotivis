import { GERMAN_NUMBER_FORMAT } from "./formats.js";

/**
 * lotivis wide configuration
 */
export const CONFIG = {
    /**
     * A Boolean value indicating whether the debug logging is enabled
     */
    debug: false,

    /**
     * The default margin to use for charts
     */
    defaultMargin: 60,

    /**
     * The default offset for the space between an object an the toolbar
     */
    tooltipOffset: 7,

    /**
     *  The default radius to use for bars drawn on a chart
     */
    barRadius: 0,

    /**
     * The opacity to use for selection.
     */
    selectionOpacity: 0.1,

    /**
     * A string which is used as prefix for download.
     */
    downloadFilePrefix: "ltv",

    /**
     * A string which is used as separator between components when creating a file name.
     */
    filenameSeparator: "-",

    /**
     * The default number formatter used by all charts.
     */
    numberFormat: GERMAN_NUMBER_FORMAT,

    /**
     * The default id for a container displying the current url
     */
    debugURLDivId: "DEBUG-ltv-url-DEBUG",

    /**
     *
     */
    debugDataDivId: "DEBUG-ltv-data-DEBUG",

    /**
     * The deault filename generator.
     */
    // filenameGenerator: DEFAULTS.filenameGenerator,

    /** A Boolean value indicating whether logging of third party libraries is enabled */
    thidPartyLogging: false,
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

export function runsInBrowser() {
    return !(typeof document === "undefined");
}

/**
 * Gets or sets whethter lotivis is in debug mode.
 * @param {Boolean} enabled Enable debug logging
 */
export function ltv_debug(...args) {
    if (!arguments.length) return CONFIG.debug;

    if (arguments.length === 1 && typeof args[0] === "boolean") {
        config({ debug: args[0] });
    } else if (CONFIG.debug) {
        console.log("[ltv] ", ...args);
    }
}
