import * as topojsonServer from "topojson-server";
import * as topojsonClient from "topojson-client";

/**
 * Returns a new created instance of Feature combining the given Features.
 * @param features
 */
export function joinFeatures(features) {
  let topology = topojsonServer.topology(features);
  let objects = extractObjects(topology);

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: topojsonClient.merge(topology, objects),
        properties: {
          code: 1,
          nom: "asdf"
        }
      }
    ]
  };
}

/**
 *
 * @param topology
 * @returns {[]}
 */
export function extractObjects(topology) {
  let objects = [];
  for (const topologyKey in topology.objects) {
    if (topology.objects.hasOwnProperty(topologyKey)) {
      objects.push(topology.objects[topologyKey]);
    }
  }
  return objects;
}
