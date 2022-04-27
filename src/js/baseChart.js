import * as d3 from "d3";
import { attributable } from "./common/attributable.js";
import { uniqueId } from "./common/identifiers.js";
import { ltv_debug } from "./common/config.js";
import { pngDownload } from "./common/download.js";
import { Events } from "./common/events.js";

export function baseChart(attr) {
    if (!attr) throw new Error("no attr passed");

    // private attributes
    let chart = {};

    // create `id` atrribute in case its not exising
    if (!attr.id) attr.id = uniqueId("chart");

    // create `selector` atrribute with default value "body" (if not existing)
    if (!attr.selector) attr.selector = "body";

    // create `debug` atrribute with default value `false` (if not existing)
    if (!attr.debug) attr.debug = false;

    // expose atrributes as getter-setter functions
    attributable(chart, attr);

    // private

    function filterWillChange(filterName, action, item) {
        ltv_debug("filterWillChange");
    }

    function filterDidChange(filterName, action, item) {
        ltv_debug("filterDidChange", this);
        if (this === chart) return ltv_debug(attr.id, "is sender");
        if (chart.skipFilterUpdate(filterName, action, item))
            return ltv_debug(attr.id, "skip filter update", filterName);
    }

    function filterUpdate(sender, filterName, action, item) {
        if (chart === sender) return ltv_debug(attr.id, "is sender");
        if (chart.skipFilterUpdate(filterName, action, item))
            return ltv_debug(attr.id, "skip filter update", filterName);
        return chart.run();
    }

    // public
    // chart.on = function (name, callback) {
    //     disp.on(name, callback);
    // };

    // chart.call = function (name, ...args) {
    //     disp.call(name, this, ...args);
    // };

    // Define attr getter and setter function
    chart.attr = function (_) {
        return arguments.length ? (Object.assign(attr, _), this) : attr;
    };

    /**
     * Returns whether this chart should rerender for a change of the
     * passed filter name.
     * @param {String} filter The filter that has changed
     * @param {String} action The filter action
     * @param {String} action The item that was involed (optional)
     * @returns {Boolean} Whether to handle the filter change
     */
    chart.skipFilterUpdate = function (filter, action, item) {
        return false;
    };

    /**
     * Returns the chart id.
     * @returns {string} The chart id.
     * @public
     */
    chart.id = function () {
        return attr.id;
    };

    /**
     * Generates and downloads a PNG.
     */
    chart.pngDownload = function (callback) {
        if (!attr.dataController) throw new Error("no data controller");
        if (!attr.id) throw new Error("no id");
        if (!attr.selector) throw new Error("no selector");

        let type = attr.id.split("-")[1];
        let filename = attr.dataController.filename(".png", type);

        pngDownload(attr.selector, filename, callback);
    };

    chart.svgDownload = function (callback) {
        ltv_debug("svgDownload() not implemented");
    };

    /**
     * Gets or sets the data controller.
     *
     * @param {dataController} dc The data controller
     * @returns {dataController || this} The data controller or the chart itself
     */
    chart.dataController = function (dc) {
        if (!arguments.length) return attr.dataController;

        // remove callback from existing controller
        if (attr.dataController) {
            attr.dataController.onFilter(chart.id(), null);
        }

        attr.dataController = dc;

        if (attr.dataController) {
            attr.dataController.onFilter(chart.id(), filterUpdate);
        }

        return chart;
    };

    /**
     * Gets or sets a margins object of the chart.
     *
     * @param {*} _ The object with margins to set
     * @returns {margins | this} The margins object or the chart itself
     */
    chart.margin = function (_) {
        if (!arguments.length) {
            return {
                left: attr.marginLeft,
                top: attr.marginTop,
                right: attr.marginRight,
                bottom: attr.marginBottom,
            };
        }
        if (_ && _["left"]) this.attr({ marginLeft: _["left"] });
        if (_ && _["top"]) this.attr({ marginTop: _["top"] });
        if (_ && _["right"]) this.attr({ marginRight: _["right"] });
        if (_ && _["bottom"]) this.attr({ marginBottom: _["bottom"] });
        return chart;
    };

    // life cycle

    /**
     * Calculates and returns the data view for a bar chart from
     * the passed data controller.
     *
     * @param {dc} dc The data controller
     * @returns {DataView} dv The calculated data view
     */
    chart.dataView = function (dc) {
        return {};
    };

    /**
     * Clears the content of the passed container. May be overriden
     * by extending charts. Default implementation selects and
     * removes everything from the conainter.
     *
     * @param {d3.Selection} container The selected container
     * @param {*} calc The calc obj
     * @param {*} dv The data view
     * @returns {this} The chart itself (chainable)
     */
    chart.clear = function (container, calc, dv) {
        return container.selectAll("*").remove(), this;
    };

    /**
     * Renders the chart in the passed container. *Should* be overriden
     * by extending charts. Default implementation does nothing and only
     * returns the chart itself.
     *
     * @param {d3.Selection} container The selected container
     * @param {*} calc The calc obj
     * @param {*} dv The data view
     * @returns {this} The chart itself (chainable)
     */
    chart.render = function (container, calc, dv) {
        return this;
    };

    /**
     * Runs the render chain. For each selected element by the selector
     * of the chart.
     *
     * @param {dc} dc A (optional) data controller
     * @returns {this} The chart itself (chainable)
     */
    chart.run = function (dc) {
        if (dc) chart.dataController(dc);
        else dc = attr.dataController;

        if (!attr.selector) throw new Error("no selector");
        if (!dc) throw new Error("no data controller");

        let selection = d3.selectAll(attr.selector);
        if (selection.size() === 0)
            throw new Error("empty selection: " + attr.selector);

        console.time("dataView " + attr.id);
        let dv = chart.dataView(dc);
        console.timeEnd("dataView " + attr.id);

        selection.each(function scope() {
            // receive container
            let container = d3.select(this),
                calc = {};

            chart.clear(container, calc, dv);
            chart.render(container, calc, dv);
        });

        return chart;
    };

    Events.on("filter-will-change." + chart.id(), filterWillChange);
    Events.on("filter-did-change." + chart.id(), filterDidChange);

    // return generated chart
    return chart;
}
