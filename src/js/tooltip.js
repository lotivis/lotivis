import * as d3 from "d3";
import { ltv_chart } from "./common/lotivis.chart";
import { uniqueId } from "./common/create.id";
import "./common/d3selection.js";

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
  let ltvId = uniqueId("legend"),
    marginLeft = 0,
    marginTop = 0,
    marginRight = 0,
    marginBottom = 0,
    container,
    div;

  var main = ltv_chart({});

  main.run = function () {
    // remove any previous rendered tooltip
    if (div) div.remove();

    // render the div of the tooltip
    div = container
      .append("div")
      .attr("class", "ltv-tooltip")
      .style("opacity", 0);

    return main;
  };

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

  // auxiliary
  function withPixels(value) {
    return typeof value === "string" && value.endsWith("px")
      ? value
      : value + "px";
  }

  // return generated chart
  return main;
}
