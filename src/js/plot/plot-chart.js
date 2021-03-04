import {Component} from "../components/component";
import {TimeChart} from "../time/time-chart";
import {
  extractDatesFromDatasets,
  extractEarliestDateWithValue,
  extractLatestDateWithValue
} from "../data-juggle/dataset-extract";
import {combineByDate} from "../data-juggle/dataset-combine";
import {hashCode} from "../shared/hash";
import {sumOfLabel} from "../data-juggle/dataset-sum";
import {PlotAxisRenderer} from "./plot-axis-renderer";
import {copy} from "../shared/copy";
import {DatasetController} from "../data/dataset-controller";
import {FilterableDatasetController} from "../data/filterable-dataset-controller";

/**
 *
 * @class PlotChart
 * @extends Component
 */
export class PlotChart extends Component {
  radius = 23;
  isShowLabels = true;
  configuration = {
    lowColor: 'rgb(184, 233, 148)',
    highColor: 'rgb(0, 122, 255)'
  };
  sort = PlotChartSort.duration;

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
      this.element.attr('id', this.selector);
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
    this.lineHeight = 28;
    this.margin = {
      top: this.defaultMargin,
      right: this.defaultMargin,
      bottom: this.defaultMargin,
      left: this.defaultMargin + 100
    };

    this.isShowLabels = true;

    this.datasets = [];
    this.injectTooltipContainer();

    this.axisRenderer = new PlotAxisRenderer(this);
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
    this.axisRenderer.renderAxis();
    this.axisRenderer.renderGrid();
    this.renderBars();
  }

  /**
   * Updates the plot chart.
   */
  update() {
    this.datasetsDidChange();
    this.sortDatasets();
    this.configureChart();
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
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  /**
   * Creates scales which are used to calculate the x and y positions of bars or circles.
   */
  createScales() {
    let listOfDates = extractDatesFromDatasets(this.workingDatasets);
    let listOfLabels = this.workingDatasets
      .map(dataset => dataset.label)
      .reverse();

    this.xChart = d3
      .scaleBand()
      .domain(listOfDates)
      .rangeRound([this.margin.left, this.width - this.margin.right]);

    this.yChart = d3
      .scaleBand()
      .domain(listOfLabels)
      .rangeRound([this.height - this.margin.bottom, this.margin.top]);

    this.xAxisGrid = d3
      .axisBottom(this.xChart)
      .tickSize(-this.graphHeight)
      .tickFormat('');

    this.yAxisGrid = d3
      .axisLeft(this.yChart)
      .tickSize(-this.graphWidth)
      .tickFormat('');

  }



  /**
   *
   */
  renderBars() {
    let datasets = this.workingDatasets;

    this.max = d3.max(datasets, function (dataset) {
      return d3.max(dataset.data, function (item) {
        return item.value;
      });
    });

    this.defs = this.svg.append("defs");
    for (let index = 0; index < datasets.length; index++) {
      let dataset = datasets[index];
      this.createGradient(dataset);
    }

    let radius = 6;

    this.barsData = this.svg
      .append("g")
      .selectAll("g")
      .data(datasets)
      .enter();

    this.bars = this.barsData
      .append("rect")
      .attr("fill", (d) => `url(#${this.createIDFromDataset(d)})`)
      .style("stroke", 'gray')
      .style("stroke-width", 0.4)
      .attr("rx", radius)
      .attr("ry", radius)
      .attr("x", (d) => this.xChart(d.earliestDate || 0))
      .attr("y", (d) => this.yChart(d.label) + 1)
      .attr("height", this.yChart.bandwidth() - 2)
      .attr("id", (d) => 'rect-' + hashCode(d.label))
      .on('mouseenter', this.showTooltip.bind(this))
      .on('mouseout', this.hideTooltip.bind(this))
      .on('click', this.onClick.bind(this))
      .attr("width", function (data) {
        if (!data.earliestDate || !data.latestDate) return 0;
        return this.xChart(data.latestDate) - this.xChart(data.earliestDate) + this.xChart.bandwidth()
      }.bind(this));

    this.labels = this.barsData
      .append('g')
      .attr('transform', `translate(0,${(this.yChart.bandwidth() / 2) + 4})`)
      .append('text')
      .attr("id", (d) => 'rect-' + hashCode(d.label))
      .attr("fill", 'black')
      .attr('text-anchor', 'start')
      .attr('font-size', '12px')
      .attr('class', 'map-label')
      .attr('opacity', this.isShowLabels ? 1 : 0)
      .attr("x", function (d) {
        let rectX = this.xChart(d.earliestDate);
        let offset = this.xChart.bandwidth() / 2;
        return rectX + offset;
      }.bind(this))
      .attr("y", (d) => this.yChart(d.label))
      .attr("width", (d) => this.xChart(d.latestDate) - this.xChart(d.earliestDate) + this.xChart.bandwidth())
      .text(function (dataset) {
        return `${dataset.duration} years, ${dataset.sum} items`;
      });
  }

  createGradient(dataset) {

    let gradient = this.defs
      .append("linearGradient")
      .attr("id", this.createIDFromDataset(dataset))
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");

    let data = dataset.data;
    let count = data.length;
    let firstDate = dataset.earliestDate;
    let lastDate = dataset.latestDate;
    let timespan = lastDate - firstDate;
    let colorInterpolator = d3.interpolateRgb(
      this.configuration.lowColor,
      this.configuration.highColor
    );

    if (firstDate === lastDate) {

      if (!data || data.length === 0) {
        return;
      }

      let item = data[0];
      let value = item.value;
      let opacity = value / this.max;

      gradient
        .append("stop")
        .attr("offset", `100%`)
        .attr("stop-color", colorInterpolator(opacity));

    } else {

      for (let index = 0; index < count; index++) {

        let item = data[index];
        let date = item.date;
        let opacity = item.value / this.max;

        let dateDifference = lastDate - date;
        let datePercentage = (1 - (dateDifference / timespan)) * 100;

        gradient
          .append("stop")
          .attr("offset", `${datePercentage}%`)
          .attr("stop-color", colorInterpolator(opacity));

      }
    }
  }

  createIDFromDataset(dataset) {
    return hashCode(dataset.label);
  }

  /**
   * Presents the tooltip for the given dataset.
   *
   * @param event The mouse event.
   * @param dataset The dataset.
   */
  showTooltip(event, dataset) {
    let tooltip = this.tooltip;
    let components = [];

    components.push('Label: ' + dataset.label);
    components.push('');
    components.push('Start: ' + dataset.earliestDate);
    components.push('End: ' + dataset.latestDate);
    components.push('');
    components.push('Items: ' + dataset.data.map(item => item.value).reduce((acc, next) => acc + next, 0));
    components.push('');

    for (let index = 0; index < dataset.data.length; index++) {
      let entry = dataset.data[index];
      components.push(`${entry.date}: ${entry.value}`);
    }
    tooltip.html(components.join('<br/>'));

    // position tooltip
    let tooltipHeight = Number(tooltip.style('height').replace('px', ''));
    let factor = this.getElementEffectiveSize()[0] / this.width;
    let offset = this.getElementPosition();
    let top = this.yChart(dataset.label);
    top *= factor;

    let displayUnder = (top - this.margin.top) <= tooltipHeight;
    top += offset[1];

    if (displayUnder) {
      top += this.lineHeight + 10;
    } else {
      top -= tooltipHeight;
      top -= this.lineHeight;
    }

    let left = this.xChart(dataset.earliestDate);
    left *= factor;
    left += offset[0];

    tooltip
      .style('left', left + 'px')
      .style('top', top + 'px')
      .transition()
      .style('opacity', 1);

    let id = 'rect-' + hashCode(dataset.label);

    this.svg
      .selectAll('rect')
      .transition()
      .attr('opacity', 0.15);

    this.labels
      .transition()
      .attr('opacity', this.isShowLabels ? 0.15 : 0);

    this.svg
      .selectAll(`#${id}`)
      .transition()
      .attr('opacity', 1);

    this.labels
      .selectAll(`#${id}`)
      .transition()
      .attr('opacity', 1);

  }

  hideTooltip() {
    this.tooltip.style('opacity', 0);
    this.svg
      .selectAll('rect')
      .transition()
      .attr('opacity', 1);
    this.labels
      .transition()
      .attr('opacity', this.isShowLabels ? 1 : 0);
  }

  /**
   * Appends a division to the svg.
   */
  injectTooltipContainer() {
    this.tooltip = this.element
      .append('div')
      .attr('class', 'chart-tooltip')
      .attr('rx', 5) // corner radius
      .attr('ry', 5)
      .style('position', 'absolute')
      .style('color', 'black')
      .style('border', function () {
        return `solid 1px grey`;
      })
      .style('opacity', 0);
  }

  onClick(event, dataset) {
    console.log('event', event);
    console.log('this.datasetController', this.datasetController);
    console.log('dataset', dataset.label);
    console.log('this', this);
    let label = dataset.label;
    this.datasetController.setDatasetsFilter([label]);

  }

  sortDatasets() {
    this.workingDatasets = this.workingDatasets.reverse();
    switch (this.sort) {
      case PlotChartSort.alphabetically:
        this.workingDatasets = this.workingDatasets
          .sort((set1, set2) => set1.label > set2.label);
        break;
      case PlotChartSort.duration:
        this.workingDatasets = this.workingDatasets
          .sort((set1, set2) => set1.duration < set2.duration);
        break;
      case PlotChartSort.intensity:
        this.workingDatasets = this.workingDatasets
          .sort((set1, set2) => set1.sum < set2.sum);
        break;
      case PlotChartSort.firstDate:
        this.workingDatasets = this.workingDatasets
          .sort((set1, set2) => set1.earliestDate > set2.earliestDate);
        break;
      default:
        break;
    }
  }

  set showLabels(newValue) {
    this.isShowLabels = newValue;
  }

  get showLabels() {
    return this.isShowLabels;
  }

  /**
   * Sets the datasets.
   * @param datasets The array of datasets.
   */
  set datasets(newDatasets) {
    this.setDatasetController(new FilterableDatasetController(newDatasets));
  }

  /**
   * Returns the presented datasets.
   * @returns {*}
   */
  get datasets() {
    return this.datasetController.datasets;
  }

  /**
   *
   */
  datasetsDidChange() {
    if (!this.datasetController) return;
    let datasets = this.datasetController.enabledDatasets;
    this.workingDatasets = copy(datasets);
    this.workingDatasets.forEach(function (dataset) {
      let data = dataset.data;
      let firstDate = extractEarliestDateWithValue(data);
      let lastDate = extractLatestDateWithValue(data);
      let duration = lastDate - firstDate;
      data.forEach(item => item.label = dataset.label);
      data = data.sort((left, right) => left.date > right.date);
      dataset.earliestDate = firstDate;
      dataset.latestDate = lastDate;
      dataset.duration = duration;
      dataset.data = combineByDate(data);
      dataset.sum = sumOfLabel(data, dataset.label);
    });
    this.sortDatasets();
  }

  /**
   *
   * @param newController
   */
  setDatasetController(newController) {
    this.datasetController = newController;
    this.datasetController.addListener(this);
    this.datasetsDidChange();
    this.update();
  }
}

/**
 * Enumeration of sorts available in the plot chart.
 */
export const PlotChartSort = {
  alphabetically: 'alphabetically',
  duration: 'duration',
  intensity: 'intensity',
  firstDate: 'firstDate'
};
