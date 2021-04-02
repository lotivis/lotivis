import {Color} from "./color";

/**
 * Returns a randomly generated color.
 * @returns {[]}
 */
Color.colorsForStack = function (stackNumber, amount) {
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


