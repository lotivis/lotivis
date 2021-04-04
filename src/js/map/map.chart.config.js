import {hashCode} from "../shared/hash";
import {isValue} from "../shared/value";
import {LotivisConfig} from "../shared/config";

/**
 *
 * @type {{}}
 */
export const MapChartConfig = {
  width: 1000,
  height: 1000,
  margin: {
    top: LotivisConfig.defaultMargin,
    right: LotivisConfig.defaultMargin,
    bottom: LotivisConfig.defaultMargin,
    left: LotivisConfig.defaultMargin
  },
  isShowLabels: true,
  geoJSON: null,
  departmentsData: [],
  excludedFeatureCodes: [],
  drawRectangleAroundSelection: false,
  sendsNotifications: true,
  featureIDAccessor: function (feature) {
    if (feature.id || feature.id === 0) return feature.id;
    if (feature.properties && isValue(feature.properties.id)) return feature.properties.id;
    if (feature.properties && isValue(feature.properties.code)) return feature.properties.code;
    return hashCode(feature.properties);
  },
  featureNameAccessor: function (feature) {
    if (isValue(feature.name)) return feature.name;
    if (feature.properties && isValue(feature.properties.name)) return feature.properties.name;
    if (feature.properties && isValue(feature.properties.nom)) return feature.properties.nom;
    return LotivisConfig.unknown;
  }
};
