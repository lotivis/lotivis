import { PlotColors } from "../common/colors";
import { PLOT_COLOR_MODE } from "./plot.config";
import { hash_str } from "../common/hash.js";
import { lab } from "d3";

export class PlotBarsGradientCreator {
  constructor(chart, controller, dataView) {
    this.chart = chart;
    this.controller = controller;
    this.dataView = dataView;
    this.plotColors = PlotColors(dataView.max);
  }

  createGradient(dataset) {
    let max = this.chart.dataView.max;
    let gradient = this.chart.definitions
      .append("linearGradient")
      .attr("id", this.chart.selector + "-" + hash_str(dataset.label))
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");

    let data = dataset.data;
    if (!data || data.length === 0) return;

    let count = data.length;
    let latestDate = dataset.lastDate;

    let plotColors = this.plotColors;
    let brush = max / 2;
    let colorGenerator = this.controller.colorGenerator();
    let colorMode = this.chart.config.colorMode;

    function append(value, percent) {
      gradient
        .append("stop")
        .attr("offset", percent + "%")
        .attr(
          "stop-color",
          colorMode === PLOT_COLOR_MODE.single
            ? colorGenerator.label(dataset.label)
            : plotColors(value)
        )
        .attr(
          "stop-opacity",
          colorMode === PLOT_COLOR_MODE.single
            ? (value + brush) / (max + brush)
            : 1
        );
    }

    if (dataset.duration === 0) {
      append(data[0].value, 100);
    } else {
      for (let i = 0; i < count; i++) {
        let diff = latestDate - data[i].date;
        let opacity = diff / dataset.duration;
        let percent = (1 - opacity) * 100;
        append(data[i].value, percent);
      }
    }
  }
}
