import * as topojsonServer from "topojson-server";
import * as topojsonClient from "topojson-client";
import { FeatureCollection, Feature } from "./geojson";

export function joinFeatures(features) {
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
