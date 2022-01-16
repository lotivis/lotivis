import { LOTIVIS_CONFIG } from "../common/config";
import { Renderer } from "../common/renderer";

export class PlotTooltipRenderer extends Renderer {
  render(chart, controller) {
    chart.element.select(".ltv-tooltip").remove();
    const tooltip = chart.element
      .append("div")
      .attr("class", "ltv-tooltip")
      .attr("rx", 5) // corner radius
      .attr("ry", 5)
      .style("opacity", 0);

    function getHTMLContentForDataset(dataset) {
      // console.log("dataset", dataset);

      let components = [];

      let sum = dataset.data
        .map((item) => item.value)
        .reduce((acc, next) => +acc + +next, 0);
      let formatted = chart.config.numberFormat.format(sum);

      components.push("Label: " + dataset.label);
      components.push("");
      components.push("Start: " + dataset.firstDate);
      components.push("End: " + dataset.lastDate);
      components.push("");
      components.push("Items: " + formatted);
      components.push("");

      let filtered = dataset.data.filter((item) => item.value !== 0);
      for (let index = 0; index < filtered.length; index++) {
        let entry = filtered[index];
        let formatted = chart.config.numberFormat.format(entry.value);
        components.push(`${entry.date}: ${formatted}`);
      }

      return components.join("<br/>");
    }

    function getTooltipLeftForDataset(dataset, factor, offset) {
      let left = chart.xChart(dataset.firstDate);
      left *= factor;
      left += offset[0];
      return left;
    }

    function showTooltip(event, dataset) {
      if (!chart.config.showTooltip) return;
      tooltip.html(getHTMLContentForDataset(dataset));

      // position tooltip
      let tooltipHeight = Number(tooltip.style("height").replace("px", ""));
      let factor = chart.getElementEffectiveSize()[0] / chart.config.width;
      let offset = chart.getElementPosition();

      let top = chart.yChart(dataset.label) * factor;
      top += offset[1];

      if (
        chart.yChart(dataset.label) - chart.config.margin.top <=
        chart.graphHeight / 2
      ) {
        top += chart.config.lineHeight * factor + LOTIVIS_CONFIG.tooltipOffset;
      } else {
        top -= tooltipHeight + 20; // subtract padding
        top -= LOTIVIS_CONFIG.tooltipOffset;
      }

      let left = getTooltipLeftForDataset(dataset, factor, offset);

      tooltip
        .style("left", left + "px")
        .style("top", top + "px")
        .style("opacity", 1);
    }

    function hideTooltip() {
      let controller = chart.controller;
      let filters = controller.datasetFilters;

      if (filters && filters.length !== 0) {
        controller.resetFilters();
      }

      if (+tooltip.style("opacity") === 0) return;
      tooltip.style("opacity", 0);
    }

    chart.on("mouseenter", showTooltip);
    chart.on("mouseout", hideTooltip);
  }
}
