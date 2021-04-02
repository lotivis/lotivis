import {Color} from "../color/color";
import {createIDFromDataset} from "../shared/selector";

/**
 * Calculates and creates the gradients for the bars of a plot chart.
 *
 * @class PlotGradientCreator
 */
export class PlotGradientCreator {

  /**
   * Creates a new instance of PlotGradientCreator.
   *
   * @constructor
   * @param plotChart The parental plot chart.
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
      .attr("id", 'lotivis-plot-gradient-' + createIDFromDataset(dataset))
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");

    let data = dataset.data;
    let dataWithValues = dataset.dataWithValues;
    let count = dataWithValues.length;
    let latestDate = dataset.latestDate;
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

        let item = dataWithValues[index];
        let date = item.date;
        let opacity = item.value / max;

        let dateDifference = latestDate - date;
        let value = (dateDifference / duration);
        let datePercentage = (1 - value) * 100;

        gradient
          .append("stop")
          .attr("offset", `${datePercentage}%`)
          .attr("stop-color", this.colorGenerator(opacity));

      }
    }
  }
}
