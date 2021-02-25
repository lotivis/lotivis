import {Component} from "../components/component";
import {Color} from "../shared/colors";
import {URLParameters} from "../shared/url-parameters";
import {TestData} from "../shared/test-data";
import {log_debug} from "../shared/debug";
import {flatDatasets} from "../data-juggle/dataset-flat";
import {
  extractDatesFromDatasets,
  extractLabelsFromDatasets,
  extractStacksFromDatasets
} from "../data-juggle/dataset-extract";
import {combineByDate} from "../data-juggle/dataset-combine";
import {dateToItemsRelation} from "../data-juggle/dataset-relations";
import {sumOfLabel, sumOfStack} from "../data-juggle/dataset-sum";

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


  // MARK: - Life Cycle

  /**
   * Updates the receiver by calling the draw chart chain: `beforeDrawChart()`,
   * `drawChart()` and `afterDrawChart()`.
   */
  update() {
    this.configureChart();
    // this.calculateColors();
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
    this.createAxis();
    this.renderAxis();
    this.renderGrid();
    this.renderStacks();
    this.renderLegend();
  }


  // MARK: - Calculate Data

  /**
   *
   */
  configureChart() {
    let margin = this.margin;
    this.graphWidth = this.width - margin.left - margin.right;
    this.graphHeight = this.height - margin.top - margin.bottom;
  }

  // MARK: - SVG

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
      // .attr('width', this.width)
      // .attr('height', this.height)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr("viewBox", `0 0 ${this.width} ${this.height}`)
      .attr('id', TimeChart.svgID);

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
    this.max = d3.max(this.datasetStacks, function (stack) {
      return d3.max(stack, function (serie) {
        let values = serie.map(item => item['1']);
        return d3.max(values);
      });
    });

    log_debug('this.max', this.max);

    this.xChart = d3
      .scaleBand()
      .domain(this.listOfDates)
      .rangeRound([this.margin.left, this.width - this.margin.right])
      .paddingInner(0.1);

    this.xStack = d3
      .scaleBand()
      .domain(this.listOfStacksPresented)
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
  createAxis() {
    this.xAxisGrid = d3
      .axisBottom(this.xChart)
      .tickSize(-this.graphHeight)
      .tickFormat('');

    this.yAxisGrid = d3
      .axisLeft(this.yChart)
      .tickSize(-this.graphWidth)
      .tickFormat('')
      .ticks(20);
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
   */
  renderStacks() {
    for (let index = 0; index < this.datasetStacksPresented.length; index++) {
      let stack = this.datasetStacksPresented[index];
      this.renderBars(stack, index);
    }

    if (this.isShowLabels === false) return;
    for (let index = 0; index < this.datasetStacks.length; index++) {
      let stack = this.datasetStacks[index];
      this.renderBarLabels(stack, index);
    }
  }


  // MARK: - Bars

  /**
   *
   * @param stack
   * @param stackIndex
   */
  renderBars(stack, stackIndex) {
    log_debug('stack', Object.getOwnPropertyNames(stack));
    log_debug('stackIndex', stackIndex);

    this.svg.append("g")
      .selectAll("g")
      .data(stack)
      .enter()
      .append("g")
      .attr("fill", function (dataset, index) {
        log_debug('dataset', dataset);
        if (this.isCombineStacks) {
          return Color.colorsForStack(stackIndex)[0].rgbString();
        } else {
          return stack.colors[index].rgbString();
        }
      }.bind(this))
      .selectAll("rect")
      .data((data) => data)
      .enter()
      .append("rect")
      .attr("rx", this.isCombineStacks ? 0 : 4)
      .attr("x", (d) => this.xChart(d.data.date) + this.xStack(stack.label))
      .attr("y", (d) => this.yChart(d[1]))
      .attr("height", (d) => this.yChart(d[0] || 0) - this.yChart(d[1] || 0))
      .attr("width", this.xStack.bandwidth());
  }

  /**
   *
   * @param stack
   * @param index
   */
  renderBarLabels(stack, index) {
    let xChartRef = this.xChart;
    let yChartRef = this.yChart;
    let xStackRef = this.xStack;
    let numberFormat = this.numberFormat;
    let labelColor = this.labelColor;
    let numberOfSeries = stack.length;
    let serieIndex = 0;

    this.svg.append("g")
      .selectAll('g')
      .data(stack)
      .enter()
      .append('g')
      .attr('fill', labelColor)
      .selectAll('.text')
      .data(function (dataset) {
        return dataset;
      })
      .enter()
      .append('text')
      .attr("transform", function (item) {
        let x = xChartRef(item.data.date) + xStackRef(stack.label) + (xStackRef.bandwidth() / 2);
        let y = yChartRef(item[1]) - 5;
        return `translate(${x},${y})rotate(-60)`;
      })
      .attr("font-size", 13)
      .text(function (item, index) {
        if (index === 0) serieIndex += 1;
        if (serieIndex !== numberOfSeries) return;
        let value = item[1];
        return value === 0 ? '' : numberFormat.format(value);
      });
  }

  // MARK: - Line

  /**
   *
   * @returns {*}
   */
  // createLine() {
  //   for (let i = 0; i < this.presentedDatasetGroups.length; i++) {
  //     let dataset = this.presentedDatasetGroups[i];
  //     dataset.color = colorsForStack(i, 1)[0];
  //     this.renderLine(dataset);
  //   }
  // }

  /**
   *
   * @param dataset
   * @param index
   */
  renderLine(dataset, index) {
    this.graph
      .append("path")
      .datum(dataset.data)
      .attr("fill", "none")
      .attr("stroke", dataset.color.rgbString())
      .attr("stroke-width", 3.5)
      .attr("d", d3.line()
        // .x((item) => this.x0(item.date))
        // .y((item) => this.y0(item.value))
        .curve(d3.curveMonotoneX));

    let dots = this.graph
      .selectAll(".dot")
      .data(dataset.data.filter((item) => item.value > 0))
      .enter()
      .append("circle")
      .attr("r", 6)
      // .attr("cx", (item) => this.x0(item.date))
      // .attr("cy", (item) => this.y0(item.value))
      .attr("fill", dataset.color.rgbString());

    let tooltip = this.element
      .append("div")
      .attr("class", "toolTip")
      .style('z-index', '9999');

    dots
      .on("mousemove", function (event, item) {
        let text = "<b>" + item.searchText + "</b>"
          + " in "
          + "<b>" + item.date + "</b>"
          + "<br>Abs.: <b>" + item.value + "</b>"
          // + "<br>Rel.: <b>" + item.relativeValue + "</b>"
          + "<br>Total Date: <b>" + item.dateTotal + "</b>";
        tooltip
          .style("left", event.pageX - 20 + "px")
          .style("top", event.pageY - 160 + "px")
          .style("padding", "10px")
          .style("background", "none repeat scroll 0 0 #ffffff")
          .style("position", "absolute")
          .style("border", "1px solid " + dataset.color.rgbString())
          .style("display", "inline-block")
          .html(text);
      })
      .on("mouseout", function () {
        tooltip.style("display", "none");
      });

    if (this.isShowLabels === true) {
      this.renderLineLabels(dataset);
    }
  }

  /**
   *
   * @param dataset
   */
  renderLineLabels(dataset) {
    this.graph
      .selectAll(".text")
      .data(dataset.data.filter((item) => item.value > 0))
      .enter()
      .append('text')
      // .attr("x", (item) => this.x0(item.date))
      // .attr("y", (item) => this.y0(item.value))
      .attr('dy', '-10')
      .attr('text-anchor', 'middle')
      .attr("font-size", 15)
      .attr('fill', 'gray')
      .text((item) => this.numberFormat.format(item.value || 0));
  }

  // MARK: - Render Legend

  /**
   *
   */
  renderLegend() {
    if (this.isCombineStacks) {
      this.renderCombinedStacksLegend();
    } else {
      this.renderNormalLegend();
    }
  }

  renderNormalLegend() {
    let datasets = this.workingDatasets;
    let datasetNames = datasets.map(dataset => dataset.label);
    let circleRadius = 6;
    let labelMargin = 50;

    let xLegend = d3.scaleBand()
      .domain(datasetNames)
      .rangeRound([this.margin.left, this.width - this.margin.right]);

    let legends = this.graph
      .selectAll('.legend')
      .data(datasets)
      .enter();

    legends
      .append('text')
      .attr("font-size", 13)
      .attr("x", function (item) {
        return xLegend(item.label) - 30;
      })
      .attr("y", function () {
        return this.graphHeight + labelMargin;
      }.bind(this))
      .style('cursor', 'pointer')
      .style("fill", function (item) {
        return item.color.rgbString();
      }.bind(this))
      .text(function (item) {
        return `${item.label} (${sumOfLabel(this.flatData, item.label)})`;
      }.bind(this))
      .on('click', function (event) {
        if (!event || !event.target) return;
        if (!event.target.innerHTML) return;
        let components = event.target.innerHTML.split(' (');
        components.pop();
        let label = components.join(" (");
        this.toggleDataset(label);
      }.bind(this));

    legends
      .append("circle")
      .attr("r", circleRadius)
      .attr("cx", function (item) {
        return xLegend(item.label) - (circleRadius * 2) - 30;
      }.bind(this))
      .attr("cy", function () {
        return this.graphHeight + labelMargin - circleRadius + 2;
      }.bind(this))
      .style('cursor', 'pointer')
      .style("stroke", function (item) {
        return item.color.rgbString();
      }.bind(this))
      .style("fill", function (item) {
        return item.isEnabled ? item.color.rgbString() : 'white';
      }.bind(this))
      .style("stroke-width", 2);

  }

  renderCombinedStacksLegend() {
    let stackNames = this.listOfStacks;
    let circleRadius = 6;
    let labelMargin = 50;

    let xLegend = d3.scaleBand()
      .domain(stackNames)
      .rangeRound([this.margin.left, this.width - this.margin.right]);

    let legends = this.graph
      .selectAll('.legend')
      .data(stackNames)
      .enter();

    legends
      .append('text')
      .attr("font-size", 13)
      .attr("x", function (item) {
        return xLegend(item) - 30;
      })
      .attr("y", function () {
        return this.graphHeight + labelMargin;
      }.bind(this))
      .style('cursor', 'pointer')
      .style("fill", function (item, index) {
        return Color.colorsForStack(index)[0].rgbString();
      }.bind(this))
      .text(function (item) {
        return `${item} (${sumOfStack(this.flatData, item)})`;
      }.bind(this));

    legends
      .append("circle")
      .attr("r", circleRadius)
      .attr("cx", function (item) {
        return xLegend(item) - (circleRadius * 2) - 30;
      }.bind(this))
      .attr("cy", function () {
        return this.graphHeight + labelMargin - circleRadius + 2;
      }.bind(this))
      .style('cursor', 'pointer')
      .style("stroke", function (item, index) {
        return Color.colorsForStack(index)[0].rgbString();
      }.bind(this))
      .style("fill", function (item, index) {
        return item.isEnabled ? Color.colorsForStack(index)[0].rgbString() : 'white';
      }.bind(this))
      .style("stroke-width", 2);

  }

  /**
   *
   * @param label
   */
  toggleDataset(label) {
    let dataset = this.workingDatasets.find(dataset => dataset.label === label);
    if (!dataset) return;
    dataset.isEnabled = !dataset.isEnabled;
    this.datasetsDidChange();
    this.update();
  }

  /**
   *
   */
  calculateColors() {
    for (let index = 0; index < this.listOfStacks.length; index++) {
      let stackName = this.listOfStacks[index];
      let datasets = this.workingDatasets.filter(function (dataset) {
        return dataset.stack === stackName
          || dataset.label === stackName;
      });

      let numberOfDatasets = datasets.length;
      let colors = Color.colorsForStack(index, numberOfDatasets);

      for (let index = 0; index < colors.length; index++) {
        datasets[index].color = colors[index];
      }
    }

    for (let index = 0; index < this.listOfStacks.length; index++) {
      let stackName = this.listOfStacks[index];
      let datasets = this.presentedDatasets.filter(function (dataset) {
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

  createStackModel(datasets, dateToItemsRelation) {
    let listOfStacks = extractStacksFromDatasets(datasets);
    return listOfStacks.map(function (stackName) {

      let stackCandidates = datasets.filter(function (dataset) {
        return dataset.stack === stackName
          || dataset.label === stackName;
      });

      let candidatesNames = stackCandidates.map(stackCandidate => stackCandidate.label);
      let candidatesColors = stackCandidates.map(stackCandidate => stackCandidate.color);

      let stack = d3.stack()
        .keys(candidatesNames)
        (dateToItemsRelation);

      stack.label = stackName;
      stack.stack = stackName;
      stack.colors = candidatesColors;

      return stack;
    });
  }

  /**
   *
   * @param datasets
   */
  set datasets(datasets) {
    this.originalDatasets = datasets;
    this.workingDatasets = datasets;
    this.workingDatasets.forEach(dataset => dataset.isEnabled = true);
    this.datasetsDidChange();
  }

  /**
   * Returns the presentes datasets.
   * @returns {*}
   */
  get datasets() {
    return this.originalDatasets;
  }

  /**
   *
   */
  datasetsDidChange() {
    this.presentedDatasets = this.workingDatasets.filter(dataset => dataset.isEnabled);
    this.flatData = combineByDate(flatDatasets(this.workingDatasets));
    this.flatDataPresented = combineByDate(flatDatasets(this.presentedDatasets));

    this.flatData.forEach(function (item) {
      item.label = item.dataset;
      item.key = item.stack;
      item.isEnabled = true;
    });

    this.flatDataPresented.forEach(function (item) {
      item.label = item.dataset;
      item.key = item.stack;
      item.isEnabled = true;
    });

    this.listOfLabels = extractLabelsFromDatasets(this.workingDatasets);
    this.listOfLabelsPresented = extractLabelsFromDatasets(this.presentedDatasets);
    this.listOfStacks = extractStacksFromDatasets(this.workingDatasets);
    this.listOfStacksPresented = extractStacksFromDatasets(this.presentedDatasets);

    this.listOfDates = extractDatesFromDatasets(this.workingDatasets);
    this.listOfDatesPresented = extractDatesFromDatasets(this.presentedDatasets);

    this.dateToItemsRelation = dateToItemsRelation(this.flatData);
    this.dateToItemsRelationPresented = dateToItemsRelation(this.flatDataPresented);

    this.calculateColors();

    this.datasetStacks = this.createStackModel(this.workingDatasets, this.dateToItemsRelation);
    this.datasetStacksPresented = this.createStackModel(this.presentedDatasets, this.dateToItemsRelationPresented);

    log_debug('this.workingDatasets', this.workingDatasets);
    log_debug('this.presentedDatasets', this.presentedDatasets);
    log_debug('this.flatData', this.flatData);
    log_debug('this.flatDataPresented', this.flatDataPresented);
    log_debug('this.listOfLabels', this.listOfLabels);
    log_debug('this.listOfLabelsPresented', this.listOfLabelsPresented);
    log_debug('this.listOfStacks', this.listOfStacks);
    log_debug('this.listOfStacksPresented', this.listOfStacksPresented);
    log_debug('this.listOfDates', this.listOfDates);
    log_debug('this.listOfDatesPresented', this.listOfDatesPresented);
    log_debug('this.dateToItemsRelation', this.dateToItemsRelation);
    log_debug('this.dateToItemsRelationPresented', this.dateToItemsRelationPresented);
    log_debug('this.datasetStacks', this.datasetStacks);
    log_debug('this.datasetStacksPresented', this.datasetStacksPresented);

  }

  /**
   *
   */
  // presentedDatasetsDidChange() {
  //
  // }
}

// MARK: - Statics

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

