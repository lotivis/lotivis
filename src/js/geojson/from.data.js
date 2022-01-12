import * as d3 from "d3";
import flat from "../data/flat";
import { FeatureCollection } from "./geojson";

export function createGeoJSON(data) {
  let flatData = data; // flat(datasets);
  let locations = flatData.locations();
  let rowsCount = Math.ceil(locations.length / 5);
  let latSpan = 0.1;
  let lngSpan = 0.1;
  let features = [];

  loop1: for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
    for (let itemIndex = 0; itemIndex < 5; itemIndex++) {
      if (locations.length === 0) break loop1;

      let location = locations.shift();
      let lat = (itemIndex + 1) * latSpan;
      let lng = (rowIndex + 1) * -lngSpan;

      // start down left, counterclockwise
      let coordinates = [];
      coordinates.push([lat + latSpan, lng + lngSpan]);
      coordinates.push([lat + latSpan, lng]);
      coordinates.push([lat, lng]);
      coordinates.push([lat, lng + lngSpan]);
      coordinates.push([lat + latSpan, lng + lngSpan]);

      let feature = {
        type: "Feature",
        id: location,
        properties: {
          id: location,
          code: location,
          location: location,
        },
        geometry: {
          type: "Polygon",
          coordinates: [coordinates],
        },
      };

      features.push(feature);
    }
  }

  let result = FeatureCollection(features);

  console.log("geoJSON", result);

  return result;
}
