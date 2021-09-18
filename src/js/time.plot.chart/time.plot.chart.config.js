import {TimePlotChartSort} from "./time.plot.chart.sort";
import {LotivisConfig} from "../shared/config";

export const defaultPlotChartConfig = {
  width: 1000,
  height: 600,
  margin: {
    top: LotivisConfig.defaultMargin,
    right: LotivisConfig.defaultMargin,
    bottom: LotivisConfig.defaultMargin,
    left: LotivisConfig.defaultMargin
  },
  lineHeight: 28,
  radius: 23,
  showLabels: true,
  drawGrid: true,
  showTooltip: true,
  lowColor: 'rgb(184, 233, 148)',
  highColor: 'rgb(0, 122, 255)',
  sort: TimePlotChartSort.none,
  numberFormat: Intl.NumberFormat('de-DE', {
    maximumFractionDigits: 3
  }),
};
