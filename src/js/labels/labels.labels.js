import { Renderer } from "../common/renderer.js";
import { safeId } from "../common/safe.id.js";

export class LabelsLabelsRenderer extends Renderer {
  render(chart, controller, dataView) {
    // let numberFormat = chart.config.numberFormat || LOTIVIS_CONFIG.numberFormat;
    let checkboxSize = "13px";
    let stacks = dataView.stacks;
    let colors = controller.colorGenerator;

    function stackId(stack) {
      return `ltv-legend-stack-id-${safeId(stack)}`;
    }

    function labelId(label) {
      return `ltv-legend-stack-id-${safeId(label)}`;
    }

    function toggle(label) {
      chart.makeUpdateInsensible();
      controller.filters.labels.toggle(label);
      chart.makeUpdateSensible();
    }

    function filter(label) {
      return controller.filters.labels.contains(label);
    }

    let stackDivs = chart.div
      .selectAll(".div")
      .data(stacks)
      .enter()
      .append("div")
      .attr("id", (s) => stackId(s))
      .style("display", "block");

    let divs = stackDivs
      .selectAll(".div")
      .data((d) => dataView.byStackLabel.get(d))
      .enter()
      .append("div")
      .style("display", "inline-block")
      .style("margin-right", "10px")
      .style("color", (d) => colors.label(d[0]));

    let checkboxes = divs
      .append("input")
      .attr("type", "checkbox")
      .attr("checked", (d) => (filter(d[0]) ? null : true))
      .attr("id", (d) => labelId(d[0]))
      .attr("name", (d) => labelId(d[0]))
      .style("width", checkboxSize)
      .style("height", checkboxSize)
      .on("change", (e, d) => toggle(d[0]));

    let labelsOfCheckboxes = divs
      .append("label")
      .style("margin-left", "5px")
      .attr("for", (d) => labelId(d[0]))
      .text((d) => "" + d[0]);
  }
}
