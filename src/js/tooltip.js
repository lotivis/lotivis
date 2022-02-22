import { uniqueId } from "./common/identifiers.js";
import { attributable } from "./common/attributable.js";
import { postfix } from "./common/helpers.js";

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
    let main = {},
        div;

    attributable(main, {
        // the id of the tooltip
        id: uniqueId("tooltip"),

        // the tooltips margin
        marginLeft: 0,
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,

        // a container to render the tooltip in
        container: null,
    });

    // private

    function require(div) {
        if (typeof div !== "object") throw new Error("invalid div");
        return div;
    }

    // public api

    /**
     * Shows the tooltip by setting the opacity to 1.
     * @returnss {tooltip} The tooltip itself
     */
    main.show = function () {
        return require(div).classed("ltv-tooltip-show", true), main;
    };

    /**
     * Hides the tooltip by setting the opacity to 0.
     * @returns {tooltip} The tooltip itself
     */
    main.hide = function () {
        return require(div).classed("ltv-tooltip-show", false), main;
    };

    /**
     * Gets or sets the top in pixels.
     * @param {*} _top
     * @returns {String|tooltip}
     */
    main.top = function (_top) {
        return arguments.length
            ? (require(div).style("top", postfix(_top, "px")), main)
            : require(div).style("top");
    };

    /**
     * Gets or sets the left in pixels.
     * @param {*} _left
     * @returns {String|tooltip}
     */
    main.left = function (_left) {
        return arguments.length
            ? (require(div).style("left", postfix(_left, "px")), main)
            : require(div).style("left");
    };

    /**
     * Gets or sets the HTML content of the div container.
     * @param {String} _html The new HTML to set
     * @returns {String|tooltip}
     */
    main.html = function (_html) {
        return arguments.length
            ? (require(div).html(_html), main)
            : require(div).html();
    };

    /**
     * Gets or sets the left in pixels.
     * @param {*} _div
     * @returns {div|tooltip}
     */
    main.div = function (_div) {
        return arguments.length ? ((div = _div), main) : div;
    };

    /**
     * Gets the size of the tooltip.
     * @returns The size
     */
    main.size = function () {
        let domRect = require(div).node().getBoundingClientRect();
        return [domRect.width, domRect.height];
    };

    /**
     * Renders the tooltip.
     * @returns The tooltip itself.
     */
    main.run = function () {
        // render the div of the tooltip
        div = main.container().append("div").classed("ltv-tooltip", true);

        return main;
    };

    // return generated chart
    return main;
}
