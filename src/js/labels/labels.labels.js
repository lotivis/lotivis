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
      .attr("checked", (d) => controller.filters.labels.contains(d[0]))
      .attr("id", (d) => labelId(d[0]))
      .attr("name", (d) => labelId(d[0]))
      .on("change", (event, d) => {
        let label = d[0];
        console.log("label", label);
        chart.makeUpdateInsensible();
        controller.filters.labels.toggle(label);
        chart.makeUpdateSensible();
      });

    let labelsOfCheckboxes = divs
      .append("label")
      .style("margin-left", "5px")
      .attr("for", (d) => labelId(d[0]))
      .text((d) => "" + d[0]);
  }
}
