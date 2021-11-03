import {Color} from "../shared.color/color";
import {createIDFromDataset, toSaveID} from "../shared/selector";
import {TimePlotBarsGradientCreator} from "./time.plot.bars.gradient.creator";

/**
 * Draws the background / selection bars of a time plot chart.
 *
 * @class TimePlotBackgroundBarsRenderer
 */
export class TimePlotBackgroundBarsRenderer {

  /**
   * Creates a new instance of PlotAxisRenderer.
   * @constructor
   * @param plotChart The parental time.chart.plot.chart chart.
   */
  constructor(plotChart) {

    function createID(dataset) {
      return `ghost-rect-${createIDFromDataset(dataset)}`;
    }

    function hideAll() {
      plotChart.svg
        .selectAll('.lotivis-time-plot-chart-selection-rect')
        .attr("opacity", 0);
    };

    /**
     * To be called when the mouse enters a bar on the time.chart.plot.chart chart.
     * @param event The mouse event.
     * @param dataset The represented dataset.
     */
    function mouseEnter(event, dataset) {
      hideAll();

      let id = createID(dataset);
      plotChart
        .svg
        .select(`#${id}`)
        .attr("opacity", 0.3);

      plotChart.tooltipRenderer.showTooltip.bind(plotChart)(event, dataset);
      // plotChart.onSelectDataset(event, dataset);
    }

    /**
     * To be called when the mouse leaves a bar on the time.chart.plot.chart chart.
     * @param event The mouse event.
     * @param dataset The represented dataset.
     */
    function mouseOut(event, dataset) {
      hideAll();
      plotChart.tooltipRenderer.hideTooltip.bind(plotChart)(event, dataset);
    }

    /**
     * Draws the bars.
     */
    this.renderBars = function () {
      let datasets = plotChart.dataView.datasetsSorted || plotChart.dataView.datasets;
      let firstDate = plotChart.dataView.firstDate;
      let graphWidth = plotChart.graphWidth;

      plotChart.backgrounBarsData = plotChart
        .svg
        .append("g")
        .selectAll("g")
        .data(datasets)
        .enter();

      plotChart.backgrounBars = plotChart.backgrounBarsData
        .append("rect")
        .attr("id", (d) => createID(d))
        .attr('class', 'lotivis-time-plot-chart-selection-rect')
        .attr(`opacity`, 0)
        .attr("x", plotChart.config.margin.left)
        .attr("y", (d) => plotChart.yChart(d.label))
        .attr("height", plotChart.yChart.bandwidth())
        .attr("width", graphWidth)
        .on('mouseenter', mouseEnter)
        .on('mouseout', mouseOut);
    };
  }
}
