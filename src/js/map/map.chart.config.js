import {hashCode} from "../shared/hash";
import {GlobalConfig} from "../shared/config";

/**
 *
 * @type {{}}
 */
export const defaultMapChartConfig = {
  width: 1000,
  height: 1000,
  margin: {
    top: GlobalConfig.defaultMargin,
    right: GlobalConfig.defaultMargin,
    bottom: GlobalConfig.defaultMargin,
    left: GlobalConfig.defaultMargin
  },
  isShowLabels: true,
  geoJSON: null,
  departmentsData: [],
  excludedFeatureCodes: [],
  drawRectangleAroundSelection: false,
  featureIDAccessor: function (feature) {
    if (feature.id) return feature.id;
    if (feature.properties && feature.properties.id) return feature.properties.id;
    if (feature.properties && feature.properties.code) return feature.properties.code;
    return hashCode(feature.properties);
  },
  featureNameAccessor: function (feature) {
    if (feature.name) return feature.name;
    if (feature.properties && feature.properties.name) return feature.properties.name;
    if (feature.properties && feature.properties.nom) return feature.properties.nom;
    return 'Unknown';
  }
};
