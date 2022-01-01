import * as d3 from "d3";

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
    if ((r || r === 0) && (g || g === 0) && (b || b === 0)) {
      this.initialize(r, g, b);
    } else if (typeof r === `object`) {
      this.initialize(r.r, r.g, r.b);
    } else if (r) {
    } else if (r) {
      this.initialize(r, r, r);
    } else {
      throw new Error(`Invalid argument: ${r}`);
    }
  }

  initialize(r, g, b) {
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

  // MARK: - Statics

  static mapColors(till) {
    return d3
      .scaleLinear()
      .domain([0, (1 / 3) * till, (2 / 3) * till, till])
      .range(["yellow", "orange", "red", "purple"]);
  }

  static plotColor(till) {
    return Color.mapColors(till);
    // return d3
    //   .scaleLinear()
    //   .domain([0, 1 / 2 * till, till])
    //   .range(['lightgreen', 'steelblue', 'purple']);
  }
}

/**
 * Returns a randomly generated shared.color.
 * @returns {[]}
 */
Color.colorsForStack = function (stackNumber, amount = 1) {
  let colorCouple = Color.stackColors[stackNumber % Color.stackColors.length];
  let colorGenerator = d3
    .scaleLinear()
    .domain([0, amount])
    .range([colorCouple[0], colorCouple[1]]);

  let colors = [];
  for (let i = 0; i < amount; i++) {
    let color = colorGenerator(i);
    colors.push(new Color(color));
  }

  return colors;
};

// MARK: - Defaults

Color.defaultTint = new Color(0, 122, 255);
Color.organgeLow = new Color(250, 211, 144);
Color.organgeHigh = new Color(229, 142, 38);
Color.redLow = new Color(248, 194, 145);
Color.redHigh = new Color(183, 21, 64);
Color.blueLow = new Color(106, 137, 204);
Color.blueHigh = new Color(12, 36, 97);
Color.lightBlueLow = new Color(130, 204, 221);
Color.lightBlueHight = new Color(10, 61, 98);
Color.greenLow = new Color(184, 233, 148);
Color.greenHight = new Color(7, 153, 146);
Color.stackColors = [
  [Color.blueHigh, Color.blueLow],
  [Color.redHigh, Color.redLow],
  [Color.greenHight, Color.greenLow],
  [Color.organgeHigh, Color.organgeLow],
  [Color.lightBlueHight, Color.lightBlueLow],
];
