import { Data } from "../data/flat.data";
import { Feature, FeatureCollection, Geometry, GeoJSON } from "./geojson";

export function createGeoJSON(data) {
  // console.log("data", data);
  // console.log("typeof data", typeof data);
  // console.log("data instanceof Data", data instanceof Data);
  // if (!(data instanceof Data)) throw new Error("no data object given");
  let locations = data.locations();
  let columns = 5;
  let rows = Math.ceil(locations.length / columns);
  let span = 0.1;
  let features = [];

  loop1: for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      if (locations.length === 0) break loop1;

      let location = locations.shift();
      let lat = (column + 1) * span;
      let lng = (row + 1) * -span;

      // start down left, counterclockwise
      let coord = [
        [lat + span, lng + span],
        [lat + span, lng],
        [lat, lng],
        [lat, lng + span],
        [lat + span, lng + span],
      ];

      let geometry = Geometry("Polygon", [coord]);
      let feature = Feature(geometry, { id: location, name: location });
      feature.id = location;
      features.push(feature);
    }
  }

  return GeoJSON(FeatureCollection(features));
}
