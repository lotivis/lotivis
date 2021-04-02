import {Color} from "../shared/color";
import {DateAxisRenderer} from "./date.axis.renderer";
import {DateLabelRenderer} from "./date.label.renderer";
import {DateLegendRenderer} from "./date.legend.renderer";
import {DateBarsRenderer} from "./date.bars.renderer";
import {DateGhostBarsRenderer} from "./date.ghost.bars.renderer";
import {DateTooltipRenderer} from "./date.tooltip.renderer";
import {Chart} from "../components/chart";
import {Constants} from "../shared/constants";
import {DateGridRenderer} from "./date.grid.renderer";
import {DatasetsController} from "../data/datasets.controller";

const defaultConfig = {
  width: 1000,
  height: 600,
  margin: {
    top: Constants.defaultMargin,
    right: Constants.defaultMargin,
    bottom: Constants.defaultMargin,
    left: Constants.defaultMargin
  },
  showLabels: true,
  combineStacks: false,
  sendsNotifications: true,
  numberFormat: Intl.NumberFormat('de-DE', {
    maximumFractionDigits: 3
  }),
  dateAccess: function (date) {
    return Date.parse(date);
  }
};

/**¬
 *
 * @class Diachronic Chart Component
 * @extends Chart
 */
export class DateChart extends Chart {

  /**
   * Initializes this diachronic chart by setting the default values.
   * @override
   */
  initialize() {
    this.initializeDefaultValues();
    this.initializeRenderers();
  }

  initializeDefaultValues() {

    let theConfig = this.config;
    let margin;
    margin = Object.assign({}, defaultConfig.margin);
    margin = Object.assign(margin, this.config.margin);

    let config = Object.assign({}, defaultConfig);
    this.config = Object.assign(config, this.config);
    this.config.margin = margin;

    this.datasets = [];

    this.labelColor = new Color(155, 155, 155).rgbString();
    this.type = 'bar'; // DateChart.ChartType.Bar;
    // this.valueType = 'relative';

    this.isShowLabels = false;
    this.isCombineStacks = false;
    this.updateSensible = true;

    this.numberFormat = new Intl.NumberFormat('de-DE', {
      maximumFractionDigits: 3
    });
  }

  initializeRenderers() {
    this.axisRenderer = new DateAxisRenderer(this);
    this.gridRenderer = new DateGridRenderer(this);
    this.labelRenderer = new DateLabelRenderer(this);
    this.legendRenderer = new DateLegendRenderer(this);
    this.barsRenderer = new DateBarsRenderer(this);
    this.ghostBarsRenderer = new DateGhostBarsRenderer(this);
    this.tooltipRenderer = new DateTooltipRenderer(this);
  }

  /**
   * @override
   */
  precalculate() {
    let config = this.config;
    let margin = config.margin;
    this.graphWidth = config.width - margin.left - margin.right;
    this.graphHeight = config.height - margin.top - margin.bottom;
    this.precalculateHelpData();
    this.createScales();
  }

  /**
   * Tells the receiving map chart that its `datasets` property did change.
   */
  precalculateHelpData() {
    if (!this.datasetController) return;
    this.dataview = this.datasetController.getDateDataview();
  }

  /**
   * Creates scales which are used to calculate the x and y positions of bars or circles.
   */
  createScales() {
    let config = this.config;
    let margin = config.margin;

    this.xChart = d3
      .scaleBand()
      .domain(this.datasetController.dates)
      .rangeRound([margin.left, config.width - margin.right])
      .paddingInner(0.1);

    this.xStack = d3
      .scaleBand()
      .domain(this.datasetController.enabledStacks())
      .rangeRound([0, this.xChart.bandwidth()])
      .padding(0.05);

    this.yChart = d3
      .scaleLinear()
      .domain([0, this.dataview.max])
      .nice()
      .rangeRound([config.height - margin.bottom, margin.top]);

  }

  /**
   * Removes all `svg`s from the parental element.
   * @override
   */
  remove() {
    this.element.selectAll('svg').remove();
  }

  /**
   * Creates and renders the chart.
   * @override
   */
  draw() {
    this.renderSVG();
    if (!this.dataview || !this.dataview.datasetStacks || this.dataview.datasetStacks.length === 0) return;
    this.axisRenderer.renderAxis();
    this.gridRenderer.createAxis();
    this.gridRenderer.renderGrid();
    this.ghostBarsRenderer.renderGhostBars();

    if (this.isCombineStacks) {
      this.legendRenderer.renderCombinedStacksLegend();
    } else {
      this.legendRenderer.renderNormalLegend();
    }

    for (let index = 0; index < this.dataview.datasetStacksPresented.length; index++) {
      let stack = this.dataview.datasetStacksPresented[index];
      this.barsRenderer.renderBars(stack, index);
      if (this.isShowLabels === false) continue;
      this.labelRenderer.renderBarLabels(stack, index);
    }
  }

  /**
   *
   */
  renderSVG() {
    this.svg = this.element
      .append('svg')
      .attr('class', 'lotivis-chart-svg lotivis-date-chart')
      // .attr('width', this.config.width)
      // .attr('height', this.height)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr("viewBox", `0 0 ${this.config.width} ${this.config.height}`)
      .attr('id', this.svgSelector);

    this.background = this.svg
      .append('rect')
      .attr('width', this.config.width)
      .attr('height', this.config.height)
      .attr('fill', 'white')
      .attr('opacity', 0);

    this.graph = this.svg
      .append('g')
      .attr('width', this.graphWidth)
      .attr('height', this.graphHeight)
      .attr('transform', `translate(${this.config.margin.left},${this.config.margin.top})`);
  }

  /**
   * Toggle the enabled of the dataset with the given label.
   *
   * @param label The label of the dataset.
   */
  toggleDataset(label) {
    console.log('toggleDataset');
    if (this.config.sendsNotifications) {
      this.datasetController.toggleDataset(label);
    } else {
      this.datasetController.toggleDataset(label, false);
      this.update();
    }
  }

  /**
   * Sets a new datasets controller.  The chart is updated automatically.
   *
   * @param newController The new datasets controller.
   */
  setDatasetController(newController) {
    this.datasetController = newController;
    this.datasetController.addListener(this);
    this.update();
  }

  /**
   *
   * @param newDatasets
   */
  set datasets(newDatasets) {
    this.setDatasetController(new DatasetsController(newDatasets));
  }

  /**
   *
   * @returns {*}
   */
  get datasets() {
    return this.datasetController ? this.datasetController.datasets || [] : [];
  }
}
