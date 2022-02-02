import { CONFIG } from "./common/config";
import { downloadBlob } from "./common/download.js";
import { isString, isNumber, isFunction } from "./common/values";
import { postfix } from "./common/affix.js";
import { uniqueId } from "./common/identifiers";
import { csvRender } from "./parse/parse.csv.js";
import { baseChart } from "./chart";
import { ltv_debug } from "./common/debug";

const DATATEXT_TITLE = function (chart, dv) {
  return "Data";
};

const JSON_TEXT = function (chart, dv) {
  return JSON.stringify(dv.data, null, 2);
};

const JSON_TEXT_DATA_VIEW = function (chart, dv) {
  return JSON.stringify(dv, null, 2);
};

const CSV_TEXT = function (chart, dv) {
  return csvRender(dv.data);
};

export function datatext() {
  let text;
  let state = {
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
    title: DATATEXT_TITLE,

    // the text to display for the data
    text: JSON_TEXT_DATA_VIEW,

    // the data controller
    dataController: null,
  };

  // expose state
  let chart = baseChart(state);

  // private

  function inCodeTags(value) {
    return '<code class="ltv-datatext-code">' + value + "</code>";
  }

  function html(text) {
    return text.split("\n").map(inCodeTags).join("");
  }

  function unwrap(value, ...args) {
    return typeof value === "function" ? value(...args) : value;
  }

  // public

  /**
   * Initiates a download of the displayed text.
   *
   * @returns this The chart itself
   * @public
   */
  chart.download = function () {
    let type;

    if (state.text === CSV_TEXT) {
      type = "text/csv";
    } else if (state.text === JSON_TEXT || state.text === JSON_TEXT_DATA_VIEW) {
      type = "text/json";
    } else {
      type = "text/text";
    }

    let blob = new Blob([text], { type: type });
    let filename = state.dataController.filename(state.text, "datatext");
    downloadBlob(blob, filename);
    return chart;
  };

  /**
   * Calculates and returns the data view for the datatext.
   * @param {*} dc The data controller
   * @returns dv The generated data view
   * @public
   */
  chart.dataView = function (dc) {
    let dv = {};

    dv.data = dc.data();
    dv.labels = dc.labels();
    dv.stacks = dc.stacks();
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
      .attr("id", state.id)
      .style("padding-left", state.marginLeft + "px")
      .style("padding-top", state.marginTop + "px")
      .style("padding-right", state.marginRight + "px")
      .style("padding-bottom", state.marginBottom + "px");

    if (state.title) {
      calc.title = calc.div
        .append("div")
        .classed("ltv-datatext-title", true)
        .text(unwrap(state.title, chart, dv))
        .style("cursor", state.enabled ? "pointer" : null)
        .on("click", state.enabled ? chart.download : null);
    }

    text = unwrap(state.text, chart, dv);
    calc.pre = calc.div
      .append("pre")
      .classed("ltv-datatext-pre", true)
      .html(html(text));

    if (isString(state.height) || isNumber(state.height)) {
      calc.pre
        .style("height", postfix(state.height, "px"))
        .style("overflow", "scroll");
    }

    return chart;
  };

  // ltv_debug("datatext", chart.id());

  // return generated chart
  return chart;
}
