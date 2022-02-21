import * as d3 from "d3";
import { attributable } from "./common/attributable.js";
import { uniqueId } from "./common/identifiers.js";
import { ltv_debug } from "./common/config.js";
import { pngDownload } from "./common/download.js";
import { Events } from "./common/events.js";

export function baseChart(state) {
    if (!state) throw new Error("no state passed");

    // Private attributes
    var chart = {},
        calc = {},
        state = state,
        disp = d3.dispatch("willRender", "didRender");

    if (!state.id) state.id = uniqueId("chart");
    if (!state.selector) state.selector = "body";
    if (!state.debug) state.debug = false;

    attributable(chart, state);

    // private

    function filterWillChange(filterName, action, item) {
        ltv_debug("filterWillChange");
    }

    function filterDidChange(filterName, action, item) {
        ltv_debug("filterDidChange", this);
        if (this === chart) return ltv_debug(chart.id(), "is sender");
        if (chart.skipFilterUpdate(filterName, action, item))
            return ltv_debug(chart.id(), "skip filter update", filterName);
    }

    function filterUpdate(sender, filterName, action, item) {
        if (chart === sender) return ltv_debug(chart.id(), "is sender");
        if (chart.skipFilterUpdate(filterName, action, item))
            return ltv_debug(chart.id(), "skip filter update", filterName);

        return chart.run();

        // if (!isString(state.selector))
        //   throw new Error("invalid selector: " + state.selector);

        // var selector = state.selector;
        // var selection = d3.selectAll(selector);

        // selection.each(function scope() {
        //   // Receive container
        //   var container = d3.select(this);
        //   if (typeof chart.update === "function")
        //     chart.update(container, state, calc);
        // });
    }

    function rerender() {}

    // public
    chart.on = function (name, callback) {
        disp.on(name, callback);
    };

    chart.call = function (name, ...args) {
        disp.call(name, this, ...args);
    };

    // Define state getter and setter function
    chart.state = function (_) {
        return arguments.length ? (Object.assign(state, _), this) : state;
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
        return state.id;
    };

    /**
     * Generates and downloads a PNG.
     */
    chart.pngDownload = function (callback) {
        if (!state.dataController) throw new Error("no data controller");
        if (!state.id) throw new Error("no id");
        if (!state.selector) throw new Error("no selector");

        let type = state.id.split("-")[1];
        let filename = state.dataController.filename(".png", type);

        pngDownload(state.selector, filename, callback);
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
        if (!arguments.length) return state.dataController;

        // remove callback from existing controller
        if (state.dataController)
            state.dataController.onFilter(chart.id(), null);

        state.dataController = dc;
        state.dataController.onFilter(chart.id(), filterUpdate);

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
                left: state.marginLeft,
                top: state.marginTop,
                right: state.marginRight,
                bottom: state.marginBottom,
            };
        }
        if (_ && _["left"]) this.state({ marginLeft: _["left"] });
        if (_ && _["top"]) this.state({ marginTop: _["top"] });
        if (_ && _["right"]) this.state({ marginRight: _["right"] });
        if (_ && _["bottom"]) this.state({ marginBottom: _["bottom"] });
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
        else dc = state.dataController;

        if (!state.selector) throw new Error("no selector");
        if (!dc) throw new Error("no data controller");

        let selection = d3.selectAll(state.selector);
        if (selection.size() === 0)
            throw new Error("empty selection: " + state.selector);

        let dv = chart.dataView(dc);

        selection.each(function scope() {
            // receive container
            let container = d3.select(this);

            disp.call("willRender", chart, dv, calc);
            chart.clear(container, calc, dv);
            chart.render(container, calc, dv);
            disp.call("didRender", chart, dv, calc);
        });

        return chart;
    };

    Events.on("filter-will-change." + chart.id(), filterWillChange);
    Events.on("filter-did-change." + chart.id(), filterDidChange);

    // return generated chart
    return chart;
}
