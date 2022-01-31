import * as d3 from "d3";
import { isFunction, isString } from "./common/values";
import { uniqueId } from "./common/identifiers.js";

export function baseChart(state) {
  if (!state) throw new Error("no state passed");

  // Private attributes
  var chart = {},
    calc = {},
    disp = d3.dispatch("sel"),
    state = state;

  if (!state.id) state.id = uniqueId("chart");
  if (!state.selector) state.selector = "body";
  if (!state.debug) state.debug = false;

  // Iterate state keys and create access function for each
  Object.keys(state).forEach((key) => {
    // do not override existing functions
    if (chart[key] && isFunction(chart[key])) return;
    chart[key] = function (_) {
      return arguments.length ? ((state[key] = _), this) : state[key];
    };
  });

  // public

  /**
   * Return the property for the given name if it exists, else
   * the given fallback value.
   *
   * @param {string} name The name of the requested property
   * @param {any} fb The fallback value
   *
   * @returns The property for the given name or the fallback.
   */
  state.get = function (name, fb) {
    return state.hasOwnProperty(name) ? state[name] || fb : fb;
  };

  // private

  function filterUpdate(filterName, item, sender) {
    console.log("filterUpdate", item, sender.id());

    if (chart === sender) return;
    if (!chart.handleFilterName(filterName)) return;

    if (!isString(state.selector))
      throw new Error("invalid selector: " + state.selector);

    var selector = state.selector;
    var selection = d3.selectAll(selector);

    selection.each(function scope() {
      // Receive container
      var container = d3.select(this);
      if (typeof chart.update === "function")
        chart.update(container, state, calc);
    });
  }

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

  chart.handleFilterName = function (filterName) {
    return true;
  };

  /**
   * Returns the chart's id.
   * @returns {string} The chart's id.
   * @public
   */
  chart.id = function () {
    return state.id;
  };

  /**
   * Gets or sets the data controller.
   *
   * @param {dataController} _ The data controller
   * @returns {dataController || this} The data controller or the chart itself
   */
  chart.dataController = function (_) {
    if (!arguments.length) return state.dataController;
    let name = "filter." + chart.id();

    if (state.dataController) state.dataController.on(name, null);

    state.dataController = _;
    state.dataController.on(name, filterUpdate);

    return chart;
  };

  // syntatic sugar

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
    if (state.debug === true) console.log("dv", dv);

    selection.each(function scope() {
      // receive container
      let container = d3.select(this);
      chart.clear(container, calc, dv);
      chart.render(container, calc, dv);
    });

    return chart;
  };

  // return generated chart
  return chart;
}
