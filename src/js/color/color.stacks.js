import {Color} from "./color";
import {d3LibraryAccess} from "../shared/d3libaccess";
import './color.defaults';

/**
 * Returns a randomly generated color.
 * @returns {[]}
 */
Color.colorsForStack = function (stackNumber, amount = 1) {
  let colorCouple = Color.stackColors[stackNumber % Color.stackColors.length];
  let colorGenerator = d3LibraryAccess
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


