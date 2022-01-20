import { hash_str } from "../common/hash";
import { Renderer } from "../common/renderer";

export class PlotHoverBarsRenderer extends Renderer {
  render(chart, controller) {
    function createID(dataset) {
      return `ltv-plot-chart-hover-bar-id-${hash_str(dataset.label)}`;
    }

    function hideAll() {
      chart.svg.selectAll(".ltv-plot-chart-hover-bar").attr("opacity", 0);
    }

    function mouseEnter(event, dataset) {
      hideAll();

      let id = createID(dataset);
      chart.svg.select(`#${id}`).attr("opacity", 0.3);

      chart.emit("mouseenter", event, dataset);
    }

    function mouseOut(event, dataset) {
      hideAll();

      if (event.buttons === 1) {
        mouseClick(event, dataset);
      }
      chart.emit("mouseout", event, dataset);
    }

    function mouseClick(event, dataset) {
      if (chart.config.selectable) {
        chart.makeUpdateInsensible();
        chart.controller.filters.labels.toggle(dataset.label);
        chart.makeUpdateSensible();
      }
      chart.emit("click", event, dataset);
    }

    let datasets = chart.dataView.datasets;
    let graphWidth = chart.graphWidth;

    chart.backgrounBarsData = chart.svg
      .append("g")
      .selectAll("g")
      .data(datasets)
      .enter();

    chart.backgrounBars = chart.backgrounBarsData
      .append("rect")
      .attr("id", (d) => createID(d))
      .attr("class", "ltv-plot-chart-hover-bar")
      .attr(`opacity`, 0)
      .attr("x", chart.config.margin.left)
      .attr("y", (d) => chart.yChart(d.label))
      .attr("height", chart.yChart.bandwidth())
      .attr("width", graphWidth)
      .on("mouseenter", mouseEnter)
      .on("mouseout", mouseOut)
      .on("click", mouseClick);
  }
}
