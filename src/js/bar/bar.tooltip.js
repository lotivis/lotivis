import { LOTIVIS_CONFIG } from "../common/config";
import { Renderer } from "../common/renderer";

export class BarTooltipRenderer extends Renderer {
  render(chart, controller, dataView) {
    let numberFormat = chart.config.numberFormat || LOTIVIS_CONFIG.numberFormat;

    chart.element.select(".ltv-tooltip").remove();
    const tooltip = chart.element
      .append("div")
      .attr("class", "ltv-tooltip")
      .attr("rx", 5) // corner radius
      .attr("ry", 5)
      .style("opacity", 0);

    function getTooltipSize() {
      let tooltipWidth = Number(tooltip.style("width").replace("px", ""));
      let tooltipHeight = Number(tooltip.style("height").replace("px", ""));
      return [tooltipWidth, tooltipHeight];
    }

    function getTop(factor, offset, tooltipSize) {
      let top = chart.config.margin.top * factor;
      top += (chart.graphHeight * factor - tooltipSize[1]) / 2;
      top += offset[1] - 10;
      return top;
    }

    function getXLeft(date, factor, offset, tooltipSize) {
      let x = chart.xChartScalePadding(date) * factor;
      return x + offset[0] - tooltipSize[0] - 22 - LOTIVIS_CONFIG.tooltipOffset;
    }

    function getXRight(date, factor, offset) {
      let x =
        chart.xChartScalePadding(date) + chart.xChartScalePadding.bandwidth();
      x *= factor;
      x += offset[0] + LOTIVIS_CONFIG.tooltipOffset;
      return x;
    }

    function getHTMLForDate(date) {
      let byDateLabel = dataView.byDateLabel;
      let filtered = byDateLabel.get(date);
      if (!filtered) return "No Data";

      let title = `${date}`;
      let sum = 0;
      let dataHTML = Array.from(filtered.keys())
        .map(function (label) {
          let value = filtered.get(label);
          if (!value) return undefined;
          let colorGenerator = chart.controller.colorGenerator;
          let color = colorGenerator.label(label);
          let divHTML = `<div style="background: ${color};color: ${color}; display: inline;">__</div>`;
          let valueFormatted = numberFormat(value);
          sum += value;
          return `${divHTML} ${label}: <b>${valueFormatted}</b>`;
        })
        .filter((d) => d)
        .join("<br>");

      let sumFormatted = numberFormat(sum);
      return `<b>${title}</b><br>${dataHTML}<br><br>Sum: <b>${sumFormatted}</b>`;
    }

    function showTooltip(event, date) {
      // set examples content before positioning the tooltip cause the size is
      // calculated based on the size
      const html = getHTMLForDate(date);
      tooltip.html(html);

      // position tooltip
      let tooltipSize = getTooltipSize();
      let factor = chart.getElementEffectiveSize()[0] / chart.config.width;
      let offset = chart.getElementPosition();
      let top = getTop(factor, offset, tooltipSize);
      let left = chart.xChartScalePadding(date);

      // differ tooltip position on bar position
      if (left > chart.config.width / 2) {
        left = getXLeft(date, factor, offset, tooltipSize);
      } else {
        left = getXRight(date, factor, offset);
      }

      // update position and opacity of tooltip
      tooltip
        .style("left", `${left}px`)
        .style("top", `${top}px`)
        .style("opacity", 1);
    }

    function hideTooltip() {
      if (+tooltip.style("opacity") === 0) return;
      tooltip.style("opacity", 0);
    }

    chart.on("mouseenter", showTooltip);
    chart.on("mouseout", hideTooltip);
  }
}
