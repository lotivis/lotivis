import {Constants} from "../shared/constants";
import {PlotChartSort} from "./plot.chart.sort";

export const defaultPlotChartConfig = {
  width: 1000,
  height: 600,
  margin: {
    top: Constants.defaultMargin,
    right: Constants.defaultMargin,
    bottom: Constants.defaultMargin,
    left: Constants.defaultMargin
  },
  lineHeight: 28,
  radius: 23,
  isShowLabels: true,
  drawGrid: true,
  showTooltip: true,
  lowColor: 'rgb(184, 233, 148)',
  highColor: 'rgb(0, 122, 255)',
  sort: PlotChartSort.duration
};
