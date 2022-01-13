import * as d3 from "d3";

export const colorScheme = d3.schemeCategory10;
export const tintColor = d3.color();

export class ColorGenerator {
  constructor(data) {
    let stacksToLabels = d3.group(
      data,
      (d) => d.stack,
      (d) => d.label
    );

    let stacks = Array.from(stacksToLabels.keys());

    function stackOf(label) {
      return data.find((d) => d.label == label).stack || label;
    }

    function stackLabels(stack) {
      return Array.from(stacksToLabels.get(stack).keys() || []);
    }

    function stackColor(stack) {
      return colorScheme[stacks.indexOf(stack) % colorScheme.length];
    }

    // let colorScheme = d3.schemeCategory10;

    let stackToColor = new Map();
    let labelToColor = new Map();
    for (let i = 0; i < stacks.length; i++) {
      let stack = stacks[i];
      let labels = stackLabels(stack);
      let c1 = d3.color(stackColor(stack));
      let c2 = c1.darker().darker();
      let generator = d3
        .scaleLinear()
        .domain([0, labels.length])
        .range([c1, c2]);

      stackToColor.set(stack, c1);

      for (let j = 0; j < labels.length; j++) {
        let label = labels[j];
        let color = generator(j);
        labelToColor.set(label, color);
      }
    }

    this.stack = function (stack) {
      return stackToColor.get(stack) || tintColor;
    };

    this.label = function (label) {
      return labelToColor.get(label) || tintColor;
    };

    this.stackColors = function (stack) {
      let c1 = d3.color(this.stack(stack));
      let c2 = c1.darker().darker();
      let size = stacksToLabels.get(stack).size;
      let generator = d3.scaleLinear().domain([0, size]).range([c1, c2]);
      let colors = d3.range(0, size).map(generator);
      return colors;
    };
  }
}

export function MapColors(till) {
  return d3
    .scaleLinear()
    .domain([0, (1 / 3) * till, (2 / 3) * till, till])
    .range(["yellow", "orange", "red", "purple"]);
}

export function plotColors(till) {
  return d3
    .scaleLinear()
    .domain([0, (1 / 3) * till, (2 / 3) * till, till])
    .range(["yellow", "orange", "red", "purple"]);
}

export default { ColorGenerator, MapColors: MapColors, plotColors };
