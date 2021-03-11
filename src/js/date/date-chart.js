import {Color} from "../shared/colors";
import {DateAxisRenderer} from "./date-axis-renderer";
import {DateLabelRenderer} from "./date-label-renderer";
import {DateLegendRenderer} from "./date-legend-renderer";
import {DateBarsRenderer} from "./date-bars-renderer";
import {FilterableDatasetsController} from "../data/filterable-datasets-controller";
import {DateGhostBarsRenderer} from "./date-ghost-bars-renderer";
import {DateTooltipRenderer} from "./date-tooltip-renderer";
import {Chart} from "../components/chart";
import {dateToItemsRelation} from "../data-juggle/dataset-relations";
import {createStackModel} from "./date-datasets-helper";

/**
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
    this.width = 1000;
    this.height = 600;
    this.defaultMargin = 60;
    this.margin = {
      top: this.defaultMargin,
      right: this.defaultMargin,
      bottom: this.defaultMargin,
      left: this.defaultMargin
    };

    this.datasets = [];

    this.labelColor = new Color(155, 155, 155).rgbString();
    this.type = DateChart.ChartType.Bar;
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
    let margin = this.margin;
    this.graphWidth = this.width - margin.left - margin.right;
    this.graphHeight = this.height - margin.top - margin.bottom;
    this.precalculateHelpData();
    this.createScales();
  }

  /**
   * Tells the receiving map chart that its `datasets` property did change.
   */
  precalculateHelpData() {
    if (!this.datasetController) return;
    // calculate enabled datasets once
    let enabledDatasets = this.datasetController.enabledDatasets;
    this.dateToItemsRelation = dateToItemsRelation(this.datasetController.workingDatasets);
    this.dateToItemsRelationPresented = dateToItemsRelation(enabledDatasets);
    this.datasetStacks = createStackModel(this.datasetController, this.datasetController.workingDatasets, this.dateToItemsRelation);
    this.datasetStacksPresented = createStackModel(this.datasetController, enabledDatasets, this.dateToItemsRelationPresented);
  }

  /**
   * Creates scales which are used to calculate the x and y positions of bars or circles.
   */
  createScales() {

    this.max = d3.max(this.datasetStacksPresented, function (stack) {
      return d3.max(stack, function (series) {
        return d3.max(series.map(item => item['1']));
      });
    });

    this.xChart = d3
      .scaleBand()
      .domain(this.datasetController.dates)
      .rangeRound([this.margin.left, this.width - this.margin.right])
      .paddingInner(0.1);

    this.xStack = d3
      .scaleBand()
      .domain(this.datasetController.enabledStacks)
      .rangeRound([0, this.xChart.bandwidth()])
      .padding(0.05);

    this.yChart = d3
      .scaleLinear()
      .domain([0, this.max]).nice()
      .rangeRound([this.height - this.margin.bottom, this.margin.top]);

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
    if (!this.datasetStacks || this.datasetStacks.length === 0) return;
    this.axisRenderer.createAxis();
    this.axisRenderer.renderAxis();
    this.axisRenderer.renderGrid();
    this.ghostBarsRenderer.renderGhostBars();

    if (this.isCombineStacks) {
      this.legendRenderer.renderCombinedStacksLegend();
    } else {
      this.legendRenderer.renderNormalLegend();
    }

    for (let index = 0; index < this.datasetStacksPresented.length; index++) {
      let stack = this.datasetStacksPresented[index];
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
      // .attr('width', this.width)
      // .attr('height', this.height)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr("viewBox", `0 0 ${this.width} ${this.height}`)
      .attr('id', DateChart.svgID);

    this.background = this.svg
      .append('rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', 'white')
      .attr('opacity', 0);

    // create a background rectangle for receiving mouse enter events
    // in order to reset the location data filter.
    // this.background
    //   .on('mouseenter', function () {
    //     let controller = this.datasetController;
    //     let filters = controller.dateFilters;
    //     if (!filters || filters.length === 0) return;
    //     this.makeUpdateInsensible();
    //     controller.setDatesFilter([]);
    //     this.makeUpdateSensible();
    //     this.ghostBarsRenderer.hideAll();
    //   }.bind(this));

    this.graph = this.svg
      .append('g')
      .attr('width', this.graphWidth)
      .attr('height', this.graphHeight)
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  /**
   * Toggle the enabled of the dataset with the given label.
   *
   * @param label The label of the dataset.
   */
  toggleDataset(label) {
    this.datasetController.toggleDataset(label);
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
    this.setDatasetController(new FilterableDatasetsController(newDatasets));
  }

  /**
   *
   * @returns {*}
   */
  get datasets() {
    return this.datasetController ? this.datasetController.datasets || [] : [];
  }
}

DateChart.svgID = 'chart-svg';

/**
 * @enum
 * Enumeration of available chart types.
 */
DateChart.ChartType = {
  /** Case for bar chart type. */
  Bar: 'Bar',
  /** Case for line chart type. */
  Line: 'Line'
};

