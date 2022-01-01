/**
 * Draws the background of a time plot chart.
 */
export class PlotBackgroundRenderer {
  /**
   *
   * @param plotChart
   */
  constructor(plotChart) {
    this.render = function() {
      plotChart.svg
        .append("rect")
        .attr("width", plotChart.width || plotChart.config.width)
        .attr("height", plotChart.height)
        .attr("class", `ltv-plot-chart-background`)
        .on("click", (event, some) => {
          plotChart.datasetController.resetLabelFilters();
        });
    };
  }
}
