import { Component } from "./component.js";
import { create_id } from "./create.id.js";
import { DataController } from "../controller";

export class Chart extends Component {
  constructor(selector, config) {
    super(selector);

    this.svgSelector = (this.selector || create_id()) + "-svg";
    this.config = config || {};
    this.renderers = [];
    this.updateSensible = true;

    this.createSVG();
    this.initialize();
    this.addRenderers();

    // check for data controller in config
    if (this.config.dataController instanceof DataController) {
      this.setController(this.config.dataController);
      delete this.config.dataController;
    }
  }

  initialize() {}

  addRenderers() {}

  dataView() {}

  createSVG() {
    this.svg = this.element
      .append("svg")
      .attr("id", this.svgSelector)
      .attr("class", "ltv-chart-svg");
  }

  remove(c) {
    this.removeAllListeners();
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

  makeUpdateInsensible() {
    this.updateSensible = false;
  }

  makeUpdateSensible() {
    this.updateSensible = true;
  }

  update(controller, filter, reason, sender) {
    // console.log("update", filter, reason, sender);
    if (!this.updateSensible) return;
    if (!this.controller) return;
    this.dataView = this.createDataView();
    this.remove();
    this.prepare();
    this.draw();
  }

  setController(dc) {
    this.controller = dc;
    this.controller.on("change", (d, f, r, s) => this.update(d, r, f, s));
    this.update(dc, "registration");
  }
}
