import {extractLocationsFromDatasets} from "../data-juggle/dataset.extract";

/**
 *
 * @param datasets
 * @returns {{features: [], type: string}}
 */
export function createGeoJSON(datasets) {
  let locations = extractLocationsFromDatasets(datasets);
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

      let coordinates = [];

      coordinates.push([lat, lng]);
      coordinates.push([lat, lng + lngSpan]);
      coordinates.push([lat + latSpan, lng + lngSpan]);
      coordinates.push([lat + latSpan, lng]);
      coordinates.push([0, 0]);

      let feature = {
        type: 'Feature',
        id: location,
        properties: {
          id: location,
          code: location,
          location: location,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            coordinates
          ]
        }
      };

      features.push(feature);
    }
  }

  return {
    type: "FeatureCollection",
    features: features
  };
}
