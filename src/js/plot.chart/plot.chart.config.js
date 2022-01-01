import { LotivisConfig } from "../shared/config";

/**
 * Enumeration of available style types of a plot chart.
 */
export const PlotChartType = {
  gradient: "gradient",
  fraction: "fraction"
};

/**
 * Enumeration of sorts available in the date.chart.plot.chart chart.
 */
export const PlotChartSort = {
  none: "none",
  alphabetically: "alphabetically",
  duration: "duration",
  intensity: "intensity",
  firstDate: "firstDate"
};

/**
 *
 * @type {{margin: {top: number, left: number, bottom: number, right: number}, highColor: string, showTooltip: boolean, lowColor: string, sort: string, type: string, showLabels: boolean, numberFormat: Intl.NumberFormat, width: number, lineHeight: number, drawGrid: boolean, radius: number, height: number}}
 */
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
  sendsNotifications: true,
  lowColor: "rgb(184, 233, 148)",
  highColor: "rgb(0, 122, 255)",
  sort: PlotChartSort.none,
  type: PlotChartType.gradient,
  numberFormat: Intl.NumberFormat("de-DE", {
    maximumFractionDigits: 3
  })
};
