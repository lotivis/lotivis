import * as d3 from "d3";
import { baseChart } from "./chart";
import { uniqueId } from "./common/identifiers";

/**
 * Reusable Tooltip API class that renders a
 * simple and configurable tooltip.
 *
 * @requires d3
 *
 * @example
 *
 * var tooltip = tooltip()
 *    .container(chart)
 *    .html("Hello World")
 *    .run();
 *
 */
export function tooltip() {
  let state = {
    // the id of the tooltip
    id: uniqueId("tooltip"),

    // the tooltips margin
    marginLeft: 0,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
  };

  let main = baseChart(state),
    container,
    div;

  // private
  function withPixels(value) {
    return typeof value === "string" && value.endsWith("px")
      ? value
      : value + "px";
  }

  // public api

  main.container = function (_container) {
    return arguments.length ? ((container = _container), main) : container;
  };

  main.html = function (_html) {
    if (!div) throw new Error("no div of tooltip");
    return arguments.length ? (div.html(_html), main) : div.attr("x");
  };

  main.show = function (html) {
    if (!div) throw new Error("no div of tooltip");
    return div.style("opacity", 1), main;
  };

  main.hide = function () {
    if (!div) throw new Error("no div of tooltip");
    return div.style("opacity", 0), main;
  };

  main.top = function (_top) {
    if (!div) throw new Error("no div of tooltip");
    if (!arguments.length) return div.style("top");
    div.style("top", withPixels(_top));
    return main;
  };

  main.left = function (_left) {
    if (!div) throw new Error("no div of tooltip");
    if (!arguments.length) return div.style("left");
    div.style("left", withPixels(_left));
    return main;
  };

  main.size = function () {
    if (!div) throw new Error("no div of tooltip");
    let domRect = div.node().getBoundingClientRect();
    return [domRect.width, domRect.height];
  };

  main.run = function () {
    // remove any previous rendered tooltip
    // if (div) div.remove();

    // render the div of the tooltip
    div = container
      .append("div")
      .attr("class", "ltv-tooltip")
      .style("opacity", 0);

    return main;
  };

  // return generated chart
  return main;
}
