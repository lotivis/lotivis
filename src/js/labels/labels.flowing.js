import { LOTIVIS_CONFIG } from "../common/config.js";
import { LABELS_CHART_STYLE } from "./labels.chart.config.js";
import { Renderer } from "../common/renderer.js";
import { safeId } from "../common/safe.id.js";

export class LabelsFlowingRenderer extends Renderer {
  render(chart, controller, dataView) {
    if (chart.config.style !== LABELS_CHART_STYLE.flowing) return;

    console.log("chart.config.style", chart.config.style);

    let numberFormat = chart.config.numberFormat || LOTIVIS_CONFIG.numberFormat;
    let stacks = dataView.stacks;
    let labels = dataView.labels;
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

    let labelContainers = chart.div
      .selectAll(".label")
      .data(labels)
      .enter()
      .append("label")
      .attr("class", "ltv-pill-checkbox");

    let checkboxes = labelContainers
      .append("input")
      .attr("type", "checkbox")
      .attr("checked", (l) => (filter(l) ? null : true))
      .attr("id", (l) => `ltv-legend-label-id-${safeId(l)}`)
      .on("change", (e, l) => toggle(l));

    let spans = labelContainers
      .append("span")
      .attr("class", "ltv-pill-checkbox-span")
      .style("background-color", (l) => colors.label(l))
      .text((l) => "" + l + " (" + numberFormat(dataView.byLabel.get(l)) + ")");
  }
}
