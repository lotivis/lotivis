import { Renderer } from "../common/renderer.js";
import { safeId } from "../common/safe.id.js";

export class LabelsLabelsRenderer extends Renderer {
  render(chart, controller, dataView) {
    // let numberFormat = chart.config.numberFormat || LOTIVIS_CONFIG.numberFormat;
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
      .attr("class", "ltv-stack-labels-container")
      .style("color", (s) => colors.stack(s))
      .html((d, i) => "Stack " + (i + 1) + "<br/>");

    let divs = stackDivs
      .selectAll(".label")
      .data((d) => dataView.byStackLabel.get(d))
      .enter()
      .append("label")
      .attr("class", "ltv-pill-checkbox");

    let checkboxes = divs
      .append("input")
      .attr("type", "checkbox")
      .attr("checked", (d) => (filter(d[0]) ? null : true))
      .attr("id", (d) => labelId(d[0]))
      .on("change", (e, d) => toggle(d[0]));

    let spans = divs
      .append("span")
      .attr("class", "ltv-pill-checkbox-span")
      .style("background-color", (d) => colors.label(d[0]))
      .text((d) => "" + d[0] + "(" + dataView.byLabel.get(d[0]) + ")");

    // let labelsOfCheckboxes = divs
    //   .append("label")
    //   .style("margin-left", "5px")
    //   .attr("for", (d) => labelId(d[0]))
    //   .text((d) => "" + d[0]);
  }
}
