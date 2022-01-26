import * as d3 from "d3";
import { LotivisChart } from "../common/lotivis.chart";
import { LOTIVIS_CONFIG } from "../common/config";
import { safeId } from "../common/safe.id";
import { create_id, genId, uniqueId } from "../common/create.id";
import "../common/d3selection.js";

function debug_log(text) {
  if (LOTIVIS_CONFIG.debug) console.log("[ltv]  " + text);
}

export class Legend extends LotivisChart {
  // Define types of a legend.
  static Type = {
    flowing: "flowing",
    grouped: "grouped",
    stacks: "stacks",
  };

  // (label, value, index) => String
  static LabelFormat = {
    /**
     * Returns a string in the form of "<LABEL> (<VALUE>)".
     *
     * @param {*} l the label
     * @param {*} v the (already formatted) value
     * @param {*} i the index of the label
     *
     * @returns a string
     */
    default: (l, v, i) => `${l} (${v})`,
  };

  // (stack, value, labels, index) => String
  static StackFormat = {
    default: (s, v, ls, i) => `Stack ${i + 1} (${v})`,
    full: (s, v, ls, i) => `${s} (Labels: ${ls.length}, Sum: ${v})`,
  };

  constructor(config) {
    super(
      {
        container: "body",
        selector: "body",
        ltvId: uniqueId("legend"),
        // "flowing" or "grouped"
        style: Legend.Type.flowing, // "flowing",
        marginLeft: 40,
        marginTop: 0,
        marginRight: 40,
        marginBottom: 0,
        selectable: true,
        numberFormat: LOTIVIS_CONFIG.numberFormat,
        labelFormat: Legend.LabelFormat.default,
        stackFormat: Legend.StackFormat.full,
        title: "Legend",
      },

      null
    );

    // private inner states
    // super.state({ div: null, calc: {}, debug: false });
    // this.state({ div: null, calc: {}, debug: false });
  }

  update() {
    var { selectable, style, nodes } = this.state();
    if (!nodes || !nodes.checkboxes || !nodes.spans)
      return console.log("[ltv]  no components found");
    var disabled = selectable ? null : true;
    var dataController = this.dataController();
    var labelOf = style === "grouped" ? (d) => d[0] : (l) => l;
    var filter = (label) => dataController.filters.labels.contains(label);

    nodes.checkboxes
      .attr("disabled", disabled)
      .attr("checked", (d) => (filter(labelOf(d)) ? null : true));

    nodes.spans.attr("disabled", disabled);
  }

  renderContainer(container, chart) {
    var nodes = {};
    var {
      marginLeft,
      marginTop,
      marginRight,
      marginBottom,
      calc,
      selectable,
      style,
      labelFormat,
      stackFormat,
      numberFormat,
      title,
      ltvId,
    } = this.state();

    var div = container
      .element({ tag: "div", class: "ltv-legend", id: ltvId })
      .style("padding-left", marginLeft + "px")
      .style("padding-top", marginTop + "px")
      .style("padding-right", marginRight + "px")
      .style("padding-bottom", marginBottom + "px");

    var titleDiv = div
      .element({ tag: "div", class: "ltv-legend-title" })
      .text(title);

    this.state({ div });

    var dataController = this.dataController();
    if (!dataController) return debug_log("no controller found");

    var colors = dataController.colorGenerator();

    function toggleLabel(label, event) {
      dataController.filters.labels.toggle(label, chart);
    }

    function toggleStack(stack, event) {
      dataController.filters.stacks.toggle(stack, chart);
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

    function stackTitle(stack, index) {
      var value = numberFormat(calc.byStack.get(stack));
      var labels = Array.from(calc.byStackLabel.get(stack).keys());
      return stackFormat(stack, value, labels, index);
    }

    function pills(selection, data) {
      // <label class="ltv-legend-pill">
      //   <input type="checkbox" id="ltv-legend-stack-id-{{LABEL}}"></input>
      //   <span class="ltv-legend-pill-span">
      //     {{LABEL}}
      //   </span>
      // </label>
      return selection
        .bindData(data, "label")
        .attr("class", chart.className("pill"));
    }

    function appendCheckboxes(selection, checked, change) {
      return selection
        .append("input")
        .attr("type", "checkbox")
        .attr("disabled", selectable ? null : true)
        .attr("checked", checked)
        .on("change", change);
    }

    function appendSpans(selection, colorFn, text) {
      return selection
        .element({ tag: "span", class: chart.className("pill-span") })
        .attr("disabled", selectable ? null : true)
        .style("background-color", (d) => colorFn(d))
        .text(text);
    }

    function renderSingle() {
      nodes.pills = pills(div, calc.labels);
      nodes.checkboxes = appendCheckboxes(
        nodes.pills,
        (l) => labelChecked(l),
        (e, l) => toggleLabel(l, e)
      );

      nodes.spans = appendSpans(nodes.pills, colors.label, labelText);
    }

    function renderStacks(div) {
      nodes.pills = pills(div, calc.stacks);
      nodes.checkboxes = appendCheckboxes(
        nodes.pills,
        (s) => stackChecked(s),
        (e, s) => toggleStack(s, e)
      );

      nodes.spans = appendSpans(nodes.pills, colors.stack, stackTitle);
    }

    function renderGrouped(div) {
      nodes.groups = div
        .bindData(calc.stacks, "div")
        .attr("class", chart.className("group"))
        .style("color", (s) => colors.stack(s));

      nodes.titles = nodes.groups.append("div").text(stackTitle);

      var data = (s) => calc.byStackLabel.get(s);
      nodes.pills = pills(nodes.groups, data).datum((d) => d[0]);

      nodes.checkboxes = appendCheckboxes(
        nodes.pills,
        (l) => labelChecked(l),
        (e, l) => toggleLabel(l, e)
      );

      nodes.spans = appendSpans(nodes.pills, colors.label, labelText);
    }

    switch (style) {
      case "grouped":
        renderGrouped(div);
        break;
      case "stacks":
        renderStacks(div);
        break;
      default:
        renderSingle(div);
        break;
    }

    // nodes.pills
    //   .transition()
    //   .duration((_, i) => (animate ? 100 + i * 50 : 0))
    //   .style("opacity", 1);

    if (LOTIVIS_CONFIG.debug) console.log(this);

    return this.state({ div, nodes });
  }

  // Calculate some properties
  prepare(selection) {
    var dc = this.state().dataController || this.dataController();
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
  }

  debug(_) {
    return arguments.length ? this.state({ debug: _ }) : this.state()["debug"];
  }
}
