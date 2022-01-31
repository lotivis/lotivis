import { append, download, LOTIVIS_CONFIG } from "./common/config";
import { isString, isNumber, isFunction } from "./common/values";
import { uniqueId } from "./common/identifiers";
import { csvRender } from "./parse/parse.csv.js";
import { baseChart } from "./chart";

export function datatext() {
  let text;
  let state = {
    // the id of the data preview
    id: uniqueId("datatext"),

    // max height
    height: 800,

    // margin
    marginLeft: 10,
    marginTop: 5,
    marginRight: 10,
    marginBottom: 5,

    // whether the datatext is enabled
    enabled: true,

    // (optional) title of the datatext
    title: (chart) => "Data",

    // the border style of the datatext
    border: "solid 1px lightgray",

    // the content type, "json", "csv" or a custom function
    content: "csv",

    // the data controller
    dataController: null,
  };

  // expose state
  let chart = baseChart(state);

  // private

  function dataText(data) {
    switch (state.content) {
      case "json":
        return JSON.stringify(data, null, 2);
      case "csv":
        return csvRender(data);
      default:
        return isFunction(state.content)
          ? state.content(data, this, state.dataController)
          : "Unknown content type: ";
    }
  }

  function inCodeTags(value) {
    return '<code class="ltv-datatext-code">' + value + "</code>";
  }

  function html(text) {
    return text.split("\n").map(inCodeTags).join("");
  }

  function unwrap(value) {
    return typeof value === "function" ? value(chart) : value;
  }

  // public

  /**
   * Initiates a download of the content.
   *
   * @returns this The chart itself
   * @public
   */
  chart.download = function () {
    let blob = new Blob([text], { type: "text/" + state.content });
    let filename = state.dataController.filename(state.content);
    download(blob, filename);
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

    dv.data = dc.data;
    dv.labels = dc.labels();
    dv.stacks = dc.stacks();
    dv.locations = dc.locations();
    dv.dates = dc.dates();
    dv.text = dataText(dc.data);
    text = dv.text;

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
      .style("border", state.border)
      .style("padding-left", state.marginLeft + "px")
      .style("padding-top", state.marginTop + "px")
      .style("padding-right", state.marginRight + "px")
      .style("padding-bottom", state.marginBottom + "px");

    let title = unwrap(state.title);
    let contentType = isString(state.content)
      ? state.content
      : typeof state.content;

    if (isString(title)) {
      calc.title = calc.div
        .append("div")
        .classed("ltv-datatext-title", true)
        .text(title + " (" + contentType + ")")
        .style("cursor", state.enabled ? "pointer" : null)
        .on("click", state.enabled ? chart.download : null);
    }

    calc.pre = calc.div
      .append("pre")
      .classed("ltv-datatext-pre", true)
      .html(html(dv.text));

    if (isString(state.height) || isNumber(state.height)) {
      calc.pre
        .style("height", append(state.height, "px"))
        .style("overflow", "scroll");
    }

    if (LOTIVIS_CONFIG.debug) {
      calc.footer = calc.div
        .append("div")
        .classed("ltv-datatext-title", true)
        .text(state.dataController.filename());
    }

    return chart;
  };

  // return generated chart
  return chart;
}
