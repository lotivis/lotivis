import { Color } from "../shared/color";
import { createIDFromDataset } from "../shared/selector";

/**
 * Calculates and creates the gradients for the bars of a date.chart.plot.chart chart.
 *
 * @class PlotBarsGradientCreator
 */
export class PlotBarsGradientCreator {
  /**
   * Creates a new instance of PlotBarsGradientCreator.
   *
   * @constructor
   * @param plotChart The parental date.chart.plot.chart chart.
   */
  constructor(plotChart) {
    this.plotChart = plotChart;
    this.colorGenerator = Color.plotColor(1);
  }

  /**
   * Creates the gradient for the bar representing the given dataset.
   * @param dataset The dataset to represent.
   */
  createGradient(dataset) {
    let max = this.plotChart.dataView.max;
    let gradient = this.plotChart.definitions
      .append("linearGradient")
      .attr("id", "ltv-plot-gradient-" + createIDFromDataset(dataset))
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
