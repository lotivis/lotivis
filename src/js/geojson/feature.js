import {Geometry} from "./geojson";

export class Feature {

  constructor(source) {
    this.type = source.type;
    this.properties = source.properties;
    this.geometry = new Geometry(source.geometry);
  }
}
