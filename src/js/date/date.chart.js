import {Color} from "../color/color";
import {DateAxisRenderer} from "./date.axis.renderer";
import {DateLabelRenderer} from "./date.label.renderer";
import {DateLegendRenderer} from "./date.legend.renderer";
import {DateBarsRenderer} from "./date.bars.renderer";
import {DateGhostBarsRenderer} from "./date.ghost.bars.renderer";
import {DateTooltipRenderer} from "./date.tooltip.renderer";
import {Chart} from "../components/chart";
import {DateGridRenderer} from "./date.grid.renderer";
import {GlobalConfig} from "../shared/config";

const defaultConfig = {
  width: 1000,
  height: 600,
  margin: {
    top: GlobalConfig.defaultMargin,
    right: GlobalConfig.defaultMargin,
    bottom: GlobalConfig.defaultMargin,
    left: GlobalConfig.defaultMargin
  },
  showLabels: false,
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
    this.type = 'bar';

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
    let groupSize = this.config.groupSize || 1;
    this.dataview = this.datasetController.getDateDataview(groupSize);
  }

  /**
   * Creates scales which are used to calculate the x and y positions of bars or circles.
   */
  createScales() {
    let config = this.config;
    let margin = config.margin;
    if (!this.dataview) return;

    this.xChart = d3
      .scaleBand()
      .domain(this.dataview.dates)
      .rangeRound([margin.left, config.width - margin.right])
      .paddingInner(0.1);

    this.xStack = d3
      .scaleBand()
      .domain(this.dataview.enabledStacks)
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

    if (this.config.combineStacks) {
      this.legendRenderer.renderCombinedStacksLegend();
    } else {
      this.legendRenderer.renderNormalLegend();
    }

    for (let index = 0; index < this.dataview.datasetStacksPresented.length; index++) {
      let stack = this.dataview.datasetStacksPresented[index];
      this.barsRenderer.renderBars(stack, index);
      if (this.config.showLabels === false) continue;
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
}
