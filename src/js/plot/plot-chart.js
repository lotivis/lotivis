import {Component} from "../components/component";
import {Color} from "../shared/colors";
import {log_debug} from "../shared/debug";
import {TimeChart} from "../time/time-chart";
import {extractDatesFromDatasets, extractLabelsFromDatasets} from "../data-juggle/dataset-extract";

/**
 *
 * @class PlotChart
 * @extends Component
 */
export class PlotChart extends Component {

  /**
   * Creates an instance of DiachronicChart.
   *
   * @constructor
   * @param {Component} parent The parental component.
   */
  constructor(parent) {
    super(parent);

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
    this.lineHeight = 44;
    this.margin = {
      top: this.defaultMargin,
      right: this.defaultMargin,
      bottom: this.defaultMargin,
      left: this.defaultMargin
    };

    this.datasets = [];
  }

  /**
   *
   */
  configureChart() {
    let margin = this.margin;
    this.height = (this.workingDatasets.length * this.lineHeight) + margin.top + margin.bottom;
    this.graphWidth = this.width - margin.left - margin.right;
    this.graphHeight = this.height - margin.top - margin.bottom;
  }

  /**
   * Creates and renders the chart.
   */
  drawChart() {
    if (this.workingDatasets.length === 0) return;
    this.createSVG();
    this.createGraph();
    this.createScales();
    this.renderAxis();
    this.renderGrid();
  }

  /**
   * Update the chart.
   */
  update() {
    this.configureChart();
    this.datasetsDidChange();
    this.drawChart();
  }

  /**
   * Removes all `svg`s from the parental element.
   */
  removeSVG() {
    this.element.selectAll('svg').remove();
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
    let listOfDates = extractDatesFromDatasets(this.workingDatasets);
    let datasetsCount = (this.workingDatasets || []).length;
    let listOfLabels = extractLabelsFromDatasets(this.workingDatasets);

    this.xChart = d3
      .scaleBand()
      .domain(listOfDates)
      .rangeRound([this.margin.left, this.width - this.margin.right])

    this.yChart = d3
      .scaleBand()
      //.domain([0, datasetsCount])
      .domain(listOfLabels)
      // .nice()
      .rangeRound([this.height - this.margin.bottom, this.margin.top]);

    this.xAxisGrid = d3
      .axisBottom(this.xChart)
      .tickSize(-this.graphHeight)
      .tickFormat('');

    this.yAxisGrid = d3
      .axisLeft(this.yChart)
      .tickSize(-this.graphWidth)
      .tickFormat('')
      .ticks(datasetsCount);

  }


  // MARK: - Render

  /**
   *
   */
  renderAxis() {

    this.svg
      .append("g")
      .call(d3.axisBottom(this.xChart))
      .attr("transform", () => `translate(0,${this.height - this.margin.bottom})`);

    this.svg
      .append("g")
      .call(d3.axisLeft(this.yChart))
      .attr("transform", () => `translate(${this.margin.left},0)`);

  }


  // MARK: - Grid

  /**
   *
   */
  renderGrid() {
    let color = 'lightgray';
    let width = '0.5';
    let opacity = 0.3;

    this.svg
      .append('g')
      .attr('class', 'x axis-grid')
      .attr('transform', 'translate(0,' + (this.height - this.margin.bottom) + ')')
      .attr('stroke', color)
      .attr('stroke-width', width)
      .attr("opacity", opacity)
      .call(this.xAxisGrid);

    this.svg
      .append('g')
      .attr('class', 'y axis-grid')
      .attr('transform', `translate(${this.margin.left},0)`)
      .attr('stroke', color)
      .attr('stroke-width', width)
      .attr("opacity", opacity)
      .call(this.yAxisGrid);
  }

  /**
   *
   * @param stack
   * @param stackIndex
   */
  renderBars(stack, stackIndex) {
    log_debug('stack', Object.getOwnPropertyNames(stack));
    log_debug('stackIndex', stackIndex);
    //
    // this.svg.append("g")
    //   .selectAll("g")
    //   .data(stack)
    //   .enter()
    //   .append("g")
    //   .attr("fill", function (dataset, index) {
    //     log_debug('dataset', dataset);
    //     if (this.isCombineStacks) {
    //       return Color.colorsForStack(stackIndex)[0].rgbString();
    //     } else {
    //       return stack.colors[index].rgbString();
    //     }
    //   }.bind(this))
    //   .selectAll("rect")
    //   .data((data) => data)
    //   .enter()
    //   .append("rect")
    //   .attr("rx", this.isCombineStacks ? 0 : 4)
    //   .attr("x", (d) => this.xChart(d.data.date) + this.xStack(stack.label))
    //   .attr("y", (d) => this.yChart(d[1]))
    //   .attr("height", (d) => this.yChart(d[0] || 0) - this.yChart(d[1] || 0))
    //   .attr("width", this.xStack.bandwidth());
  }

  /**
   * Sets the datasets.
   * @param datasets The array of datasets.
   */
  set datasets(datasets) {
    this.originalDatasets = datasets;
    this.workingDatasets = datasets;
    this.datasetsDidChange();
  }

  /**
   * Returns the presented datasets.
   * @returns {*}
   */
  get datasets() {
    return this.originalDatasets;
  }

  /**
   * Tells this chart that it's datasets has changed.
   */
  datasetsDidChange() {
    log_debug('this.workingDatasets', this.workingDatasets);
  }
}

