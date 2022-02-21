import * as topojsonServer from "topojson-server";
import * as topojsonClient from "topojson-client";
import { FeatureCollection, Feature } from "./geojson.js";

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
export function join(input) {
    let features = Array.isArray(input) ? input : input.features,
        topology = topojsonServer.topology(features),
        geometry = topojsonClient.merge(topology, extractObjects(topology));
    return FeatureCollection([Feature(geometry)]);
}
