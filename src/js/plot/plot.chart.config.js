import {PlotChartSort} from "./plot.chart.sort";
import {GlobalConfig} from "../shared/config";

export const defaultPlotChartConfig = {
  width: 1000,
  height: 600,
  margin: {
    top: GlobalConfig.defaultMargin,
    right: GlobalConfig.defaultMargin,
    bottom: GlobalConfig.defaultMargin,
    left: GlobalConfig.defaultMargin
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
