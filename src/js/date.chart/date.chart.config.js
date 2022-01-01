import { LotivisConfig } from "../shared/config";
import { Color } from "../shared/color";

export const DATE_CHART_CONFIG = {
  width: 1000,
  height: 600,
  margin: {
    top: LotivisConfig.defaultMargin,
    right: LotivisConfig.defaultMargin,
    bottom: LotivisConfig.defaultMargin,
    left: LotivisConfig.defaultMargin,
  },
  showLabels: false,
  combineStacks: false,
  sendsNotifications: true,
  labelColor: new Color(155, 155, 155),
  numberFormat: Intl.NumberFormat("de-DE", {
    maximumFractionDigits: 3,
  }),
  dateAccess: function (date) {
    return Date.parse(date);
  },
};
