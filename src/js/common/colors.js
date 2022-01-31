import * as d3 from "d3";

function darker(color) {
  return color.darker().darker();
}

function random(till) {
  return Math.floor(Math.random() * till);
}

// constants

/**
 * The default colors used by lotivis.
 */
export const DATA_COLORS = []
  .concat(d3.schemeTableau10)
  .concat(d3.schemeCategory10)
  .concat(d3.schemeDark2);

/**
 * The default tint color used by lotivis.
 */
export const TINT_COLOR = DATA_COLORS[0];

/**
 * The default random colors.
 */
export const DATA_COLORS_RANDOM = (() => {
  let cs = Array.from(DATA_COLORS),
    n = [];
  while (cs.length > 0) n.push(cs.splice(random(cs.length), 1));
  return n;
})();

export class ColorGenerator {
  constructor(data) {
    let dataColors = DATA_COLORS,
      stackToColor,
      labelToColor;

    function initialize() {
      stackToColor = new Map();
      labelToColor = new Map();

      let stacksToLabels = d3.group(
        data,
        (d) => d.stack || d.label,
        (d) => d.label
      );

      let stacks = Array.from(stacksToLabels.keys());

      function stackLabels(stack) {
        return Array.from((stacksToLabels.get(stack) || []).keys());
      }

      function stackColor(stack) {
        return dataColors[stacks.indexOf(stack) % dataColors.length];
      }

      stacks.forEach((stack) => {
        let labels = stackLabels(stack);
        let c1 = d3.color(stackColor(stack));
        let colors = ColorScale(labels.length, [c1, darker(c1)]);

        stackToColor.set(stack, c1);

        labels.forEach((label, index) => {
          labelToColor.set(label, colors(index));
        });
      });
    }

    // public api

    /**
     * Returns the color for the given stack.
     *
     * @param {stack} stack The stack
     * @returns The d3.color for the stack
     * @public
     */
    this.stack = function (stack) {
      return stackToColor ? stackToColor.get(stack) || TINT_COLOR : TINT_COLOR;
    };

    /**
     * Returns the color for the given label.
     *
     * @param {label} label The label
     * @returns The d3.color for the label
     * @public
     */
    this.label = function (label) {
      return labelToColor ? labelToColor.get(label) || TINT_COLOR : TINT_COLOR;
    };

    initialize();
  }
}

export function MapColors(max) {
  return d3
    .scaleLinear()
    .domain([0, (1 / 3) * max, (2 / 3) * max, max])
    .range(["yellow", "orange", "red", "purple"]);
}

export function PlotColors(max) {
  return ColorScale(max, ["yellow", "orange", "red", "purple"]);
}

export function ColorScale(max, colors) {
  return d3
    .scaleLinear()
    .domain(colors.map((c, i) => (i / (colors.length - 1)) * max))
    .range(colors);
}
