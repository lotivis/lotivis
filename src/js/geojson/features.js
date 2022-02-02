import * as topojsonServer from "topojson-server";
import * as topojsonClient from "topojson-client";
import { FeatureCollection, Feature } from "./geojson";
import { FEATURE_ID_ACCESSOR } from "./feature.accessors";
import { copy } from "../common/values";

function extractObjects(topology) {
  let objects = [];
  for (const topologyKey in topology.objects) {
    if (topology.objects.hasOwnProperty(topologyKey)) {
      objects.push(topology.objects[topologyKey]);
    }
  }
  return objects;
}

/**
 * Returns a newly created GeoJSON with exactly one Feature
 * merging the border of all containing features of the given
 * collection of features.
 *
 * @param {GeoJSON | Array<Feature>} input GeoJSON or array of features
 * @returns A new created GeoJSON
 */
export function joinFeatures(input) {
  let features = Array.isArray(input) ? input : input.features;
  let topology = topojsonServer.topology(features);
  let objects = extractObjects(topology);
  let geometry = topojsonClient.merge(topology, objects);
  return FeatureCollection([Feature(geometry)]);
}

function geojsonCopy(json, ids, featuresFilter) {
  if (!Array.isArray(ids)) throw new Error("invalid ids. not an array");
  if (!Array.isArray(json.features))
    throw new Error("invalid geojson. no features");
  let theCopy = copy(json);
  theCopy.features = theCopy.features.filter(featuresFilter);
  return theCopy;
}

/**
 * Returns a new generated GeoJSON without the Feature having the ids
 * specified.
 *
 * @param {GeoJSON} json The GeoJSON with Features to remove
 * @param {Array} ids The ids of Features to remove
 * @param {*} idValue An id accessor for the Features
 * @returns {GeoJSON} The new generated GeoJSON
 */
export function removeFeatures(json, ids, idValue = FEATURE_ID_ACCESSOR) {
  return geojsonCopy(json, ids, (f) => !ids.includes(idValue(f)));
}

/**
 * Returns a new generated GeoJSON containing only the Features having the
 * ids specified.
 *
 * @param {GeoJSON} json The GeoJSON with Features to remove
 * @param {Array} ids The ids of Features to remove
 * @param {*} idValue An id accessor for the Features
 * @returns {GeoJSON} The new generated GeoJSON
 */
export function filterFeatures(json, ids, idValue = FEATURE_ID_ACCESSOR) {
  return geojsonCopy(json, ids, (f) => ids.includes(idValue(f)));
}
