import { DEFAULT_MARGIN } from "../common/config";
import { DEFAULT_NUMBER_FORMAT } from "../common/config";

export const BAR_CHART_TYPE = {
  stacks: "stacks",
  combine: "combine",
};

export const DATE_ACCESS = function (d) {
  return d;
};

export const BAR_CHART_CONFIG = {
  width: 1000,
  height: 600,
  margin: DEFAULT_MARGIN,
  type: "stacks",
  labels: false,
  selectable: true,
  dateAccess: DATE_ACCESS,
};
