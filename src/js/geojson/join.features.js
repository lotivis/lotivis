import * as topojsonServer from "topojson-server";
import * as topojsonClient from "topojson-client";
import { FeatureCollection, Feature } from "./geojson";

/**
 * Return a newly created GeoJSON with one Feature merging
 * the border of all containing features of the given
 * collection of features.
 *
 * @param {*} input GeoJSON or array of features
 *
 * @returns A new created GeoJSON
 */
export function joinFeatures(input) {
  let features = Array.isArray(input) ? input : input.features;
  let topology = topojsonServer.topology(features);
  let objects = extractObjects(topology);
  let geometry = topojsonClient.merge(topology, objects);
  return FeatureCollection([Feature(geometry)]);
}

export function extractObjects(topology) {
  let objects = [];
  for (const topologyKey in topology.objects) {
    if (topology.objects.hasOwnProperty(topologyKey)) {
      objects.push(topology.objects[topologyKey]);
    }
  }
  return objects;
}
