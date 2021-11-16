import {createIDFromDataset} from "../shared/selector";

/**
 * Draws the selection rectangles of a plot chart.
 *
 * @class PlotChartSelectionRenderer
 */
export class PlotChartSelectionRenderer {

  /**
   * Creates a new instance of PlotChartSelectionRenderer.
   *
   * @constructor
   * @param plotChart The parental plot chart.
   */
  constructor(plotChart) {

    function createID(dataset) {
      return `lotivis-plot-chart-selection-rect-id-${createIDFromDataset(dataset)}`;
    }

    function hideAll() {
      plotChart.svg
        .selectAll(`.lotivis-plot-chart-selection-rect`)
        .attr("opacity", 0);
    }

    /**
     * Draws the bars.
     */
    this.render = function () {
      let datasets = plotChart.dataView.datasets;
      let graphWidth = plotChart.graphWidth;

      plotChart.selectionBarsData = plotChart
        .svg
        .append("g")
        .selectAll("g")
        .data(datasets)
        .enter();

      plotChart.selectionBars = plotChart
        .selectionBarsData
        .append("rect")
        .attr("id", (d) => createID(d))
        .attr('class', 'lotivis-plot-chart-selection-rect')
        .attr(`opacity`, 0)
        .attr("x", plotChart.config.margin.left)
        .attr("y", (d) => plotChart.yChart(d.label))
        .attr("height", plotChart.yChart.bandwidth())
        .attr("width", graphWidth);

    };


    this.update = function () {
      let selectedLabels = getSelectedLabels();
      plotChart
        .svg
        .selectAll(`.lotivis-plot-chart-selection-rect`)
        .attr(`opacity`, dataset => selectedLabels.includes(dataset.label) ? 0.3 : 0);
      console.log('selectedLabels', selectedLabels);
    };

    function getSelectedLabels() {
      console.log('plotChart.datasetController.filters', plotChart.datasetController.filters);
      return plotChart.datasetController.filters.labels || [];
    }
  }
}
