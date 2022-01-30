import * as d3 from "d3";
import { ltv_chart } from "./common/lotivis.chart";
import { LOTIVIS_CONFIG } from "./common/config";
import { uniqueId } from "./common/create.id";
import "./common/d3selection.js";

export const LABEL_FORMAT = function (l, v, i) {
  return `${l} (${v})`;
};

export const STACK_FORMAT = function (s, v, ls, i) {
  return `${s} (Labels: ${ls.length}, Sum: ${v})`;
};

export function legend() {
  var chart = ltv_chart({
    ltvId: uniqueId("legend"),
    marginLeft: 0,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    selectable: true,
    numberFormat: LOTIVIS_CONFIG.numberFormat,
    labelFormat: LABEL_FORMAT,
    stackFormat: STACK_FORMAT,
    title: null,
    stacks: false,
    group: false,
    dataController: null,
  });

  chart.prepare = function () {
    // console.log("prepare", this);
    var dc = this.dataController();
    if (!dc) return console.log("[ltv]  no data controller"), this;

    var calc = {};
    calc.labels = dc.labels();
    calc.stacks = dc.stacks();
    calc.locations = dc.locations();
    calc.dates = dc.dates();

    calc.byLabel = d3.rollup(
      dc.data,
      (v) => d3.sum(v, (d) => d.value),
      (d) => d.label
    );

    calc.byStack = d3.rollup(
      dc.data,
      (v) => d3.sum(v, (d) => d.value),
      (d) => d.stack || d.label
    );

    calc.byStackLabel = d3.rollup(
      dc.data,
      (v) => d3.sum(v, (d) => d.value),
      (d) => d.stack || d.label,
      (d) => d.label
    );

    return this.state({ calc });
  };

  chart.update = function (container) {
    var { selectable, nodes, stacks } = chart.state();
    if (!nodes || !nodes.checkboxes)
      return console.log("[ltv]  no components found"), this;
    var dc = chart.dataController();
    if (!dc) return console.log("[ltv]  no dataController found"), this;
    var filter = (stacks ? dc.isFilterStack : dc.isFilterLabel).bind(dc);

    container
      .selectAll(".ltv-legend-checkbox")
      .disabled(!selectable)
      .attr("checked", (d) => (filter(d) ? null : true));

    container.selectAll(".ltv-legend-span").disabled(!selectable);
  };

  chart.render = function (container) {
    var nodes = {},
      {
        marginLeft,
        marginTop,
        marginRight,
        marginBottom,
        calc,
        selectable,
        labelFormat,
        stackFormat,
        numberFormat,
        title,
        ltvId,
        stacks,
        group,
      } = this.state();

    var div = container
      .append("div")
      .classed("ltv-legend", true)
      .attr("id", ltvId)
      .style("padding-left", marginLeft + "px")
      .style("padding-top", marginTop + "px")
      .style("padding-right", marginRight + "px")
      .style("padding-bottom", marginBottom + "px");

    nodes.titleDiv = div
      .append("div")
      .classed("ltv-legend-title", true)
      .text(title);

    this.state({ div });

    var dataController = this.dataController();
    if (!dataController)
      return LOTIVIS_CONFIG.debug
        ? (console.log("[ltv]  no data controller"), this)
        : this;

    var colors = dataController.colorGenerator();

    function toggleLabel(event, label) {
      var fn = event.target.checked
        ? dataController.removeLabelFilter
        : dataController.addLabelFilter;
      fn.call(dataController, label, chart);
    }

    function toggleStack(event, stack) {
      var fn = event.target.checked
        ? dataController.removeStackFilter
        : dataController.addStackFilter;
      fn.call(dataController, stack, chart);
    }

    function labelChecked(label) {
      return dataController.isFilterLabel(label) ? null : true;
    }

    function stackChecked(stack) {
      return dataController.isFilterStack(stack) ? null : true;
    }

    function labelText(label, index) {
      return labelFormat(label, numberFormat(calc.byLabel.get(label)), index);
    }

    function stackText(stack, index) {
      var value = numberFormat(calc.byStack.get(stack));
      var labelsToValue = calc.byStackLabel.get(stack);
      var labels = Array.from(labelsToValue ? labelsToValue.keys() : []);
      return stackFormat(stack, value, labels, index);
    }

    if (group) {
      var groups = calc.stacks;
      var pills = (d) => (stacks ? [d] : calc.byStackLabel.get(d));
    } else {
      var groups = [""];
      var pills = stacks ? calc.stacks : calc.labels;
    }

    var color = stacks ? colors.stack : colors.label;
    var checked = stacks ? stackChecked : labelChecked;
    var change = stacks ? toggleStack : toggleLabel;
    var text = stacks ? stackText : labelText;

    nodes.groups = div
      .bindData(groups, "div")
      .attr("class", "ltv-legend-group")
      .style("color", (s) => colors.stack(s));

    nodes.titles = nodes.groups.append("div").text(group ? stackText : null);

    nodes.pills = nodes.groups
      .bindData(pills, "label")
      .datum((d) => (group && !stacks ? d[0] : d))
      .attr("class", "ltv-legend-pill");

    nodes.checkboxes = nodes.pills
      .append("input")
      .attr("type", "checkbox")
      .attr("class", "ltv-legend-checkbox")
      .attr("checked", (d) => checked(d))
      .disabled(!selectable)
      .on("change", (e, d) => change(e, d));

    nodes.spans = nodes.pills
      .element({ tag: "span", class: "ltv-legend-pill-span" })
      .style("background-color", (d) => color(d))
      .text(text);

    if (LOTIVIS_CONFIG.debug) console.log(this);

    return this.state({ div, nodes });
  };

  // Return generated chart
  return chart;
}
