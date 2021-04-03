import {combineByDate} from "../data.juggle/data.combine";
import {GlobalConfig} from "../shared/config";

/**
 * Injects and presents a tooltip on a date chart.
 *
 * @class DateTooltipRenderer
 */
export class DateTooltipRenderer {

  /**
   * Creates a new instance of DateTooltipRenderer.
   *
   * @constructor
   */
  constructor(dateChart) {

    const tooltip = dateChart
      .element
      .append('div')
      .attr('class', 'lotivis-tooltip')
      .attr('rx', 5) // corner radius
      .attr('ry', 5)
      .style('opacity', 0);

    /**
     * Returns the size [width, height] of the tooltip.
     *
     * @returns {number[]}
     */
    function getTooltipSize() {
      let tooltipWidth = Number(tooltip.style('width').replace('px', ''));
      let tooltipHeight = Number(tooltip.style('height').replace('px', ''));
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
      top += (((dateChart.graphHeight * factor) - tooltipSize[1]) / 2);
      top += offset[1] - 10;
      return top;
    }

    /**
     * Calculates the x offset to position the tooltip on the left side
     * of a bar.
     *
     * @param date The presented date of selected bar.
     * @param factor The size factor of the chart.
     * @param offset The offset of the chart.
     * @param tooltipSize The size of the tooltip.
     * @returns {number} The x offset for the tooltip.
     */
    function getXLeft(date, factor, offset, tooltipSize) {
      let x = dateChart.xChart(date) * factor;
      return x + offset[0] - tooltipSize[0] - 22 - GlobalConfig.tooltipOffset;
    }

    /**
     * Calculates the x offset to position the tooltip on the right side
     * of a bar.
     *
     * @param date The presented date of selected bar.
     * @param factor The size factor of the chart.
     * @param offset The offset of the chart.
     * @returns {number} The x offset for the tooltip.
     */
    function getXRight(date, factor, offset) {
      let x = dateChart.xChart(date) + dateChart.xChart.bandwidth();
      x *= factor;
      x += offset[0] + GlobalConfig.tooltipOffset;
      return x;
    }

    /**
     * Returns the HTML content for the given date.
     *
     * @param date The date to get the HTML content for.
     * @returns {string} Return the rendered HTML content.
     */
    function getHTMLForDate(date) {
      let flatData = dateChart.datasetController
        .enabledFlatData()
        .filter(item => item.date === date);

      let first = flatData.first();
      let title;
      if (first && first.from && first.till) {
        title = `${first.from} - ${first.till}`;
      } else {
        title = `${date}`;
      }

      let dataHTML = combineByDate(flatData)
        .filter(item => item.value > 0)
        .map(function (item) {
          let color = dateChart.datasetController.getColorForDataset(item.dataset);
          let divHTML = `<div style="background: ${color};color: ${color}; display: inline;">__</div>`;
          return `${divHTML} ${item.dataset}: <b>${item.value}</b>`;
        })
        .join('<br>');

      return `<b>${title}</b><br>${dataHTML}`;
    }

    /**
     * Presents the tooltip next to bar presenting the given date.
     *
     * @param event The mouse event.
     * @param date The date which is presented.
     */
    this.showTooltip = function (event, date) {

      // set examples content before positioning the tooltip cause the size is
      // calculated based on the size
      tooltip.html(getHTMLForDate(date));

      // position tooltip
      let tooltipSize = getTooltipSize();
      let factor = dateChart.getElementEffectiveSize()[0] / dateChart.config.width;
      let offset = dateChart.getElementPosition();
      let top = getTop(factor, offset, tooltipSize);
      let left = dateChart.xChart(date);

      // differ tooltip position on bar position
      if (left > (dateChart.config.width / 2)) {
        left = getXLeft(date, factor, offset, tooltipSize);
      } else {
        left = getXRight(date, factor, offset);
      }

      // update position and opacity of tooltip
      tooltip
        .style('left', `${left}px`)
        .style('top', `${top}px`)
        .style('opacity', 1);
    };

    /**
     * Hides the tooltip.  Does nothing if tooltips opacity is already 0.
     */
    this.hideTooltip = function () {
      if (+tooltip.style('opacity') === 0) return;
      tooltip.style('opacity', 0);
    };
  }
}
