import { createIDFromDataset } from "../shared/selector";
import { flatDatasets } from "../data.juggle/data.flat";
import { combineByDate } from "../data.juggle/data.combine";
import { Color } from "../shared/color";

/**
 * Draws the bar on the time plot chart.
 * @class PlotBarsFractionsRenderer
 */
export class PlotBarsFractionsRenderer {
  /**
   * Creates a new instance of PlotAxisRenderer.
   * @constructor
   * @param plotChart The parental date.chart.plot.chart chart.
   */
  constructor(plotChart) {
    // constant for the radius of the drawn bars.
    const radius = 6;

    /**
     * To be called when the mouse enters a bar on the date.chart.plot.chart chart.
     * @param event The mouse event.
     * @param dataset The represented dataset.
     */
    function mouseEnter(event, dataset) {
      // plotChart.tooltipRenderer.showTooltip.bind(plotChart)(event, dataset);
      // plotChart.onSelectDataset(event, dataset);
    }

    /**
     * To be called when the mouse leaves a bar on the date.chart.plot.chart chart.
     * @param event The mouse event.
     * @param dataset The represented dataset.
     */
    function mouseOut(event, dataset) {
      // plotChart.tooltipRenderer.hideTooltip.bind(plotChart)(event, dataset);
    }

    /**
     * Draws the bars.
     */
    this.renderBars = function() {
      let datasets = plotChart.dataView.datasets;
      let max = plotChart.dataView.max;
      let flatData = flatDatasets(datasets);
      flatData = combineByDate(flatData);

      plotChart.barsData = plotChart.svg
        .append("g")
        .selectAll("g")
        .data(flatData)
        .enter();

      let colors = Color.mapColors(max);

      plotChart.bars = plotChart.barsData
        .append("rect")
        .attr("id", d => `ltv-plot-bar-${createIDFromDataset(d)}`)
        .attr("class", "ltv-plot-bar")
        .attr(`fill`, d => colors(d.value))
        .attr("rx", radius)
        .attr("ry", radius)
        .attr("x", d => plotChart.xChart(d.date))
        .attr("y", d => plotChart.yChartPadding(d.label))
        .attr("height", plotChart.yChartPadding.bandwidth())
        .attr("id", d => "rect-" + createIDFromDataset(d))
        .on("mouseenter", mouseEnter)
        .on("mouseout", mouseOut)
        .attr("width", plotChart.xChart.bandwidth());
    };
  }
}
