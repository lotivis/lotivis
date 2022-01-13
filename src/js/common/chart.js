import { Component } from "./component.js";
import { create_id } from "./create.id.js";
import { DataController } from "../data/controller";

export class Chart extends Component {
  constructor(selector, config) {
    super(selector);

    this.svgSelector = (this.selector || create_id()) + "-svg";
    this.config = config || {};

    this.renderers = [];
    this.listeners = {};

    let updateSensible = true;

    this.makeUpdateInsensible = function () {
      updateSensible = false;
    };

    this.makeUpdateSensible = function () {
      updateSensible = true;
    };

    this.update = function (controller, reason) {
      // console.log("[Chart] update", this.constructor.name, reason, controller);
      if (!updateSensible) return;
      if (!this.controller) this.controller = new DataController([]);
      this.dataView = this.createDataView();
      this.remove();
      this.prepare();
      this.draw();
    };

    // listeners
    this.addListener = function (eventname, listener) {
      if (!this.listeners[eventname]) this.listeners[eventname] = [];
      this.listeners[eventname].push(listener);
    };

    this.fire = function (name, event, value) {
      this.listeners[name]?.forEach((l) => l(event, value, this));
    };

    this.createSVG();
    this.initialize();
    this.appendRenderers();

    if (this.config.dataController instanceof DataController) {
      this.setController(this.config.dataController);
      delete this.config.dataController;
    }
  }

  initialize() {}

  appendRenderers() {}

  dataView() {}

  createSVG() {
    this.svg = this.element
      .append("svg")
      .attr("id", this.svgSelector)
      .attr("class", "ltv-chart-svg");
  }

  remove(c) {
    this.listeners = {};
    this.svg.selectAll("*").remove();
  }

  prepare(c) {
    // empty
  }

  draw() {
    this.renderers.forEach((r) =>
      r.render(this, this.controller, this.dataView)
    );
  }

  redraw() {
    if (this.controller) this.update(this.controller, "redraw");
  }

  setController(dc) {
    this.controller = dc;
    this.controller.addListener(this);
    // this.redraw();
  }

  fromConfig(name, fallback) {
    return this.config[name] || LOTIVIS_CONFIG[name] || fallback;
  }
}
