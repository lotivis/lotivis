import { DEFAULT_MARGIN, DEFAULT_NUMBER_FORMAT } from "../common/config";

/**
 * Enumeration of available style types of a plot chart.
 */
export const PLOT_CHART_TYPE = {
  gradient: "gradient",
  fraction: "fraction",
};

/**
 * Enumeration of sorts available in the bar.chart.plot.chart chart.
 */
export const PLOT_CHART_SORT = {
  none: "none",
  alphabetically: "alphabetically",
  duration: "duration",
  intensity: "intensity",
  firstDate: "firstDate",
};

export const PLOT_CHART_CONFIG = {
  width: 1000,
  height: 600,
  margin: DEFAULT_MARGIN,
  lineHeight: 28,
  barHeight: 30,
  radius: 23,
  labels: true,
  drawGrid: true,
  showTooltip: true,
  selectable: true,
  sort: PLOT_CHART_SORT.none,
  type: PLOT_CHART_TYPE.gradient,
  numberFormat: DEFAULT_NUMBER_FORMAT,
};
