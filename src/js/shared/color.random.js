import {Color} from "./color";

/**
 * Returns a randomly generated color.
 * @returns {string}
 */
Color.randomColor = function () {
  return "rgb(" +
    (Math.random() * 255) + ", " +
    (Math.random() * 255) + "," +
    (Math.random() * 255) + ")";
};
