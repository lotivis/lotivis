import {PlotBarsGradientCreator} from "./plot.bars.gradient.creator";
import {createIDFromDataset} from "../shared/selector";

/**
 * Draws the bar on the date.chart.plot.chart chart.
 * @class PlotBarsGradientRenderer
 */
export class PlotBarsGradientRenderer {

  /**
   * Creates a new instance of PlotAxisRenderer.
   * @constructor
   * @param plotChart The parental date.chart.plot.chart chart.
   */
  constructor(plotChart) {

    // constant for the radius of the drawn bars.
    const radius = 6;

    this.gradientCreator = new PlotBarsGradientCreator(plotChart);
    plotChart.definitions = plotChart.svg.append("defs");

    /**
     * Draws the bars.
     */
    this.renderBars = function () {
      let datasets = plotChart.dataView.datasets;
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
        .attr("y", (d) => plotChart.yChartPadding(d.label))
        .attr("height", plotChart.yChartPadding.bandwidth())
        .attr("id", (d) => 'lotivis-plot-rect-' + createIDFromDataset(d))
        .attr("width", function (data) {
          if (!data.firstDate || !data.lastDate) return 0;
          return plotChart.xChart(data.lastDate) - plotChart.xChart(data.firstDate) + plotChart.xChart.bandwidth();
        }.bind(this));
    };
  }
}
