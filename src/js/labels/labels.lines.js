import { LOTIVIS_CONFIG } from "../common/config.js";
import { LABELS_CHART_STYLE } from "./labels.chart.config.js";
import { Renderer } from "../common/renderer.js";
import { safeId } from "../common/safe.id.js";

export class LabelsGroupedRenderer extends Renderer {
  render(chart, controller, dataView) {
    if (chart.config.style !== LABELS_CHART_STYLE.grouped) return;

    let numberFormat = chart.config.numberFormat || LOTIVIS_CONFIG.numberFormat;
    let stacks = dataView.stacks;
    let colors = controller.colorGenerator;
    let config = chart.config;

    function toggle(label) {
      chart.makeUpdateInsensible();
      controller.filters.labels.toggle(label);
      chart.makeUpdateSensible();
    }

    function filter(label) {
      return controller.filters.labels.contains(label);
    }

    // <label class="ltv-pill-checkbox">
    //   <input type="checkbox" id="ltv-legend-stack-id-{{LABEL}}"></input>
    //   <span class="ltv-pill-checkbox-span">
    //     {{LABEL}}
    //   </span>
    // </label>

    chart.div
      .style("padding-left", config.margin.left + "px")
      .style("padding-top", config.margin.top + "px")
      .style("padding-right", config.margin.right + "px")
      .style("padding-bottom", config.margin.bottom + "px");

    let stackContainers = chart.div
      .selectAll(".div")
      .data(stacks)
      .enter()
      .append("div")
      .attr("id", (s) => `ltv-legend-stack-id-${safeId(s)}`)
      .attr("class", "ltv-stack-labels-container")
      .style("display", "inline-block")
      .style("color", (s) => colors.stack(s))
      .html((d, i) => (config.headlines ? "Stack " + (i + 1) + "<br/>" : null));

    let labelContainers = stackContainers
      .selectAll(".label")
      .data((d) => dataView.byStackLabel.get(d))
      .enter()
      .append("label")
      .attr("class", "ltv-pill-checkbox");

    let checkboxes = labelContainers
      .append("input")
      .attr("type", "checkbox")
      .attr("checked", (d) => (filter(d[0]) ? null : true))
      .attr("id", (d) => `ltv-legend-stack-id-${safeId(d[0])}`)
      .on("change", (e, d) => toggle(d[0]));

    let spans = labelContainers
      .append("span")
      .attr("class", "ltv-pill-checkbox-span")
      .style("background-color", (d) => colors.label(d[0]))
      .text(
        (d) => "" + d[0] + " (" + numberFormat(dataView.byLabel.get(d[0])) + ")"
      );
  }
}
