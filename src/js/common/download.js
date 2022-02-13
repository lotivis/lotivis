import * as d3 from "d3";
import { ltv_debug, runsInBrowser } from "./config";

export function element(selector) {
    var el = d3.select(selector).node();
    if (!el) throw new Error("no element for selector: " + selector);
    return el;
}

export function downloadURL(url, fname) {
    let a = document.createElement("a");
    a.href = url;
    a.download = fname;
    a.click();
}

export function downloadBlob(blob, fname) {
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, fname);
    } else {
        downloadURL(URL.createObjectURL(blob), fname);
    }
}

export function pngDownload(selector, filename, callback) {
    html2canvas(element(selector), { scale: 4 }).then((canvas) => {
        downloadURL(canvas.toDataURL(), filename);
        if (callback) callback();
    });
}

// dynamically load html2canvas
(function loadHTML2Canvas(comletion = () => null) {
    if (!runsInBrowser()) return ltv_debug("not running in browser");
    if (typeof html2canvas !== "undefined") return;
    var script = document.createElement("script");
    script.onload = comletion;
    script.src = "https://html2canvas.hertzen.com/dist/html2canvas.js";
    document.head.appendChild(script);
})();
