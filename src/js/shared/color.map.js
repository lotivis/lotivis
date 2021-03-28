import {Color} from "./color";

Color.colorGenerator = function (till) {
  return d3
    .scaleLinear()
    .domain([0, 1 / 3 * till, 2 / 3 * till, till])
    .range(['yellow', 'orange', 'red', 'purple']);
};
