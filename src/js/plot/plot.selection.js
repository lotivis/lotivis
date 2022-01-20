import { hash_str } from "../common/hash.js";
import { Renderer } from "../common/renderer.js";

export class PlotChartSelectionRenderer extends Renderer {
  render(chart, controller) {
    function createID(dataset) {
      return `ltv-plot-chart-selection-rect-id-${hash_str(dataset.label)}`;
    }

    function update() {
      let filter = chart.controller.filters.labels || [];
      chart.svg
        .selectAll(`.ltv-plot-chart-selection-rect`)
        .attr(`opacity`, (d) => (filter.includes(d.label) ? 0.3 : 0));
    }

    function _render() {
      let datasets = chart.dataView.datasets;
      let graphWidth = chart.graphWidth;

      chart.selectionBarsData = chart.svg
        .append("g")
        .selectAll("g")
        .data(datasets)
        .enter();

      chart.selectionBars = chart.selectionBarsData
        .append("rect")
        .attr("id", (d) => createID(d))
        .attr("class", "ltv-plot-chart-selection-rect")
        .attr(`opacity`, 0)
        .attr("x", chart.config.margin.left)
        .attr("y", (d) => chart.yChart(d.label))
        .attr("height", chart.yChart.bandwidth())
        .attr("width", graphWidth);

      update();
    }

    chart.on("click", update);

    _render();
  }
}
