import {Chart} from "../chart/chart";
import {DateChartAxisRenderer} from "./date.chart.axis.renderer";
import {TimeChartLabelRenderer} from "./time.chart.label.renderer";
import {TimeChartLegendRenderer} from "./time.chart.legend.renderer";
import {TimeChartBarsRenderer} from "./time.chart.bars.renderer";
import {TimeChartHoverBarsRenderer} from "./time.chart.hover.bars.renderer";
import {TimeChartTooltipRenderer} from "./time.chart.tooltip.renderer";
import {TimeChartGridRenderer} from "./time.chart.grid.renderer";
import {TimeChartSelectionRenderer} from "./time.chart.selection.renderer";
import {DATE_CHART_CONFIG} from "./date.chart.config";

/**
 *
 * @class DateChart
 * @extends Chart
 */
export class DateChart extends Chart {

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

  /**
   *
   */
  initializeDefaultValues() {

    let margin, config;

    margin = Object.assign({}, DATE_CHART_CONFIG.margin);
    margin = Object.assign(margin, this.config.margin);

    config = Object.assign({}, DATE_CHART_CONFIG);

    this.config = Object.assign(config, this.config);
    this.config.margin = margin;
  }

  initializeRenderers() {
    this.axisRenderer = new DateChartAxisRenderer(this);
    this.gridRenderer = new TimeChartGridRenderer(this);
    this.labelRenderer = new TimeChartLabelRenderer(this);
    this.legendRenderer = new TimeChartLegendRenderer(this);
    this.barsRenderer = new TimeChartBarsRenderer(this);
    this.ghostBarsRenderer = new TimeChartHoverBarsRenderer(this);
    this.selectionRenderer = new TimeChartSelectionRenderer(this);
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
    if (!this.dataview) return;

    let config = this.config;
    let margin = config.margin;

    /*
     * Prefer dates specified by configuration. Fallback to dates of datasets.
     */
    let dates = config.dateLabels || this.dataview.dates;

    this.xChartScale = d3
      .scaleBand()
      .domain(dates)
      .rangeRound([margin.left, config.width - margin.right]);

    this.xChartScalePadding = d3
      .scaleBand()
      .domain(dates)
      .rangeRound([margin.left, config.width - margin.right])
      .paddingInner(0.2);


    this.xStack = d3
      .scaleBand()
      .domain(this.dataview.enabledStacks)
      .rangeRound([0, this.xChartScale.bandwidth()])
      .padding(0.05);

    this.yChart = d3
      .scaleLinear()
      .domain([0, this.dataview.max])
      .nice()
      .rangeRound([config.height - margin.bottom, margin.top]);
  }

  /**
   * Creates and renders the chart.
   *
   * @override
   */
  draw() {
    this.renderSVG();
    if (!this.dataview
      || !this.dataview.datasetStacks
      || this.dataview.datasetStacks.length === 0) return;

    this.axisRenderer.render();
    this.gridRenderer.createAxis();
    this.gridRenderer.renderGrid();
    this.selectionRenderer.render();
    this.ghostBarsRenderer.renderGhostBars();
    this.legendRenderer.render();

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
      .attr('opacity', 0)
      .attr('cursor', 'pointer')
      .on('click', (event, some) => {
        this.datasetController.resetDateFilters();
      });

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
