/**
 * @class Geometry
 */
export class Geometry {

  /**
   * Creates a new instance of Geometry.
   *
   * @param source
   */
  constructor(source) {
    this.type = source.type;
    this.coordinates = source.coordinates;
  }
}
