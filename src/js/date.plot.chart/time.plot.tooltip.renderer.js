import {LotivisConfig} from "../shared/config";

/**
 * Appends and updates the tooltip of a date.chart.plot.chart chart.
 * @class TimePlotTooltipRenderer
 * @see PlotChart
 */
export class TimePlotTooltipRenderer {

  /**
   * Creates a new instance of TimePlotTooltipRenderer.
   *
   * @constructor
   * @param plotChart
   */
  constructor(plotChart) {

    const tooltip = plotChart
      .element
      .append('div')
      .attr('class', 'lotivis-tooltip')
      .attr('rx', 5) // corner radius
      .attr('ry', 5)
      .style('opacity', 0);

    /**
     * Returns the HTML content for the given dataset.
     * @param dataset The dataset to represent in HTML.
     */
    function getHTMLContentForDataset(dataset) {
      let components = [];

      let sum = dataset.data.map(item => item.value).reduce((acc, next) => +acc + +next, 0);
      let formatted = plotChart.config.numberFormat.format(sum);

      components.push('Label: ' + dataset.label);
      components.push('');
      components.push('Start: ' + dataset.firstDate);
      components.push('End: ' + dataset.lastDate);
      components.push('');
      components.push('Items: ' + formatted);
      components.push('');

      let filtered = dataset.data.filter(item => item.value !== 0);
      for (let index = 0; index < filtered.length; index++) {
        let entry = filtered[index];
        let formatted = plotChart.config.numberFormat.format(entry.value);
        components.push(`${entry.date}: ${formatted}`);
      }

      return components.join('<br/>');
    }

    /**
     * Returns the pixel position for to tooltip to display it aligned to the left of a bar.
     * @param dataset The dataset to display the tooltip for.
     * @param factor The factor of the view box of the SVG.
     * @param offset The offset of the chart.
     * @returns {*} The left pixel position for the tooltip.
     */
    function getTooltipLeftForDataset(dataset, factor, offset) {
      let left = plotChart.xChart(dataset.firstDate);
      left *= factor;
      left += offset[0];
      return left;
    }

    /**
     * Presents the tooltip for the given dataset.
     *
     * @param event The mouse event.
     * @param dataset The dataset.
     */
    this.showTooltip = function (event, dataset) {
      if (!plotChart.config.showTooltip) return;
      tooltip.html(getHTMLContentForDataset(dataset));

      // position tooltip
      let tooltipHeight = Number(tooltip.style('height').replace('px', ''));
      let factor = plotChart.getElementEffectiveSize()[0] / plotChart.config.width;
      let offset = plotChart.getElementPosition();

      let top = plotChart.yChart(dataset.label) * factor;
      top += offset[1];

      if ((plotChart.yChart(dataset.label) - plotChart.config.margin.top) <= (plotChart.graphHeight / 2)) {
        top += (plotChart.config.lineHeight * factor) + LotivisConfig.tooltipOffset;
      } else {
        top -= tooltipHeight + 20; // subtract padding
        top -= LotivisConfig.tooltipOffset;
      }

      let left = getTooltipLeftForDataset(dataset, factor, offset);

      tooltip
        .style('left', left + 'px')
        .style('top', top + 'px')
        .style('opacity', 1);
    };

    /**
     * Hides the tooltip by setting its opacity to 0.
     */
    this.hideTooltip = function () {
      let controller = plotChart.datasetController;
      let filters = controller.datasetFilters;

      if (filters && filters.length !== 0) {
        controller.resetFilters();
      }

      if (+tooltip.style('opacity') === 0) return;
      tooltip.style('opacity', 0);
    };
  }
}
