import { Component } from "../shared.components/component";
import { createID } from "../shared/selector";
import { LotivisUnimplementedMethodError } from "../data.juggle/data.validate.error";
import { lotivis_log } from "../shared/debug";

/**
 * Superclass for lotivis charts.
 * @class Chart
 * @extends Component
 * @see DateChart
 * @see MapChart
 * @see PlotChart
 */
export class Chart extends Component {
  /**
   * Creates an instance of DiachronicChart.
   * @constructor
   * @param {Component} parent The parental component.
   * @param config The configuration of the chart.
   */
  constructor(parent, config) {
    super(parent);

    this.svgSelector = (this.selector || createID()) + "-svg";
    this.element = this.parent;
    this.element.attr("id", this.selector);
    this.config = config || {};
    this.updateSensible = true;
    this.initialize();

    if (this.config.datasets) {
      this.setDatasets(this.config.datasets);
    } else {
      this.update();
    }
  }

  /**
   * Initializes this chart.
   */
  initialize() {
    return new LotivisUnimplementedMethodError(`initialize()`);
  }

  /**
   * Updates the content of this chart by calling the 'update'-chain:
   *
   * ```
   * remove();
   * precalculate();
   * draw();
   * ```
   */
  update(datasetsController, reason) {
    // lotivis_log("[lotivis] ", this.constructor.name, "update", reason);
    if (!this.updateSensible) return;
    if (datasetsController) {
      this.snapshot = datasetsController.snapshot;
    }
    // lotivis_log(
    //   "[lotivis] ",
    //   this.constructor.name,
    //   "update",
    //   datasetsController
    // );
    // lotivis_log("[lotivis] ", this.constructor.name, "update", this.snapshot);
    this.remove();
    this.precalculate();
    this.draw();
  }

  /**
   * Removes any old content from this chart.
   * @returns {LotivisUnimplementedMethodError}
   */
  remove() {
    throw new LotivisUnimplementedMethodError(`remove()`);
  }

  /**
   * Precalculates data for this chart.
   * @returns {LotivisUnimplementedMethodError}
   */
  precalculate() {
    throw new LotivisUnimplementedMethodError(`precalculate()`);
  }

  /**
   * Appends / draw the shared.components of this chart.
   * @returns {LotivisUnimplementedMethodError}
   */
  draw() {
    throw new LotivisUnimplementedMethodError(`draw()`);
  }

  /**
   * Tells this chart to ignore updates of a datasets controller.
   */
  makeUpdateInsensible() {
    this.updateSensible = false;
  }

  /**
   * Tells this chart to listen to update of a datasets controller.
   */
  makeUpdateSensible() {
    this.updateSensible = true;
  }
}
