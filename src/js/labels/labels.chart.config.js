import { LOTIVIS_CONFIG } from "../common/config";

export const LABELS_CHART_STYLE = {
  flowing: "flowing",
  grouped: "grouped",
};

export const LABELS_CHART_CONFIG = {
  margin: {
    top: 0,
    right: LOTIVIS_CONFIG.defaultMargin,
    bottom: 0,
    left: LOTIVIS_CONFIG.defaultMargin,
  },
  selectable: true,
  headlines: false,
  style: LABELS_CHART_STYLE.flowing,
};
