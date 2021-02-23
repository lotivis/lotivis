import {Component} from "../components/component";
import {Color, colorsForStack} from "../shared/colors";
import {URLParameters} from "../shared/url-parameters";
import {TestData} from "../shared/test-data";
import {flattenDatasets} from "../data/dataset-functions";
import {log_debug} from "../shared/debug";

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
    this.presentedDatasetGroups = [];
    this.presentedStacks = [];

    this.labelColor = new Color(155, 155, 155).rgbString();
    this.type = TimeChart.ChartType.Bar;
    this.valueType = 'relative';

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
   *
   * @param datasets
   */
  set datasets(datasets) {
    this._datasets = datasets;
    this._datasets.forEach(dataset => dataset.isEnabled = true);
  }


  // MARK: - Life Cycle

  /**
   * Updates the receiver by calling the draw chart chain: `beforeDrawChart()`,
   * `drawChart()` and `afterDrawChart()`.
   */
  update() {
    this.beforeDrawChart();
    this.drawChart();
    this.afterDrawChart();
  }

  /**
   * Does some (pre)calculations for drawing the chart.
   */
  beforeDrawChart() {
    this.configureChart();
    this.calculatePresentedDatasets();
    this.calculateListOfDatasetNames();
    this.calculateListOfYears();
    this.calculateListOfStacks();
    this.calculateFlattenData();
    this.calculateDatasetsPerYear();
    this.calculateColors();
    this.calculateDatasetStacks();
  }

  /**
   * Creates and renders the chart.
   */
  drawChart() {
    this.createSVG();

    // if (this.datasetStacks.length === 0) return;

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
    this.renderMethod = this.type === 'Bar' ? this.renderBars : this.renderLine;
    let margin = this.margin;
    this.graphWidth = this.width - margin.left - margin.right;
    this.graphHeight = this.height - margin.top - margin.bottom;
  }

  /**
   *
   */
  calculatePresentedDatasets() {
    this.presentedDatasets = this._datasets.filter(dataset => dataset.isEnabled);
  }

  /**
   *
   */
  calculateDatasetStacks() {
    let datasetRef = this.presentedDatasets;
    let datasetsPerYearRef = this.presentedDatasetsPerYear;

    this.datasetStacks = this.listOfStacks.map(function (stackName, index) {

      let stackCandidates = datasetRef.filter(dataset => dataset.stack === stackName);
      let candidatesNames = stackCandidates.map(stackCandidate => stackCandidate.label);
      let candidatesColors = stackCandidates.map(stackCandidate => stackCandidate.color);

      let stack = d3.stack()
        .keys(candidatesNames)
        (datasetsPerYearRef);

      stack.label = stackName;
      stack.stack = stackName;
      stack.colors = candidatesColors;

      return stack;
    });


    this.allDatasetStacks = this.listOfAllStacks.map(function (stackName) {

      let stackCandidates = this._datasets.filter(dataset => dataset.stack === stackName);
      let candidatesNames = stackCandidates.map(stackCandidate => stackCandidate.label);
      let candidatesColors = stackCandidates.map(stackCandidate => stackCandidate.color);

      let stack = d3.stack()
        .keys(candidatesNames)
        (this.datasetsPerYear);

      stack.label = stackName;
      stack.stack = stackName;
      stack.colors = candidatesColors;

      return stack;
    }.bind(this));
  }

  /**
   *
   */
  calculateListOfStacks() {
    let temporaryMap = d3.map(this.presentedDatasets, dataset => dataset.stack || dataset.label);
    this.listOfStacks = Array.from(new Set(temporaryMap));
    log_debug('this.listOfStacks', this.listOfStacks)

    let temporaryMap2 = d3.map(this._datasets, dataset => dataset.stack || dataset.label);
    this.listOfAllStacks = Array.from(new Set(temporaryMap2));
    log_debug('this.listOfAllStacks', this.listOfAllStacks)
  }

  /**s
   *
   */
  calculateListOfYears() {

    let flat = flattenDatasets(this._datasets);
    log_debug('flat', flat);

    if (this.presentedDatasets.length > 0) {
      this.listOfDates = Array.from(new Set(flat.map(item => item.date)));
      this.listOfDates = this.listOfDates.sort();
    } else {
      this.listOfDates = [];
    }

    log_debug('this.listOfYears', this.listOfDates);
  }

  /**
   *
   */
  calculateListOfDatasetNames() {
    this.listOfDatasetNames = this.presentedDatasets.map(dataset => dataset.label);
  }

  /**
   *
   */
  calculateDatasetsPerYear() {
    let flattenData = this.flattenData;
    this.datasetsPerYear = this.listOfDates.map(function (year) {
      let yearSet = {year: year};
      flattenData
        .filter(item => item.date === year)
        .forEach(function (entry) {
          yearSet[entry.label] = entry.value;
          yearSet.total = entry.yearTotal;
        });
      return yearSet;
    });

    this.presentedDatasetsPerYear = this.listOfDates.map(function (year) {
      let yearSet = {year: year};
      flattenData
        .filter(item => item.date === year)
        .filter(item => item.isEnabled === true)
        .forEach(function (entry) {
          yearSet[entry.label] = entry.value;
          yearSet.total = entry.yearTotal;
        });
      return yearSet;
    });
  }

  /**
   *
   */
  calculateFlattenData() {
    this.flattenData = this._datasets.map(function (dataset) {
      dataset.data.forEach(function (item) {
        item.label = dataset.label;
        item.stack = dataset.stack;
        item.key = dataset.stack;
        item.isEnabled = dataset.isEnabled;
      });
      return dataset.data;
    }).flat(1);
  }

  /**
   *
   */
  calculateColors() {
    for (let index = 0; index < this.listOfAllStacks.length; index++) {
      let stackName = this.listOfAllStacks[index];
      let datasets = this._datasets.filter(dataset => dataset.stack === stackName);
      let numberOfDatasets = datasets.length;
      let colors = colorsForStack(index, numberOfDatasets);

      for (let index = 0; index < colors.length; index++) {
        datasets[index].color = colors[index];
      }
    }
  }

  /**
   * Does some calculations after drawing the chart.
   */
  afterDrawChart() {

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

    let image = new Image;

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
   *
   */
  createScales() {

    // console.log('this.listOfYears: ' + this.listOfYears);
    // console.log('this.listOfDatasetNames: ' + this.listOfDatasetNames);
    // console.log('this.listOfStacks: ' + this.listOfStacks);

    log_debug('this.allDatasetStacks', this.allDatasetStacks);

    let max = d3.max(this.allDatasetStacks, function (stack) {
      return d3.max(stack, function (serie) {
        let values = serie.map(item => item['1']);
        return d3.max(values);
      });
    });
    this.max = max;
    console.log('this.max: ' + this.max);

    this.xChart = d3.scaleBand()
      .domain(this.listOfDates)
      .rangeRound([this.margin.left, this.width - this.margin.right])
      .paddingInner(0.1);

    this.xDataset = d3.scaleBand()
      .domain(this.listOfDatasetNames)
      .rangeRound([0, this.xChart.bandwidth()])
      .padding(0.05);

    this.xStack = d3.scaleBand()
      .domain(this.listOfStacks)
      .rangeRound([0, this.xChart.bandwidth()])
      .padding(0.05);

    this.yChart = d3.scaleLinear()
      .domain([0, max]).nice()
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
      .attr("transform", dataset => `translate(0,${this.height - this.margin.bottom})`);
    this.svg
      .append("g")
      .call(d3.axisLeft(this.yChart))
      .attr("transform", dataset => `translate(${this.margin.left},0)`);
  }


  // MARK: - Grid

  /**
   *
   */
  renderGrid() {
    this.svg
      .append('g')
      .attr('class', 'x axis-grid')
      .attr('transform', 'translate(0,' + (this.height - this.margin.bottom) + ')')
      .attr('stroke', 'lightgray')
      .attr('stroke-width', '0.5')
      .attr("opacity", 0.3)
      .call(this.xAxisGrid);
    this.svg
      .append('g')
      .attr('class', 'y axis-grid')
      .attr('transform', `translate(${this.margin.left},0)`)
      .attr('stroke', 'lightgray')
      .attr('stroke-width', '0.5')
      .attr("opacity", 0.3)
      .call(this.yAxisGrid);
  }

  /**
   *
   */
  renderStacks() {
    for (let index = 0; index < this.datasetStacks.length; index++) {
      this.renderBars(this.datasetStacks[index], index);
    }

    if (this.isShowLabels === false) return;
    for (let index = 0; index < this.datasetStacks.length; index++) {
      this.renderBarLabels(this.datasetStacks[index], index);
    }
  }


  // MARK: - Bars

  /**
   *
   * @param stack
   * @param index
   */
  renderBars(stack, index) {
    let xChartRef = this.xChart;
    let yChartRef = this.yChart;
    let xStackRef = this.xStack;
    this.svg.append("g")
      .selectAll("g")
      .data(stack)
      .enter()
      .append("g")
      .attr("fill", function (dataset, index) {
        if (this.isCombineStacks) {
          return stack.colors[0].rgbString();
        } else {
          return stack.colors[index].rgbString();
        }
      }.bind(this))
      .selectAll("rect")
      .data(function (data) {
        return data;
      })
      .enter()
      .append("rect")
      .attr("rx", function () {
        return this.isCombineStacks ? 0 : 4;
      }.bind(this))
      .attr("x", function (d) {
        return xChartRef(d.data.year) + xStackRef(stack.label);
      })
      .attr("y", function (d) {
        return yChartRef(d[1]);
      })
      .attr("height", function (d) {
        return yChartRef(d[0]) - yChartRef(d[1]);
      })
      .attr("width", xStackRef.bandwidth());
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
  createLine() {
    if (this.datasetGroups.length === 0) {
      return debug('no datasets given to render lines.');
    }
    for (let i = 0; i < this.presentedDatasetGroups.length; i++) {
      let dataset = this.presentedDatasetGroups[i];
      let color = colorsForStack(i, 1)[0];
      dataset.color = color;
      this.renderLine(dataset);
    }
  }

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
        .x((item) => this.x0(item.year))
        .y((item) => this.y0(item.value))
        .curve(d3.curveMonotoneX));

    let dots = this.graph
      .selectAll(".dot")
      .data(dataset.data.filter((item) => item.value > 0))
      .enter()
      .append("circle")
      .attr("r", 6)
      .attr("cx", (item) => this.x0(item.year))
      .attr("cy", (item) => this.y0(item.value))
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
          + "<br>Rel.: <b>" + item.relativeValue + "</b>"
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
      .on("mouseout", function (d) {
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
      .attr("x", (item) => this.x0(item.date))
      .attr("y", (item) => this.y0(item.value))
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

    let datasets = this._datasets;
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

    let legendsTexts = legends
      .append('text')
      .attr("font-size", 13)
      .attr("x", function (item) {
        return xLegend(item.label) - 30;
      })
      .attr("y", function (item) {
        return this.graphHeight + labelMargin;
      }.bind(this))
      .style('cursor', 'pointer')
      .style("fill", function (item, index) {
        return item.color.rgbString();
      }.bind(this))
      .text(function (item) {
        return `${item.label} (${this.getSumForWord(item.label)})`;
      }.bind(this));

    let legendsCircles = legends
      .append("circle")
      .attr("r", circleRadius)
      .attr("cx", function (item) {
        return xLegend(item.label) - (circleRadius * 2) - 30;
      }.bind(this))
      .attr("cy", function (item) {
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

    legendsTexts.on('click', function (event) {
      if (!event || !event.target) return;
      if (!event.target.innerHTML) return;
      let components = event.target.innerHTML.split(' (');
      components.pop();
      let label = components.join(" (");
      this.toggleDataset(label);
    }.bind(this));
  }

  renderCombinedStacksLegend() {
    let stackNames = this.listOfAllStacks;
    console.log('stackNames: ' + stackNames);

    let circleRadius = 6;
    let labelMargin = 50;

    let xLegend = d3.scaleBand()
      .domain(stackNames)
      .rangeRound([this.margin.left, this.width - this.margin.right]);

    let legends = this.graph
      .selectAll('.legend')
      .data(stackNames)
      .enter();

    let legendsTexts = legends
      .append('text')
      .attr("font-size", 13)
      .attr("x", function (item) {
        return xLegend(item) - 30;
      })
      .attr("y", function (item) {
        return this.graphHeight + labelMargin;
      }.bind(this))
      .style('cursor', 'pointer')
      .style("fill", function (item, index) {
        return colorsForStack(index, 1)[0].rgbString();
      }.bind(this))
      .text(function (item) {
        return `${item} (${this.getSumForStack(item)})`;
      }.bind(this));

    let legendsCircles = legends
      .append("circle")
      .attr("r", circleRadius)
      .attr("cx", function (item) {
        return xLegend(item) - (circleRadius * 2) - 30;
      }.bind(this))
      .attr("cy", function (item) {
        return this.graphHeight + labelMargin - circleRadius + 2;
      }.bind(this))
      .style('cursor', 'pointer')
      .style("stroke", function (item, index) {
        return colorsForStack(index, 1)[0].rgbString();
      }.bind(this))
      .style("fill", function (item, index) {
        let color = colorsForStack(index, 1)[0];
        return item.isEnabled ? color.rgbString() : 'white';
      }.bind(this))
      .style("stroke-width", 2);

  }

  /**
   *
   * @param label
   */
  toggleDataset(label) {
    console.log(label);
    let dataset = this._datasets.find(dataset => dataset.label === label);
    dataset.isEnabled = !dataset.isEnabled;
    this.update();
  }

  getSumForWord(word) {
    let values = this.flattenData
      .filter(item => item.label === word)
      .map(item => item.value);
    return this.numberFormat.format(d3.sum(values));
  }

  getSumForStack(stackName) {
    let values = this.flattenData
      .filter(item => item.stack === stackName)
      .map(item => item.value);
    return d3.sum(values);
  }
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

