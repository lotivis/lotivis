import { createIDFromDataset } from "../shared/selector";

/**
 * Draws the background / selection bars of a time plot chart.
 *
 * @class PlotChartHoverBarsRenderer
 */
export class PlotChartHoverBarsRenderer {
  /**
   * Creates a new instance of PlotAxisRenderer.
   * @constructor
   * @param plotChart The parental date.chart.plot.chart chart.
   */
  constructor(plotChart) {
    function createID(dataset) {
      return `ltv-plot-chart-hover-bar-id-${createIDFromDataset(dataset)}`;
    }

    function hideAll() {
      plotChart.svg.selectAll(".ltv-plot-chart-hover-bar").attr("opacity", 0);
    }

    /**
     * To be called when the mouse enters a bar on the date.chart.plot.chart chart.
     * @param event The mouse event.
     * @param dataset The represented dataset.
     */
    function mouseEnter(event, dataset) {
      hideAll();

      let id = createID(dataset);
      plotChart.svg.select(`#${id}`).attr("opacity", 0.3);

      plotChart.tooltipRenderer.showTooltip.bind(plotChart)(event, dataset);
      // plotChart.onSelectDataset(event, dataset);
    }

    /**
     * To be called when the mouse leaves a bar on the date.chart.plot.chart chart.
     * @param event The mouse event.
     * @param dataset The represented dataset.
     */
    function mouseOut(event, dataset) {
      hideAll();
      plotChart.tooltipRenderer.hideTooltip.bind(plotChart)(event, dataset);

      if (event.buttons === 1) {
        mouseClick(event, dataset);
      }
    }

    function mouseClick(event, dataset) {
      if (plotChart.config.sendsNotifications) {
        plotChart.makeUpdateInsensible();
        plotChart.datasetController.toggleDataset(dataset.label);
        plotChart.makeUpdateSensible();
      }
      plotChart.selectionRenderer.update();
    }

    /**
     * Draws the bars.
     */
    this.render = function() {
      let datasets = plotChart.dataView.datasets;
      let graphWidth = plotChart.graphWidth;

      plotChart.backgrounBarsData = plotChart.svg
        .append("g")
        .selectAll("g")
        .data(datasets)
        .enter();

      plotChart.backgrounBars = plotChart.backgrounBarsData
        .append("rect")
        .attr("id", d => createID(d))
        .attr("class", "ltv-plot-chart-hover-bar")
        .attr(`opacity`, 0)
        .attr("x", plotChart.config.margin.left)
        .attr("y", d => plotChart.yChart(d.label))
        .attr("height", plotChart.yChart.bandwidth())
        .attr("width", graphWidth)
        .on("mouseenter", mouseEnter)
        .on("mouseout", mouseOut)
        .on("click", mouseClick);
    };
  }
}
