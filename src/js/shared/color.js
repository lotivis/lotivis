/**
 * Color defined by r,g,b.
 * @class Color
 */
export class Color {
  /**
   * Creates a new instance of Color.
   * @param r The red value.
   * @param g The green value.
   * @param b The blue value.
   */
  constructor(r, g, b) {
    this.r = Math.round(r);
    this.g = Math.round(g);
    this.b = Math.round(b);
  }

  rgbString() {
    return `rgb(${this.r},${this.g},${this.b})`;
  }

  toString() {
    return this.rgbString();
  }

  colorAdding(r, g, b) {
    return new Color(this.r + r, this.g + g, this.b + b);
  }
}



