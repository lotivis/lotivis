import {TimePlotBarsGradientCreator} from "./time.plot.bars.gradient.creator";
import {createIDFromDataset} from "../shared/selector";
import {lotivis_log} from "../shared/debug";

/**
 * Draws the bar on the time.chart.plot.chart chart.
 * @class TimePlotBarsRenderer
 */
export class TimePlotBarsRenderer {

  /**
   * Creates a new instance of PlotAxisRenderer.
   * @constructor
   * @param plotChart The parental time.chart.plot.chart chart.
   */
  constructor(plotChart) {

    // constant for the radius of the drawn bars.
    const radius = 6;

    this.gradientCreator = new TimePlotBarsGradientCreator(plotChart);
    plotChart.definitions = plotChart.svg.append("defs");

    /**
     * Draws the bars.
     */
    this.renderBars = function () {
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
        .attr('class', 'lotivis-time.chart.plot.chart-bar')
        .attr("rx", radius)
        .attr("ry", radius)
        .attr("x", (d) => plotChart.xChart((d.duration < 0) ? d.lastDate : d.firstDate || 0))
        .attr("y", (d) => plotChart.yChart(d.label))
        .attr("height", plotChart.yChart.bandwidth())
        .attr("id", (d) => 'rect-' + createIDFromDataset(d))
        .attr("width", function (data) {
          if (!data.firstDate || !data.lastDate) return 0;
          return plotChart.xChart(data.lastDate) - plotChart.xChart(data.firstDate) + plotChart.xChart.bandwidth();
        }.bind(this));
    };
  }
}
