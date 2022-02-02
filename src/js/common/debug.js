import { datatext } from "../datatext";
import { config, CONFIG } from "./config";

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

export function data_preview(dc) {
    if (!dc || !CONFIG.debug || !runsInBrowser()) return;
    if (!document.getElementById("ltv-data")) return;
    if (!CONFIG.datatext) CONFIG.datatext = datatext().selector("#ltv-data");
    CONFIG.datatext.dataController(dc).run();
}
