import * as d3 from "d3";
import { uniqueId } from "./create.id";
import { EventEmitter } from "./event.emitter";
import { State } from "./statefull.js";

export function ltv_chart(_state) {
  if (!_state) throw new Error("no state passed");

  // Private attributes
  var chart = {},
    calc = {},
    disp = d3.dispatch("sel"),
    state = Object.assign(_state, { id: uniqueId("chart"), selector: "body" });

  // Iterate state keys and create access function for each
  Object.keys(state).forEach((key) => {
    // do not override existing functions
    if (chart[key] && typeof chart[key] === "function") return;
    chart[key] = function (_) {
      return arguments.length ? ((state[key] = _), this) : state[key];
    };
  });

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

  /**
   * Return the property for the given name if it exists. Throws
   * an Error if the property doesnt exists.
   *
   * @param {string} name The name of the requested property
   * @returns The property
   */
  state.require = function (name) {
    if (!state.hasOwnProperty(name) || !state[name])
      throw new Error(name + "required");
    return state[name];
  };

  // public
  chart.on = function (name, callback) {
    disp.on(name, callback);
  };

  chart.call = function (name) {
    disp.call(name, this);
  };

  // Define state getter and setter function
  chart.state = function (_) {
    return arguments.length ? (Object.assign(state, _), this) : state;
  };

  chart.stateItem = function (name, fb) {
    return state.hasOwnProperty(name) ? state[name] || fb : fb;
  };

  chart.dataView = function (state) {
    return {};
  };

  chart.clear = function (container) {
    return container.select("*").remove(), this;
  };

  chart.render = function (container) {
    return this;
  };

  chart.run = function () {
    if (!state.dataController) throw new Error("no data controller");

    var selector = state.require("selector");
    var selection = d3.selectAll(selector);
    var dv = chart.dataView(state.dataController);

    selection.each(function scope() {
      // Receive container
      var container = d3.select(this);
      chart.clear(container, state, calc, dv);
      chart.render(container, state, calc, dv);
    });

    return chart;
  };

  chart.dataController = function (_) {
    if (!arguments.length) return state.dataController;

    state.dataController = _;
    state.dataController.on("filter." + this.id(), (item, sender) => {
      if (chart === sender) return;
      var selector = state.require("selector");
      var selection = d3.selectAll(selector);
      selection.each(function scope() {
        // Receive container
        var container = d3.select(this);
        if (typeof chart.update === "function")
          chart.update(container, state, calc);
      });
    });

    return chart;
  };

  // syntatic sugar

  chart.margin = function (_) {
    if (!arguments.length) {
      const { marginLeft, marginTop, marginRight, marginBottom } = this.state();
      return { marginLeft, marginTop, marginRight, marginBottom };
    }
    if (_ && _["left"]) this.state({ marginLeft: _["left"] });
    if (_ && _["top"]) this.state({ marginTop: _["top"] });
    if (_ && _["right"]) this.state({ marginRight: _["right"] });
    if (_ && _["bottom"]) this.state({ marginBottom: _["bottom"] });
    return chart;
  };

  return chart;
}

export class LotivisChart extends State {
  constructor(state, config) {
    super(state, config);

    // private
    var _updateSensible = true;
    var _events = new EventEmitter();

    // functions
    this.on = function (eventName, fn) {
      return _events.on(eventName, fn), this;
    };

    this.off = function (eventName, fn) {
      return _events.off(eventName, fn), this;
    };

    this.emit = function (eventName, ...args) {
      return _events.emit(eventName, args), this;
    };

    this.removeAllListeners = function () {
      return _events.removeAllListeners(), this;
    };

    this.updateSensible = function (_) {
      return arguments.length ? ((_updateSensible = _), this) : _updateSensible;
    };
  }

  init(config = {}) {}

  show() {
    if (this.element) this.element.style("display", "");
  }

  hide() {
    if (this.element) this.element.style("display", "none");
  }

  get isVisible() {
    return !this.element ? this.element.style("display") !== "none" : false;
  }

  getElementEffectiveSize() {
    if (!this.element) return [0, 0];
    let width = this.element.style("width").replace("px", "");
    let height = this.element.style("height").replace("px", "");
    return [Number(width), Number(height)];
  }

  getElementPosition() {
    let element = document.getElementById(this.selector);
    if (!element) return [0, 0];
    let rect = element.getBoundingClientRect();
    let xPosition = rect.x + window.scrollX;
    let yPosition = rect.y + window.scrollY;
    return [xPosition, yPosition];
  }

  toString() {
    return "[" + getClassname() + ", id: " + this.selector + "]";
  }

  getClassname() {
    return !this.constructor || !this.constructor.name
      ? typeof this
      : this.constructor.name;
  }

  name() {
    return this.getClassname();
  }

  // lifecycle

  // Default implementation removes everything inside the selection.
  clear(selection) {
    return selection.selectAll("*").remove(), this;
  }

  prepare(selection) {
    return this;
  }

  render(selection) {
    var chart = this;
    selection.each(function scope() {
      chart.renderContainer(d3.select(this), chart);
    });
    return this;
  }

  renderContainer(container, chart) {
    return this;
  }

  run() {
    if (!this.container || typeof this.container !== "function")
      throw new Error("no container function");

    var container = this.container();
    if (!container) return console.log("[ltv]  no container value"), this;

    d3.selectAll(container)
      .call(this.clear.bind(this))
      .call(this.prepare.bind(this))
      .call(this.render.bind(this));

    return this;
  }

  // functions

  dataController(_) {
    // console.log("this", this);
    // if (arguments.length) this.state({ controller });
    if (!arguments.length) return this._dataController;

    var chart = this;
    function onChange(controller, filter, reason, sender) {
      // console.log("onChange", filter, reason, sender, chart.id(), chart.name());
      if (chart === sender) return;
      if (!chart.updateSensible) return;
      if (!chart._dataController) return;
      // this.dataView = chart.createDataView();
      chart.update();
      // chart.run();
    }

    this._dataController = _;
    this._dataController.on("change", (d, f, r, s) => onChange(d, f, r, s));

    return this;
  }

  /**
   * @deprecated
   */
  setController(dc) {
    this._dataController = dc;
    this._dataController.on("change", (d, f, r, s) => this.update(d, r, f, s));
    this.update(dc, "registration");
  }

  // syntatic sugar

  margin(_) {
    if (!arguments.length) {
      const { marginLeft, marginTop, marginRight, marginBottom } = this.state();
      return { marginLeft, marginTop, marginRight, marginBottom };
    }
    if (_ && _["left"]) this.state({ marginLeft: _["left"] });
    if (_ && _["top"]) this.state({ marginTop: _["top"] });
    if (_ && _["right"]) this.state({ marginRight: _["right"] });
    if (_ && _["bottom"]) this.state({ marginBottom: _["bottom"] });
    return this;
  }

  classFor(postfix) {
    return ["ltv", this.name().toLowerCase(), postfix].join("-");
  }

  className(postfix) {
    return ["ltv", this.name().toLowerCase(), postfix].join("-");
  }
}
