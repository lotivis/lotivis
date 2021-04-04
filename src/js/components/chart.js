import {Component} from "./component";
import {createID} from "../shared/selector";

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

    this.svgSelector = (this.selector || createID()) + '-svg';
    this.element = this.parent;
    this.element.attr('id', this.selector);
    this.config = config || {};
    this.updateSensible = true;
    this.initialize();

    if (this.config.datasets) {
      this.setDatasets(this.config.datasets);
    } else {
      this.update();
    }
  }

  initialize() {
    // empty
  }

  update() {
    if (!this.updateSensible) return;
    this.remove();
    this.precalculate();
    this.draw();
  }

  precalculate() {
    // empty
  }

  remove() {
    // empty
  }

  draw() {
    // empty
  }

  makeUpdateInsensible() {
    this.updateSensible = false;
  }

  makeUpdateSensible() {
    this.updateSensible = true;
  }
}
