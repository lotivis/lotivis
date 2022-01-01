import { combineByDate } from "../data.juggle/data.combine";
import { LotivisConfig } from "../shared/config";

/**
 * Injects and presents a tooltip on a date.chart chart.
 *
 * @class TimeChartTooltipRenderer
 */
export class TimeChartTooltipRenderer {
  /**
   * Creates a new instance of TimeChartTooltipRenderer.
   *
   * @constructor
   */
  constructor(dateChart) {
    const tooltip = dateChart.element
      .append("div")
      .attr("class", "ltv-tooltip")
      .attr("rx", 5) // corner radius
      .attr("ry", 5)
      .style("opacity", 0);

    /**
     * Returns the size [width, height] of the tooltip.
     *
     * @returns {number[]}
     */
    function getTooltipSize() {
      let tooltipWidth = Number(tooltip.style("width").replace("px", ""));
      let tooltipHeight = Number(tooltip.style("height").replace("px", ""));
      return [tooltipWidth, tooltipHeight];
    }

    /**
     * Calculates and returns the top pixel position for the tooltip.
     *
     * @param factor The size factor of the chart.
     * @param offset The offset of the chart.
     * @param tooltipSize The size of the tooltip.
     * @returns {number}
     */
    function getTop(factor, offset, tooltipSize) {
      let top = dateChart.config.margin.top * factor;
      top += (dateChart.graphHeight * factor - tooltipSize[1]) / 2;
      top += offset[1] - 10;
      return top;
    }

    /**
     * Calculates the x offset to position the tooltip on the left side
     * of a bar.
     *
     * @param date The presented date.chart of selected bar.
     * @param factor The size factor of the chart.
     * @param offset The offset of the chart.
     * @param tooltipSize The size of the tooltip.
     * @returns {number} The x offset for the tooltip.
     */
    function getXLeft(date, factor, offset, tooltipSize) {
      let x = dateChart.xChartScalePadding(date) * factor;
      return x + offset[0] - tooltipSize[0] - 22 - LotivisConfig.tooltipOffset;
    }

    /**
     * Calculates the x offset to position the tooltip on the right side
     * of a bar.
     *
     * @param date The presented date.chart of selected bar.
     * @param factor The size factor of the chart.
     * @param offset The offset of the chart.
     * @returns {number} The x offset for the tooltip.
     */
    function getXRight(date, factor, offset) {
      let x =
        dateChart.xChartScalePadding(date) +
        dateChart.xChartScalePadding.bandwidth();
      x *= factor;
      x += offset[0] + LotivisConfig.tooltipOffset;
      return x;
    }

    /**
     * Returns the HTML content for the given date.chart.
     *
     * @param date The date.chart to get the HTML content for.
     * @returns {string} Return the rendered HTML content.
     */
    function getHTMLForDate(date) {
      let flatData = dateChart.snapshot.flatData.filter(
        item => `${item.date}` === `${date}`
      );

      let first = flatData.first();
      let title;
      if (first && first.from && first.till) {
        title = `${first.from} - ${first.till}`;
      } else {
        title = `${date}`;
      }

      let sum = 0;
      let dataHTML = combineByDate(flatData)
        .filter(item => item.value > 0)
        .map(function(item) {
          let color = dateChart.datasetController.getColorForDataset(
            item.dataset
          );
          let divHTML = `<div style="background: ${color};color: ${color}; display: inline;">__</div>`;
          let valueFormatted = dateChart.config.numberFormat.format(item.value);
          sum += item.value;
          return `${divHTML} ${item.dataset}: <b>${valueFormatted}</b>`;
        })
        .join("<br>");

      let sumFormatted = dateChart.config.numberFormat.format(sum);
      return `<b>${title}</b><br>${dataHTML}<br><br>Sum: <b>${sumFormatted}</b>`;
    }

    /**
     * Presents the tooltip next to bar presenting the given date.chart.
     *
     * @param event The mouse event.
     * @param date The date.chart which is presented.
     */
    this.showTooltip = function(event, date) {
      // set examples content before positioning the tooltip cause the size is
      // calculated based on the size
      const html = getHTMLForDate(date);
      tooltip.html(html);

      // position tooltip
      let tooltipSize = getTooltipSize();
      let factor =
        dateChart.getElementEffectiveSize()[0] / dateChart.config.width;
      let offset = dateChart.getElementPosition();
      let top = getTop(factor, offset, tooltipSize);
      let left = dateChart.xChartScalePadding(date);

      // differ tooltip position on bar position
      if (left > dateChart.config.width / 2) {
        left = getXLeft(date, factor, offset, tooltipSize);
      } else {
        left = getXRight(date, factor, offset);
      }

      // update position and opacity of tooltip
      tooltip
        .style("left", `${left}px`)
        .style("top", `${top}px`)
        .style("opacity", 1);
    };

    /**
     * Hides the tooltip.  Does nothing if tooltips opacity is already 0.
     */
    this.hideTooltip = function() {
      if (+tooltip.style("opacity") === 0) return;
      tooltip.style("opacity", 0);
    };
  }
}
