import { downloadURL } from "./common/download.js";
import { postfix } from "./common/helpers.js";
import { uniqueId } from "./common/identifiers.js";
import { csvFormat } from "./parse/parse.csv.js";
import { baseChart } from "./baseChart.js";
import { config, runsInBrowser } from "./common/config.js";
import { isString } from "./common/values.js";

/**
 * Returns the JSON string from the passed data view's data.
 * @param {datatext} dt The datatext
 * @param {dataview} dv The dataview
 * @returns {string} JSON string from the data view's data.
 */
export const datatextJSONData = function (dt, dv) {
    return JSON.stringify(dv.data, null, 2);
};

/**
 * Returns the JSON string from the passed data view.
 * @param {datatext} dt The datatext
 * @param {dataview} dv The dataview
 * @returns {string} JSON string from the data view.
 */
export const datatextJSON = function (dt, dv) {
    return JSON.stringify(dv, null, 2);
};

/**
 * Returns the CSV string from the passed data view's data.
 * @param {datatext} dt The datatext
 * @param {dataview} dv The dataview
 * @returns CSV string from the data view's data.
 */
export const datatextCSV = function (dt, dv) {
    return csvFormat(dv.data);
};

/**
 *
 * @returns
 */
export function datatext() {
    let text, cachedHTML;
    let attr = {
        // the id of the datatext
        id: uniqueId("datatext"),

        // max height
        height: 800,

        // margin
        marginLeft: 0,
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,

        // whether the datatext is enabled
        enabled: true,

        // (optional) title of the datatext
        title: (dt, dv) => "Data",

        // the text to display for the data
        text: datatextCSV,

        // the data controller
        dataController: null,
    };

    // expose attr
    let chart = baseChart(attr);

    // private

    function isType(obj, ...types) {
        return types.indexOf(typeof obj) !== -1;
    }

    function inCodeTags(value) {
        return '<code class="ltv-datatext-code">' + value + "</code>";
    }

    function html(text) {
        return isType(text, "string")
            ? "" + text.split("\n").map(inCodeTags).join("")
            : "" + text;
    }

    function unwrap(value, ...args) {
        return isType(value, "function") ? value(...args) : value;
    }

    // public

    /**
     * Initiates a download of the displayed text.
     *
     * @returns this The chart itself
     * @public
     */
    chart.download = function () {
        let type, extension;

        if (attr.text === datatextCSV) {
            type = "text/csv";
            extension = "csv";
        } else if (
            attr.text === datatextJSONData ||
            attr.text === datatextJSON
        ) {
            type = "text/json";
            extension = "json";
        } else {
            type = "text/text";
            extension = "txt";
        }

        let blob = new Blob([text], { type: type }),
            objectURL = URL.createObjectURL(blob),
            filename = attr.dataController.filename(extension, "datatext");

        downloadURL(objectURL, filename);

        return chart;
    };

    /**
     * Calculates and returns the data view for the datatext.
     * @returns dv The generated data view
     * @public
     */
    chart.dataView = function () {
        let dc = attr.dataController;
        if (!dc) throw new Error("no data controller");

        let dv = {};

        dv.data = dc.data();
        dv.labels = dc.labels();
        dv.groups = dc.groups();
        dv.locations = dc.locations();
        dv.dates = dc.dates();

        return dv;
    };

    /**
     *
     * @param {*} container The container
     * @param {*} calc The calc obj
     * @param {*} dv The data view
     * @returns this The chart itself
     * @public
     */
    chart.render = function (container, calc, dv) {
        calc.div = container
            .append("div")
            .classed("ltv-datatext", true)
            .attr("id", attr.id)
            .style("padding-left", attr.marginLeft + "px")
            .style("padding-top", attr.marginTop + "px")
            .style("padding-right", attr.marginRight + "px")
            .style("padding-bottom", attr.marginBottom + "px");

        if (attr.title) {
            calc.title = calc.div
                .append("div")
                .classed("ltv-datatext-title", true)
                .text(unwrap(attr.title, chart, dv))
                .style("cursor", attr.enabled ? "pointer" : null)
                .on("click", attr.enabled ? chart.download : null);
        }

        if (!cachedHTML) {
            text = unwrap(attr.text, chart, dv, attr.dataController);
            cachedHTML = html(text);
        }

        calc.pre = calc.div
            .append("pre")
            .classed("ltv-datatext-pre", true)
            .html(cachedHTML);

        if (isType(attr.height, "string", "number")) {
            calc.pre
                .style("height", postfix(attr.height, "px"))
                .style("overflow", "scroll");
        }

        return chart;
    };

    // ltv_debug("datatext", chart.id());

    // return generated chart
    return chart;
}

export function data_preview(dc) {
    if (!dc || !config.debug || !runsInBrowser()) return;
    if (!document.getElementById("ltv-data")) return;
    if (!config.datatext) config.datatext = datatext().selector("#ltv-data");
    config.datatext.dataController(dc).run();
}
