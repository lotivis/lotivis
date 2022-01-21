import { copy } from "../common/copy.js";
import { FEATURE_ID_ACCESSOR } from "../map/map.chart.config.js";

/* returns a new generated GeoJSON without the feature specified */
export function filterFeatures(json, ids, idValue = FEATURE_ID_ACCESSOR) {
  if (!Array.isArray(ids)) throw new Error("invalid ids. not an array");
  if (!Array.isArray(json.features))
    throw new Error("invalid geojson. no features");
  let _json = copy(json);
  _json.features = _json.features.filter((f) => ids.includes(idValue(f)));
  return _json;
}
