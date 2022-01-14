import { LOTIVIS_CONFIG } from "../common/config";
import { Renderer } from "../common/renderer";

export class BarBarsRenderer extends Renderer {
  render(chart, controller) {
    let stackedDatasets = chart.dataView.stacked;
    let config = chart.config || {};
    let isCombineStacks = config.combineStacks || false;
    let colorGenerator = controller.colorGenerator;

    for (let i = 0; i < stackedDatasets.length; i++) {
      let stackedDataset = stackedDatasets[i];
      let colors = colorGenerator.stackColors(stackedDataset.stack);
      let radius = LOTIVIS_CONFIG.barRadius;
      chart.svg
        .append("g")
        .selectAll("g")
        .data(stackedDataset.series)
        .enter()
        .append("g")
        .attr("fill", (d, i) => (isCombineStacks ? colors[0] : colors[i]))
        .selectAll("rect")
        .data((serie) => serie)
        .enter()
        .append("rect")
        .attr("class", "ltv-bar-chart-bar")
        .attr("rx", radius)
        .attr("ry", radius)
        .attr("x", (item) => {
          let date = item.data[0];
          let stackName = stackedDataset.stack;
          return chart.xChartScale(date) + chart.xStack(stackName);
        })
        .attr("y", (d) => chart.yChart(d[1]))
        .attr("width", chart.xStack.bandwidth())
        .attr("height", (d) =>
          !d[1] ? 0 : chart.yChart(d[0]) - chart.yChart(d[1])
        );
    }
  }
}
