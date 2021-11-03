import {Color} from "../shared.color/color";
import {DateChartAxisRenderer} from "./date.chart.axis.renderer";
import {TimeChartLabelRenderer} from "./time.chart.label.renderer";
import {TimeChartLegendRenderer} from "./time.chart.legend.renderer";
import {TimeChartBarsRenderer} from "./time.chart.bars.renderer";
import {TimeChartSelectionBarsRenderer} from "./time.chart.selection.bars.renderer";
import {TimeChartTooltipRenderer} from "./time.chart.tooltip.renderer";
import {Chart} from "../chart/chart";
import {TimeChartGridRenderer} from "./time.chart.grid.renderer";
import {LotivisConfig} from "../shared/config";
import {lotivis_log} from "../shared/debug";

const defaultConfig = {
  width: 1000,
  height: 600,
  margin: {
    top: LotivisConfig.defaultMargin,
    right: LotivisConfig.defaultMargin,
    bottom: LotivisConfig.defaultMargin,
    left: LotivisConfig.defaultMargin
  },
  showLabels: false,
  combineStacks: false,
  sendsNotifications: true,
  labelColor: new Color(155, 155, 155),
  numberFormat: Intl.NumberFormat('de-DE', {
    maximumFractionDigits: 3
  }),
  dateAccess: function (date) {
    return Date.parse(date);
  }
};

/**
 *
 * @class TimeChart
 * @extends Chart
 */
export class TimeChart extends Chart {

  // called by `Chart` superclass
  /**
   * Initializes this diachronic chart by setting the default values.
   *
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
    this.axisRenderer = new DateChartAxisRenderer(this);
    this.gridRenderer = new TimeChartGridRenderer(this);
    this.labelRenderer = new TimeChartLabelRenderer(this);
    this.legendRenderer = new TimeChartLegendRenderer(this);
    this.barsRenderer = new TimeChartBarsRenderer(this);
    this.ghostBarsRenderer = new TimeChartSelectionBarsRenderer(this);
    this.tooltipRenderer = new TimeChartTooltipRenderer(this);
  }

  /**
   * Removes all `svg`s from the parental element.
   * @override
   */
  remove() {
    this.element.selectAll('svg').remove();
  }

  /**
   * @override
   */
  precalculate() {
    let config = this.config;
    let margin = config.margin;
    this.graphWidth = config.width - margin.left - margin.right;
    this.graphHeight = config.height - margin.top - margin.bottom;
    if (!this.datasetController) return;
    let groupSize = this.config.groupSize || 1;

    if (this.config.combineStacks) {
      this.dataview = this.datasetController.getDateDataviewCombinedStacks(groupSize);
    } else {
      this.dataview = this.datasetController.getDateDataview(groupSize);
    }
    this.createScales();
  }

  /**
   * Creates scales which are used to calculate the x and y positions of bars or circles.
   */
  createScales() {
    let config = this.config;
    let margin = config.margin;
    if (!this.dataview) return;

    /*
     * Prefer dates specified by configuration. Fallback to dates of datasets.
     */
    let dates = config.dateLabels || this.dataview.dates;
    lotivis_log('dates of date-chart:', dates);

    this.xChart = d3
      .scaleBand()
      .domain(dates)
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
   * Creates and renders the chart.
   * @override
   */
  draw() {
    this.renderSVG();
    if (!this.dataview || !this.dataview.datasetStacks || this.dataview.datasetStacks.length === 0) return;
    this.axisRenderer.render();
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
      .attr('class', 'lotivis-chart-svg lotivis-date.chart-chart')
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
   * @param label The label of the dataset.
   */
  toggleDataset(label) {
    this.datasetController.toggleDataset(label, this.config.sendsNotifications === true);
    this.update();
  }
}
