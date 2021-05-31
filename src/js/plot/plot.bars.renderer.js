import {PlotGradientCreator} from "./plot.gradient.creator";
import {createIDFromDataset} from "../shared/selector";
import {lotivis_log} from "../shared/debug";

/**
 * Draws the bar on the plot chart.
 * @class PlotBarsRenderer
 */
export class PlotBarsRenderer {

  /**
   * Creates a new instance of PlotAxisRenderer.
   * @constructor
   * @param plotChart The parental plot chart.
   */
  constructor(plotChart) {

    // constant for the radius of the drawn bars.
    const radius = 6;

    this.gradientCreator = new PlotGradientCreator(plotChart);
    plotChart.definitions = plotChart.svg.append("defs");

    /**
     * To be called when the mouse enters a bar on the plot chart.
     * @param event The mouse event.
     * @param dataset The represented dataset.
     */
    function mouseEnter(event, dataset) {
      plotChart.tooltipRenderer.showTooltip.bind(plotChart)(event, dataset);
      plotChart.onSelectDataset(event, dataset);
    }

    /**
     * To be called when the mouse leaves a bar on the plot chart.
     * @param event The mouse event.
     * @param dataset The represented dataset.
     */
    function mouseOut(event, dataset) {
      plotChart.tooltipRenderer.hideTooltip.bind(plotChart)(event, dataset);
    }

    /**
     * Draws the bars.
     */
    this.renderBars = function () {
      lotivis_log('plotChart.dataView', plotChart.dataView);
      let datasets = plotChart.dataView.datasetsSorted || plotChart.dataView.datasets;
      plotChart.definitions = plotChart.svg.append("defs");

      for (let index = 0; index < datasets.length; index++) {
        this.gradientCreator.createGradient(datasets[index]);
      }

      plotChart.barsData = plotChart
        .svg
        .append("g")
        .selectAll("g")
        .data(datasets)
        .enter();

      plotChart.bars = plotChart.barsData
        .append("rect")
        .attr("fill", (d) => `url(#lotivis-plot-gradient-${createIDFromDataset(d)})`)
        .attr('class', 'lotivis-plot-bar')
        .attr("rx", radius)
        .attr("ry", radius)
        .attr("x", (d) => plotChart.xChart((d.duration < 0) ? d.lastDate : d.firstDate || 0))
        .attr("y", (d) => plotChart.yChart(d.label))
        .attr("height", plotChart.yChart.bandwidth())
        .attr("id", (d) => 'rect-' + createIDFromDataset(d))
        .on('mouseenter', mouseEnter)
        .on('mouseout', mouseOut)
        .attr("width", function (data) {
          if (!data.firstDate || !data.lastDate) return 0;
          return plotChart.xChart(data.lastDate) - plotChart.xChart(data.firstDate) + plotChart.xChart.bandwidth();
        }.bind(this));
    };
  }
}
