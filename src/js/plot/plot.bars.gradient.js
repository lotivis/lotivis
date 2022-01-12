import { PlotBarsGradientCreator } from "./plot.gradient.creator";
import hash_str from "../common/hash.js";
import { Renderer } from "../common/renderer";
import { PLOT_CHART_TYPE } from "./plot.config";
import { LOTIVIS_CONFIG } from "../common/config";

export class PlotBarsGradientRenderer extends Renderer {
  render(chart, controller, dataView) {
    if (chart.config.type !== PLOT_CHART_TYPE.gradient) return;

    // constant for the radius of the drawn bars.
    let radius = LOTIVIS_CONFIG.barRadius;

    this.gradientCreator = new PlotBarsGradientCreator(chart);
    chart.definitions = chart.svg.append("defs");

    let datasets = chart.dataView.datasets;
    chart.definitions = chart.svg.append("defs");

    for (let index = 0; index < datasets.length; index++) {
      this.gradientCreator.createGradient(datasets[index]);
    }

    chart.barsData = chart.svg
      .append("g")
      .selectAll("g")
      .data(datasets)
      .enter();

    chart.bars = chart.barsData
      .append("rect")
      .attr("fill", (d) => `url(#ltv-plot-gradient-${hash_str(d.label)})`)
      .attr("class", "ltv-plot-bar")
      .attr("rx", radius)
      .attr("ry", radius)
      .attr("x", (d) =>
        chart.xChart(d.duration < 0 ? d.lastDate : d.firstDate || 0)
      )
      .attr("y", (d) => chart.yChartPadding(d.label))
      .attr("height", chart.yChartPadding.bandwidth())
      .attr("id", (d) => "ltv-plot-rect-" + hash_str(d.label))
      .attr(
        "width",
        function (data) {
          if (!data.firstDate || !data.lastDate) return 0;
          return (
            chart.xChart(data.lastDate) -
            chart.xChart(data.firstDate) +
            chart.xChart.bandwidth()
          );
        }.bind(this)
      );
  }
}
