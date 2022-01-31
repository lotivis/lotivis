import * as d3 from "d3";
import { baseChart } from "./chart";
import { LOTIVIS_CONFIG } from "./common/config";
import { uniqueId } from "./common/identifiers";

export const LABEL_FORMAT = function (l, v, i) {
  return `${l} (${v})`;
};

export const STACK_FORMAT = function (s, v, ls, i) {
  return `${s}`;
};

export const GROUP_TITLE_FORMAT = function (s, v, ls, i) {
  return `${i + 1}) ${s} (Sum: ${v})`;
};

// export const GROUP_TITLE_FORMAT = function (s, v, ls, i) {
//   return `${i}) ${s} (Labels: ${ls.length}, Sum: ${v})`;
// };

export function legend() {
  let state = {
    // the id of the legend
    id: uniqueId("legend"),

    // margin
    marginLeft: 0,
    marginTop: 10,
    marginRight: 0,
    marginBottom: 20,

    // whether the legend is enabled
    enabled: true,

    // the number formatter vor values displayed
    numberFormat: LOTIVIS_CONFIG.numberFormat,

    // the format of displaying a datasets label
    labelFormat: LABEL_FORMAT,

    // the format of displaying a datasets stack
    stackFormat: STACK_FORMAT,

    // the format of displaying a group
    groupFormat: GROUP_TITLE_FORMAT,

    // (optional) title of the legend
    title: "Legend",

    // whether to display stacks instead of labels
    stacks: false,

    // whether group the legend (by stacks)
    group: false,

    // the data controller
    dataController: null,
  };

  var chart = baseChart(state);

  /**
   * Toggles the filtered state of the passed label.
   *
   * @param {Event} event The event of the checkbox
   * @param {String} label The label to be toggled
   * @private
   */
  function toggleLabel(event, label) {
    var fn = event.target.checked
      ? state.dataController.removeLabelFilter
      : state.dataController.addLabelFilter;
    fn.call(state.dataController, label, chart);
  }

  /**
   * Toggles the filtered state of the passed stack.
   *
   * @param {Event} event The event of the checkbox
   * @param {String} stack The stack to be toggled
   * @private
   */
  function toggleStack(event, stack) {
    var fn = event.target.checked
      ? state.dataController.removeStackFilter
      : state.dataController.addStackFilter;
    fn.call(state.dataController, stack, chart);
  }

  /**
   * Returns the value for the "checked" attribute dependant on whether
   * given label is filtered by the data controller.
   *
   * @param {*} label The label to be checked
   * @returns {null | boolean}
   * @private
   */
  function labelChecked(label) {
    return state.dataController.isFilterLabel(label) ? null : true;
  }

  /**
   * Returns the value for the "checked" attribute dependant on whether
   * given stack is filtered by the data controller.
   *
   * @param {*} stack The stack to be checked
   * @returns {null | boolean}
   * @private
   */
  function stackChecked(stack) {
    return state.dataController.isFilterStack(stack) ? null : true;
  }

  /**
   * Formattes the given number.
   *
   * @param {Number} value The number to be formatted
   * @returns The formatted value
   * @private
   */
  function format(value) {
    return state.numberFormat(value);
  }

  /**
   *
   * @param {*} label
   * @param {*} index
   * @param {*} dv
   * @returns
   */
  function labelText(label, index, dv) {
    if (typeof state.labelFormat !== "function") return label;
    return state.labelFormat(label, format(dv.byLabel.get(label)), index);
  }

  function stackText(stack, index, dv) {
    if (typeof state.stackFormat !== "function") return stack;
    var value = format(dv.byStack.get(stack));
    var labelsToValue = dv.byStackLabel.get(stack);
    var labels = Array.from(labelsToValue ? labelsToValue.keys() : []);
    return state.stackFormat(stack, value, labels, index);
  }

  function colorGenerator() {
    return state.dataController.colorGenerator();
  }

  function disabled() {
    return unwrap(state.enabled) ? null : true;
  }

  function isGroups() {
    return unwrap(state.group) === true;
  }

  function isStacks() {
    return unwrap(state.stacks) === true;
  }

  function unwrap(value) {
    return typeof value === "function" ? value(chart) : value;
  }

  d3.selection.prototype.div = function (aClass) {
    return this.append("div").classed(aClass, true);
  };

  d3.selection.prototype.error = function (text) {
    return this.append("div").text(text);
  };

  /**
   * Calculates the data view for the bar chart.
   *
   * @param {*} calc The calc object
   * @returns The generated data view
   *
   * @public
   */
  chart.dataView = function (dc) {
    var dv = {};
    dv.labels = dc.labels();
    dv.stacks = dc.stacks();
    dv.locations = dc.locations();
    dv.dates = dc.dates();

    dv.byLabel = d3.rollup(
      dc.data,
      (v) => d3.sum(v, (d) => d.value),
      (d) => d.label
    );

    dv.byStack = d3.rollup(
      dc.data,
      (v) => d3.sum(v, (d) => d.value),
      (d) => d.stack || d.label
    );

    dv.byStackLabel = d3.rollup(
      dc.data,
      (v) => d3.sum(v, (d) => d.value),
      (d) => d.stack || d.label,
      (d) => d.label
    );

    return dv;
  };

  /**
   * Renders all components of the plot chart.
   *
   * @param {*} container The d3 container
   * @param {*} calc The calc objct of the chart
   * @param {*} dv The data view
   * @returns The chart itself
   *
   * @public
   */
  chart.render = function (container, calc, dv) {
    calc.div = container
      .div("ltv-legend")
      .attr("id", state.id)
      .style("padding-left", state.marginLeft + "px")
      .style("padding-top", state.marginTop + "px")
      .style("padding-right", state.marginRight + "px")
      .style("padding-bottom", state.marginBottom + "px");

    // if a title is given render div with title inside
    if (state.title) {
      calc.titleDiv = calc.div
        .append("div")
        .classed("ltv-legend-title", true)
        .text(unwrap(state.title));
    }

    var colorFn = isStacks() ? colorGenerator().stack : colorGenerator().label;
    var changeFn = isStacks() ? toggleStack : toggleLabel;
    var textFn = isStacks() ? stackText : labelText;

    calc.groups = calc.div
      .selectAll(".div")
      .data(isGroups() ? dv.stacks : [""]) // use single group when mode is not "groups"
      .enter()
      .div("ltv-legend-group")
      .style("color", (s) => colorGenerator().stack(s));

    // draw titles only in "groups" mode
    if (isGroups()) {
      calc.titles = calc.groups.append("div").text((stack, index) => {
        var labelsToValue = dv.byStackLabel.get(stack);
        return state.groupFormat(
          stack,
          format(dv.byStack.get(stack)),
          Array.from(labelsToValue ? labelsToValue.keys() : []),
          index
        );
      });
    }

    var pillsData = isGroups()
      ? (d) => (isStacks() ? [d] : dv.byStackLabel.get(d))
      : isStacks()
      ? dv.stacks
      : dv.labels;

    calc.pills = calc.groups
      .selectAll(".label")
      .data(pillsData)
      .enter()
      .append("label")
      .classed("ltv-legend-pill", true)
      .datum((d) => (isGroups() && !isStacks() ? d[0] : d));

    calc.checkboxes = calc.pills
      .append("input")
      .classed("ltv-legend-checkbox", true)
      .attr("type", "checkbox")
      .attr("checked", isStacks() ? stackChecked : labelChecked)
      .attr("disabled", disabled())
      .on("change", (e, d) => changeFn(e, d));

    calc.spans = calc.pills
      .append("span")
      .classed("ltv-legend-pill-span", true)
      .style("background-color", colorFn)
      .text((d, i) => textFn(d, i, dv));

    if (LOTIVIS_CONFIG.debug && state.debug) console.log(this);

    return chart;
  };

  // Return generated chart
  return chart;
}
