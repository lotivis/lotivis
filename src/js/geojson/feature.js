import {Geometry} from "./geometry";

/**
 *
 * @class Feature
 */
export class Feature {

  constructor(source) {
    this.type = source.type;
    this.properties = source.properties;
    this.geometry = new Geometry(source.geometry);
  }
}
