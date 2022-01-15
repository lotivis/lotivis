import { LOTIVIS_CONFIG } from "../common/config";
import { Renderer } from "../common/renderer";
import { BAR_CHART_TYPE } from "./bar.config.js";

export class BarBarsRenderer extends Renderer {
  render(chart, controller) {
    let stackedDatasets = chart.dataView.stacked;
    let config = chart.config || {};
    let radius = chart.config.barRadius || LOTIVIS_CONFIG.barRadius;
    let isCombineStacks = chart.config.type === "combine" || false;
    let colors = controller.colorGenerator;
    let barWidth = chart.xStack.bandwidth();
    let height = chart.yChart(0);

    function combined() {
      chart.svg
        .append("g")
        .selectAll("g")
        .data(chart.dataView.byDateStack)
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${chart.xChartScale(d[0])},0)`)
        .selectAll("rect")
        .data((d) => d[1]) // map to by stack
        .enter()
        .append("rect")
        .attr("class", "ltv-bar-chart-bar")
        .attr("fill", (d) => colors.stack(d[0]))
        .attr("x", (d) => chart.xStack(d[0]))
        .attr("y", (d) => chart.yChart(d[1]))
        .attr("width", barWidth)
        .attr("height", (d) => height - chart.yChart(d[1]))
        .attr("rx", radius)
        .attr("ry", radius);
    }

    function stacked() {
      for (let i = 0; i < stackedDatasets.length; i++) {
        let stackedDataset = stackedDatasets[i];
        let colors = controller.colorGenerator.stackColors(
          stackedDataset.stack
        );

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

    if (chart.config.type === BAR_CHART_TYPE.combine) {
      combined();
    } else {
      stacked();
    }
  }
}
