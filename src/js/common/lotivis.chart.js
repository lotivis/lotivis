import * as d3 from "d3";
import { EventEmitter } from "./event.emitter";
import { State } from "./statefull.js";

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
