import { plotColors } from "../common/colors";
import hash_str from "../common/hash.js";

export class PlotBarsGradientCreator {
  constructor(chart) {
    this.chart = chart;
    this.colorGenerator = plotColors(1);
  }

  createGradient(dataset) {
    let max = this.chart.dataView.max;
    let gradient = this.chart.definitions
      .append("linearGradient")
      .attr("id", "ltv-plot-gradient-" + hash_str(dataset.label))
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");

    let data = dataset.data;
    let count = data.length;
    let latestDate = dataset.lastDate;
    let duration = dataset.duration;

    if (!data || data.length === 0) return;

    if (duration === 0) {
      let item = data[0];
      let value = item.value;
      let opacity = value / max;

      gradient
        .append("stop")
        .attr("offset", `100%`)
        .attr("stop-color", this.colorGenerator(opacity));
    } else {
      for (let index = 0; index < count; index++) {
        let item = data[index];
        let date = item.date;
        let opacity = item.value / max;

        let dateDifference = latestDate - date;
        let value = dateDifference / duration;
        let datePercentage = (1 - value) * 100;

        gradient
          .append("stop")
          .attr("offset", `${datePercentage}%`)
          .attr("stop-color", this.colorGenerator(opacity));
      }
    }
  }
}
