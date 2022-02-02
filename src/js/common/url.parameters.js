import * as d3 from "d3";
import { CONFIG } from "./config";
import { ltv_debug } from "./debug";

function inBrowser() {
    return typeof window !== "undefined";
}

function base64encode(obj) {
    return obj === null
        ? null
        : btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
}

function base64decode(b64) {
    if (!inBrowser()) return null;
    try {
        return JSON.parse(decodeURIComponent(escape(window.atob(b64))));
    } catch (error) {
        ltv_debug(error);
        return null;
    }
}

export class URLParams {
    static locationURL() {
        return inBrowser() ? new URL(window.location.href) : null;
    }

    static set(key, value) {
        if (!inBrowser()) return;
        const url = URLParams.locationURL();

        value === null
            ? url.searchParams.delete(key)
            : url.searchParams.set(key, value);

        this.updateHistory(url);
    }

    static get(key) {
        return inBrowser()
            ? URLParams.locationURL().searchParams.get(key)
            : null;
    }

    static boolean(key) {
        return this.get(key) === "true";
    }

    static object(key, value) {
        return arguments.length === 1
            ? base64decode(this.get(key))
            : this.set(key, base64encode(value));
    }

    static exists(key) {
        return this.get(key) !== null;
    }

    static documentTitle() {
        return inBrowser() ? document.title : "";
    }

    static updateHistory(url) {
        if (!inBrowser()) return;
        window.history.replaceState(null, this.documentTitle(), url);
        this.updateURLContainer(url);
    }

    static updateURLContainer(url) {
        if (!inBrowser()) return;

        if (!URLParams.conainer)
            URLParams.conainer = d3
                .select("#" + CONFIG.debugURLDivId)
                .classed("ltv-url", true);

        URLParams.conainer.text(url || URLParams.locationURL());
    }
}

// run update of container presenting the URL once
URLParams.updateURLContainer();
