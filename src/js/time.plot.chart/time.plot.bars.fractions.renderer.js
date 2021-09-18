import {createIDFromDataset} from "../shared/selector";
import {flatDatasets} from "../data.juggle/data.flat";
import {combineByDate} from "../data.juggle/data.combine";
import {Color} from "../shared.color/color";

/**
 * Draws the bar on the time plot chart.
 * @class TimePlotBarsFractionsRenderer
 */
export class TimePlotBarsFractionsRenderer {

  /**
   * Creates a new instance of PlotAxisRenderer.
   * @constructor
   * @param plotChart The parental time.chart.plot.chart chart.
   */
  constructor(plotChart) {

    // constant for the radius of the drawn bars.
    const radius = 6;

    /**
     * To be called when the mouse enters a bar on the time.chart.plot.chart chart.
     * @param event The mouse event.
     * @param dataset The represented dataset.
     */
    function mouseEnter(event, dataset) {
      // plotChart.tooltipRenderer.showTooltip.bind(plotChart)(event, dataset);
      // plotChart.onSelectDataset(event, dataset);
    }

    /**
     * To be called when the mouse leaves a bar on the time.chart.plot.chart chart.
     * @param event The mouse event.
     * @param dataset The represented dataset.
     */
    function mouseOut(event, dataset) {
      // plotChart.tooltipRenderer.hideTooltip.bind(plotChart)(event, dataset);
    }

    /**
     * Draws the bars.
     */
    this.renderBars = function () {
      let datasets = plotChart.dataView.datasetsSorted || plotChart.dataView.datasets;
      let flatData = flatDatasets(datasets);
      flatData = combineByDate(flatData);

      plotChart.barsData = plotChart
        .svg
        .append("g")
        .selectAll("g")
        .data(flatData)
        .enter();

      plotChart.bars = plotChart.barsData
        .append("rect")
        .attr("id", (d) => `lotivis-time-plot-chart-${createIDFromDataset(d)}`)
        .attr('class', 'lotivis-time-plot-chart-bar')
        .attr(`fill`, `blue`)
        .attr("rx", radius)
        .attr("ry", radius)
        .attr("x", (d) => plotChart.xChart(d.date))
        .attr("y", (d) => plotChart.yChart(d.label))
        .attr("height", plotChart.yChart.bandwidth())
        .attr("id", (d) => 'rect-' + createIDFromDataset(d))
        .on('mouseenter', mouseEnter)
        .on('mouseout', mouseOut)
        .attr("width", plotChart.xChart.bandwidth());
    };
  }
}
