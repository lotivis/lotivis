import {Component} from "../components/component";
import {Color} from "../shared/colors";
import {URLParameters} from "../shared/url-parameters";
import {TestData} from "../shared/test-data";
import {log_debug} from "../shared/debug";
import {
  extractStacksFromDatasets
} from "../data-juggle/dataset-extract";
import {dateToItemsRelation} from "../data-juggle/dataset-relations";
import {ChartAxisRenderer} from "./chart-axis-renderer";
import {ChartLabelRenderer} from "./chart-label-renderer";
import {ChartLegendRenderer} from "./chart-legend-renderer";
import {ChartBarsRenderer} from "./chart-bars-renderer";
import {FilterableDatasetController} from "../data/filterable-dataset-controller";

/**
 *
 * @class Diachronic Chart Component
 * @extends Component
 */
export class TimeChart extends Component {

  /**
   * Creates an instance of DiachronicChart.
   *
   * @constructor
   * @param {Component} parent The parental component.
   */
  constructor(parent) {
    super(parent);
    if (!parent) {
      throw 'No parent specified.';
    }
    if (Object.getPrototypeOf(parent) === String.prototype) {
      this.selector = parent;
      this.element = d3.select('#' + parent);
    } else {
      this.element = parent;
    }
    this.initialize();
    this.update();
  }

  /**
   * Initializes this diachronic chart by setting the default values.
   */
  initialize() {
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
    this.type = TimeChart.ChartType.Bar;
    // this.valueType = 'relative';

    this.isShowLabels = false;
    this.isCombineStacks = false;

    this.numberFormat = new Intl.NumberFormat('de-DE', {
      maximumFractionDigits: 3
    });

    if (URLParameters.getInstance().getBoolean(URLParameters.showTestData)) {
      this.datasets = TestData.datasets;
    }
  }

  /**
   * Updates the receiver by calling the draw chart chain: `beforeDrawChart()`,
   * `drawChart()` and `afterDrawChart()`.
   */
  update() {
    this.configureChart();
    this.datasetsDidChange();
    this.drawChart();
  }

  /**
   * Creates and renders the chart.
   */
  drawChart() {
    this.createSVG();
    if (!this.datasetStacks || this.datasetStacks.length === 0) return;
    this.createGraph();
    this.createScales();
    this.axisRenderer.createAxis();
    this.axisRenderer.renderAxis();
    this.axisRenderer.renderGrid();
    this.renderStacks();
    this.renderLegend();
  }

  /**
   *
   */
  configureChart() {
    let margin = this.margin;
    this.graphWidth = this.width - margin.left - margin.right;
    this.graphHeight = this.height - margin.top - margin.bottom;
  }

  /**
   * Removes all `svg`s from the parental element.
   */
  removeSVG() {
    this.element
      .selectAll('svg')
      .remove();
  }

  /**
   *
   */
  createSVG() {
    this.removeSVG();
    this.svg = this.element
      .append('svg')
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr("viewBox", `0 0 ${this.width} ${this.height}`)
      .attr('id', TimeChart.svgID);

    this.axisRenderer = new ChartAxisRenderer(this);
    this.labelRenderer = new ChartLabelRenderer(this);
    this.legendRenderer = new ChartLegendRenderer(this);
    this.barsRenderer = new ChartBarsRenderer(this);

    // let image = new Image;
    // let aspect = this.width / this.height;
    // d3.select(window)
    //     .on("resize", function () {
    //         var targetWidth = this.element.node().getBoundingClientRect().width;
    //         console.log('targetWidth: ' + targetWidth);
    //         this.width = targetWidth;
    //         this.height = targetWidth / aspect;
    //         this.svg.attr("width", targetWidth);
    //         this.svg.attr("height", targetWidth / aspect);
    //         this.update();
    //     }.bind(this));
  }

  /**
   *
   */
  createGraph() {
    this.graph = this.svg
      .append('g')
      .attr('width', this.graphWidth)
      .attr('height', this.graphHeight)
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
  }

  /**
   * Creates scales which are used to calculate the x and y positions of bars or circles.
   */
  createScales() {


    this.max = d3.max(this.datasetStacksPresented, function (stack) {
      return d3.max(stack, function (serie) {
        return d3.max(serie.map(item => item['1']));
      });
    });

    // log_debug('this.max', this.max);

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
   *
   */
  renderStacks() {
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
  renderLegend() {
    if (this.isCombineStacks) {
      this.legendRenderer.renderCombinedStacksLegend();
    } else {
      this.legendRenderer.renderNormalLegend();
    }
  }

  /**
   *
   * @param label
   */
  toggleDataset(label) {
    this.datasetController.toggleDataset(label);
  }

  /**
   *
   */
  calculateColors() {
    let stacks = this.datasetController.stacks;

    for (let index = 0; index < stacks.length; index++) {

      let stackName = stacks[index];
      let datasets = this.datasetController.workingDatasets.filter(function (dataset) {
        return dataset.stack === stackName
          || dataset.label === stackName;
      });

      let numberOfDatasets = datasets.length;
      let colors = Color.colorsForStack(index, numberOfDatasets);

      for (let index = 0; index < colors.length; index++) {
        datasets[index].color = colors[index];
      }
    }

    for (let index = 0; index < stacks.length; index++) {

      let stackName = stacks[index];
      let datasets = this.datasetController.enabledDatasets.filter(function (dataset) {
        return dataset.stack === stackName
          || dataset.label === stackName;
      });

      let numberOfDatasets = datasets.length;
      let colors = Color.colorsForStack(index, numberOfDatasets);

      for (let index = 0; index < colors.length; index++) {
        datasets[index].color = colors[index];
      }
    }
  }

  /**
   *
   * @param datasets
   * @param dateToItemsRelation
   * @returns {*[]}
   */
  createStackModel(datasets, dateToItemsRelation) {
    let listOfStacks = extractStacksFromDatasets(datasets);
    return listOfStacks.map(function (stackName) {

      let stackCandidates = datasets.filter(function (dataset) {
        return dataset.stack === stackName
          || dataset.label === stackName;
      });

      let candidatesNames = stackCandidates.map(stackCandidate => stackCandidate.label);
      let candidatesColors = stackCandidates.map(stackCandidate => stackCandidate.color);

      let stack = d3
        .stack()
        .keys(candidatesNames)
        (dateToItemsRelation);

      stack.label = stackName;
      stack.stack = stackName;
      stack.colors = candidatesColors;

      return stack;
    });
  }

  setDatasetController(newController) {
    this.datasetController = newController;
    this.datasetController.addListener(this);
    this.datasetsDidChange();
  }

  /**
   *
   * @param newDatasets
   */
  set datasets(newDatasets) {
    this.setDatasetController(new FilterableDatasetController(newDatasets));
  }

  /**
   *
   * @returns {*}
   */
  get datasets() {
    return this.datasetController ? this.datasetController.datasets || [] : [];
  }

  /**
   * Tells the receiving map chart that its `datasets` property did change.
   */
  datasetsDidChange() {
    // log_debug('this', this);
    if (!this.datasets) return;

    // log_debug('this.datasetController', this.datasetController);
    // log_debug('this.enabledDatasets', this.datasetController.enabledDatasets);

    let enabledDatasets = this.datasetController.enabledDatasets;

    this.dateToItemsRelation = dateToItemsRelation(this.datasetController.workingDatasets);
    this.dateToItemsRelationPresented = dateToItemsRelation(enabledDatasets);

    this.calculateColors();

    this.datasetStacks = this.createStackModel(this.datasetController.workingDatasets, this.dateToItemsRelation);
    this.datasetStacksPresented = this.createStackModel(enabledDatasets, this.dateToItemsRelationPresented);

  }
}

TimeChart.svgID = 'chart-svg';

/**
 * @enum
 * Enumeration of available chart types.
 */
TimeChart.ChartType = {
  /** Case for bar chart type. */
  Bar: 'Bar',
  /** Case for line chart type. */
  Line: 'Line'
};

