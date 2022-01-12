import { hash_obj } from "../common/hash";
import { isValue } from "../common/is.value.js";
import { DEFAULT_MARGIN } from "../common/config";

export const FEATURE_ID_ACCESSOR = function (f) {
  if (f.id || f.id === 0) return f.id;
  if (f.properties && isValue(f.properties.id)) return f.properties.id;
  if (f.properties && isValue(f.properties.code)) return f.properties.code;
  return f.properties ? hash_obj(f.properties) : hash_obj(f);
};

export const FEATURE_NAME_ACCESSOR = function (f) {
  if (isValue(f.name)) return f.name;
  if (f.properties && isValue(f.properties.name)) return f.properties.name;
  if (f.properties && isValue(f.properties.nom)) return f.properties.nom;
  return FEATURE_ID_ACCESSOR(f);
};

export const MAP_CHART_CONFIG = {
  width: 1000,
  height: 1000,
  margin: DEFAULT_MARGIN,
  isShowLabels: true,
  geoJSON: null,
  departementsData: [],
  excludedFeatureCodes: [],
  drawRectangleAroundSelection: true,
  selectable: true,
  featureIDAccessor: FEATURE_ID_ACCESSOR,
  featureNameAccessor: FEATURE_NAME_ACCESSOR,
};
