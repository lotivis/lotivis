/*!
 * lotivis.js v1.0.47
 * https://github.com/lukasdanckwerth/lotivis#readme
 * (c) 2021 lotivis.js Lukas Danckwerth
 * Released under the MIT License
 */
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.lotivis = {}));
}(this, (function (exports) { 'use strict';

/**
 * Creates and returns a unique ID.
 */
var createID;
(function() {
  let uniquePrevious = 0;
  createID = function() {
    return 'lotivis-id-' + uniquePrevious++;
  };
}());

/**
 * Holds
 * @type {{}}
 */
const Constants = {
  // The default margin to use for charts.
  defaultMargin: 60,
  // The default offset for the space between an object an the toolbar.
  tooltipOffset: 7,
  // The default radius to use for bars drawn on a chart.
  barRadius: 5,
  // A Boolean value indicating whether the debug logging is enabled.
  debugLog: false
};

const prefix = '[lotivis]  ';

const verbose_log = console.log;

const debug_log = function (message) {
  if (!Constants.debugLog) return;
  console.log(prefix + message);
};

/**
 *
 * @class Component
 */
class Component {
  element;

  /**
   *
   * @param parent
   */
  constructor(parent) {
    if (!parent) throw 'No parent or selector specified.';
    if (typeof parent === 'string') {
      this.initializeFromSelector(parent);
    } else {
      this.initializeFromParent(parent);
    }
  }

  initializeFromSelector(selector) {
    this.selector = selector;
    this.parent = d3.select('#' + selector);
  }

  initializeFromParent(parent) {
    this.selector = createID();
    this.parent = parent;
  }

  // MARK: - Functions

  show() {
    if (!this.element) return;
    this.element.style('display', '');
  }

  hide() {
    if (!this.element) return;
    this.element.style('display', 'none');
  }

  get isVisible() {
    if (!this.element) return false;
    return this.element.style('display') !== 'none';
  }

  getElementEffectiveSize() {
    let width = this.element.style('width').replace('px', '');
    let height = this.element.style('height').replace('px', '');
    return [Number(width), Number(height)];
  }

  getElementPosition() {
    let element = document.getElementById(this.selector);
    if (!element) return [0, 0];
    let rect = element.getBoundingClientRect();
    let xPosition = rect.x + window.scrollX;
    let yPosition = rect.y + window.scrollY;
    return [xPosition, yPosition];
  }
}

class Color {
  constructor(r, g, b) {
    this.r = Math.round(r);
    this.g = Math.round(g);
    this.b = Math.round(b);
  }

  rgbString() {
    return `rgb(${this.r},${this.g},${this.b})`;
  }

  toString() {
    return this.rgbString();
  }

  colorAdding(r, g, b) {
    return new Color(this.r + r, this.g + g, this.b + b);
  }
}

Color.defaultTint = new Color(0, 122, 255);
Color.organgeLow = new Color(250, 211, 144);
Color.organgeHigh = new Color(229, 142, 38);
Color.redLow = new Color(248, 194, 145);
Color.redHigh = new Color(183, 21, 64);
Color.blueLow = new Color(106, 137, 204);
Color.blueHigh = new Color(12, 36, 97);
Color.lightBlueLow = new Color(130, 204, 221);
Color.lightBlueHight = new Color(10, 61, 98);
Color.greenLow = new Color(184, 233, 148);
Color.greenHight = new Color(7, 153, 146);

Color.stackColors = [
  [Color.blueHigh, Color.blueLow],
  [Color.redHigh, Color.redLow],
  [Color.greenHight, Color.greenLow],
  [Color.organgeHigh, Color.organgeLow],
  [Color.lightBlueHight, Color.lightBlueLow],
];

Color.randomColor = function () {
  return "rgb(" +
    (Math.random() * 255) + ", " +
    (Math.random() * 255) + "," +
    (Math.random() * 255) + ")";
};

Color.colorsForStack = function (stack, amount = 1) {
  if (!Number.isInteger(stack)) {
    return [Color.stackColors[0]];
  }

  let usedAmount = Math.max(amount, 5);
  let stackColors = Color.stackColors[stack % Color.stackColors.length];

  let highColor = stackColors[0];
  let lowColor = stackColors[1];

  let redDiff = lowColor.r - highColor.r;
  let greenDiff = lowColor.g - highColor.g;
  let blueDiff = lowColor.b - highColor.b;

  let redStep = redDiff / usedAmount;
  let greenStep = greenDiff / usedAmount;
  let blueStep = blueDiff / usedAmount;

  let colors = [];

  for (let i = 0; i < amount; i++) {
    let newColor = highColor.colorAdding(redStep * i, greenStep * i, blueStep * i);
    colors.push(newColor);
  }

  return colors;
};

Color.colorGenerator = function (till) {
  return d3
    .scaleLinear()
    .domain([0, 1 / 3 * till, 2 / 3 * till, till])
    .range(['yellow', 'orange', 'red', 'purple']);
};

class DateAxisRenderer {

  constructor(timeChart) {

    /**
     *
     */
    this.createAxis = function () {
      this.xAxisGrid = d3
        .axisBottom(timeChart.xChart)
        .tickSize(-timeChart.graphHeight)
        .tickFormat('');

      this.yAxisGrid = d3
        .axisLeft(timeChart.yChart)
        .tickSize(-timeChart.graphWidth)
        .tickFormat('')
        .ticks(20);
    };

    /**
     *
     */
    this.renderAxis = function () {
      timeChart.svg
        .append("g")
        .call(d3.axisBottom(timeChart.xChart))
        .attr("transform", () => `translate(0,${timeChart.height - timeChart.margin.bottom})`);
      timeChart.svg
        .append("g")
        .call(d3.axisLeft(timeChart.yChart))
        .attr("transform", () => `translate(${timeChart.margin.left},0)`);
    };

    /**
     *
     */
    this.renderGrid = function () {
      let color = 'lightgray';
      let width = '0.5';
      let opacity = 0.3;
      timeChart.svg
        .append('g')
        .attr('class', 'x axis-grid')
        .attr('transform', 'translate(0,' + (timeChart.height - timeChart.margin.bottom) + ')')
        .attr('stroke', color)
        .attr('stroke-width', width)
        .attr("opacity", opacity)
        .call(this.xAxisGrid);
      timeChart.svg
        .append('g')
        .attr('class', 'y axis-grid')
        .attr('transform', `translate(${timeChart.margin.left},0)`)
        .attr('stroke', color)
        .attr('stroke-width', width)
        .attr("opacity", opacity)
        .call(this.yAxisGrid);
    };
  }
}

/**
 *
 */
class DateLabelRenderer {

  /**
   *
   * @param timeChart
   */
  constructor(timeChart) {

    /**
     *
     * @param stack
     * @param index
     */
    this.renderBarLabels = function (stack, index) {
      let xChartRef = timeChart.xChart;
      let yChartRef = timeChart.yChart;
      let xStackRef = timeChart.xStack;
      let numberFormat = timeChart.numberFormat;
      let labelColor = timeChart.labelColor;
      let numberOfSeries = stack.length;
      let seriesIndex = 0;
      let bandwidth = xStackRef.bandwidth() / 2;

      timeChart
        .svg
        .append("g")
        .selectAll('g')
        .data(stack)
        .enter()
        .append('g')
        .attr('fill', labelColor)
        .selectAll('.text')
        .data(dataset => dataset)
        .enter()
        .append('text')
        .attr('class', 'lotivis-date-chart-label')
        .attr("transform", function (item) {
          let x = xChartRef(item.data.date) + xStackRef(stack.label) + bandwidth;
          let y = yChartRef(item[1]) - 5;
          return `translate(${x},${y})rotate(-60)`;
        })
        .text(function (item, index) {
          if (index === 0) seriesIndex += 1;
          if (seriesIndex !== numberOfSeries) return;
          let value = item[1];
          return value === 0 ? '' : numberFormat.format(value);
        });
    };
  }
}

/**
 * Returns the sum of data values for the given dataset.
 *
 * @param flatData The flat data array.
 * @param dataset The dataset name.
 * @returns {*} The sum.
 */
function sumOfDataset(flatData, dataset) {
  return sumOfValues(flatData.filter(item => item.dataset === dataset));
}

/**
 * Returns the sum of data values for the given label.
 *
 * @param flatData The flat data array.
 * @param label The label.
 * @returns {*} The sum.
 */
function sumOfLabel(flatData, label) {
  return sumOfValues(flatData.filter(item => item.label === label));
}

/**
 * Returns the sum of data values for the given stack.
 *
 * @param flatData The flat data array.
 * @param stack The stack name.
 * @returns {*} The sum.
 */
function sumOfStack(flatData, stack) {
  return sumOfValues(flatData.filter(item => item.stack === stack));
}

/**
 * Returns the sum of the value properties of each item.
 *
 * @param flatData
 * @returns {*}
 */
function sumOfValues(flatData) {
  return flatData
    .map(item => +(item.value || 0))
    .reduce((acc, next) => acc + next, 0);
}

class DateLegendRenderer {

  constructor(timeChart) {

    this.renderNormalLegend = function () {
      let controller = timeChart.datasetController;
      let datasets = controller.workingDatasets;
      let datasetNames = controller.labels;
      let circleRadius = 6;
      let labelMargin = 50;

      let xLegend = d3.scaleBand()
        .domain(datasetNames)
        .rangeRound([timeChart.margin.left, timeChart.width - timeChart.margin.right]);

      let legends = timeChart.graph
        .selectAll('.legend')
        .data(datasets)
        .enter();

      legends
        .append('text')
        .attr('class', 'lotivis-date-chart-legend-label')
        .attr("font-size", 13)
        .attr("x", (item) => xLegend(item.label) - 30)
        .attr("y", timeChart.graphHeight + labelMargin)
        .style('cursor', 'pointer')
        .style("fill", function (item) {
          return controller.getColorForDataset(item.label);
        })
        .text((item) => `${item.label} (${controller.getSumOfDataset(item.label)})`)
        .on('click', function (event) {
          if (!event || !event.target) return;
          if (!event.target.innerHTML) return;
          let components = event.target.innerHTML.split(' (');
          components.pop();
          let label = components.join(" (");
          timeChart.toggleDataset(label);
        }.bind(this));

      legends
        .append("circle")
        .attr('class', 'lotivis-date-chart-legend-circle')
        .attr("r", circleRadius)
        .attr("cx", (item) => xLegend(item.label) - (circleRadius * 2) - 30)
        .attr("cy", timeChart.graphHeight + labelMargin - circleRadius + 2)
        .style("stroke", (item) => controller.getColorForDataset(item.label))
        .style("fill", function (item) {
          return item.isEnabled ? controller.getColorForDataset(item.label) : 'white';
        }.bind(this));
    };

    this.renderCombinedStacksLegend = function () {
      let stackNames = timeChart.datasetController.stacks;
      let circleRadius = 6;
      let labelMargin = 50;

      let xLegend = d3
        .scaleBand()
        .domain(stackNames)
        .rangeRound([timeChart.margin.left, timeChart.width - timeChart.margin.right]);

      let legends = timeChart
        .graph
        .selectAll('.lotivis-date-chart-legend-label')
        .data(stackNames)
        .enter();

      legends
        .append('text')
        .attr('class', 'lotivis-date-chart-legend-label')
        .attr("font-size", 23)
        .attr("x", (item) => xLegend(item) - 30)
        .attr("y", function () {
          return timeChart.graphHeight + labelMargin;
        }.bind(this))
        .style('cursor', 'pointer')
        .style("fill", function (item, index) {
          return Color.colorsForStack(index)[0].rgbString();
        }.bind(this))
        .text(function (item) {
          return `${item} (${sumOfStack(timeChart.flatData, item)})`;
        }.bind(this));

      legends
        .append("circle")
        .attr("r", circleRadius)
        .attr("cx", item => xLegend(item) - (circleRadius * 2) - 30)
        .attr("cy", timeChart.graphHeight + labelMargin - circleRadius + 2)
        .style('cursor', 'pointer')
        .style("stroke", function (item, index) {
          return Color.colorsForStack(index)[0].rgbString();
        }.bind(this))
        .style("fill", function (item, index) {
          return item.isEnabled ? Color.colorsForStack(index)[0].rgbString() : 'white';
        }.bind(this))
        .style("stroke-width", 2);

    };
  }
}

class DateBarsRenderer {

  constructor(timeChart) {

    /**
     *
     * @param stack
     * @param stackIndex
     */
    this.renderBars = function (stack, stackIndex) {
      let colors = timeChart.datasetController.getColorsForStack(stack.stack);
      timeChart
        .svg
        .append("g")
        .selectAll("g")
        .data(stack)
        .enter()
        .append("g")
        .attr("fill", function (stackData, index) {
          if (timeChart.isCombineStacks) {
            return colors[0].rgbString();
          } else {
            return stack.colors[index].rgbString();
          }
        })
        .selectAll("rect")
        .data((data) => data)
        .enter()
        .append("rect")
        .attr('class', 'lotivis-date-chart-bar')
        .attr("rx", timeChart.isCombineStacks ? 0 : Constants.barRadius)
        .attr("ry", timeChart.isCombineStacks ? 0 : Constants.barRadius)
        .attr("x", (d) => timeChart.xChart(d.data.date) + timeChart.xStack(stack.label))
        .attr("y", (d) => timeChart.yChart(d[1]))
        .attr("width", timeChart.xStack.bandwidth())
        .attr("height", (d) => timeChart.yChart(d[0]) - timeChart.yChart(d[1]));
    };
  }
}

/**
 * Returns a flat version of the given dataset collection.
 *
 * @param datasets The collection of datasets.
 * @returns {[]} The array containing the flat data.
 */
function flatDatasets(datasets) {
  let flatData = [];
  datasets.forEach(function (dataset) {
    flatData = flatData.concat(flatDataset(dataset));
  });
  return flatData;
}

/**
 * Returns an array containing the flat data of the given dataset.
 *
 * @param dataset The dataset with data.
 * @returns {[]} The array containing the flat data.
 */
function flatDataset(dataset) {
  let flatData = [];
  if (!dataset.data) {
    console.log('Lotivis: Flat data for dataset without data requested. Will return an empty array.');
    return flatData;
  }
  dataset.data.forEach(item => {
    item.dataset = dataset.label;
    item.stack = dataset.stack;
    flatData.push(item);
  });
  return flatData;
}

/**
 * Returns the set of dataset names from the given dataset collection.
 *
 * @param datasets The collection of datasets.
 * @returns {[]} The array containing the flat data.
 */
function extractLabelsFromDatasets(datasets) {
  return toSet(datasets.map(dataset => dataset.label || 'unknown'));
}

/**
 * Returns the set of stacks from the given dataset collection.
 * Will fallback on dataset property if stack property isn't present.
 *
 * @param datasets The collection of datasets.
 * @returns {[]} The array containing the flat data.
 */
function extractStacksFromDatasets(datasets) {
  return toSet(datasets.map(dataset => dataset.stack || dataset.label || 'unknown'));
}

/**
 * Returns the set of dates from the given dataset collection.
 *
 * @param datasets The collection of datasets.
 * @returns {[]} The set containing the dates.
 */
function extractDatesFromDatasets(datasets) {
  return extractDatesFromFlatData(flatDatasets(datasets));
}

/**
 * Returns the set of locations from the given dataset collection.
 *
 * @param datasets The collection of datasets.
 * @returns {[]} The set containing the locations.
 */
function extractLocationsFromDatasets(datasets) {
  return extractLocationsFromFlatData(flatDatasets(datasets));
}

/**
 * Returns the set of dataset names from the given flat data array.
 *
 * @param flatData The flat data array.
 * @returns {[]} The array containing the flat data.
 */
function extractLabelsFromFlatData(flatData) {
  return toSet(flatData.map(item => item.dataset || 'unknown'));
}

/**
 * Returns the set of stacks from the given flat data array.
 * Will fallback on dataset property if stack property isn't present.
 *
 * @param flatData The flat data array.
 * @returns {[]} The array containing the flat data.
 */
function extractStacksFromFlatData(flatData) {
  return toSet(flatData.map(item => item.stack || item.dataset || 'unknown'));
}

/**
 * Returns the set of dates from the given dataset collection.
 *
 * @param flatData The flat data array.
 * @returns {[]} The set containing the dates.
 */
function extractDatesFromFlatData(flatData) {
  return toSet(flatData.map(item => item.date || 'unknown'));
}

/**
 * Returns the set of locations from the given dataset collection.
 *
 * @param flatData The flat data array.
 * @returns {[]} The set containing the locations.
 */
function extractLocationsFromFlatData(flatData) {
  return toSet(flatData.map(item => item.location || "unknown"));
}

/**
 * Return an array containing each equal item of the given array only once.
 *
 * @param array The array to create a set of.
 * @returns {any[]} The set version of the array.
 */
function toSet(array) {
  return Array.from(new Set(array));//.sort();
}

/**
 * Returns the earliest date occurring in the flat array of items.
 *
 * @param flatData The flat data array.
 * @returns {*} The earliest date.
 */
function extractEarliestDate(flatData) {
  return extractDatesFromFlatData(flatData).shift();
}

/**
 * Returns the earliest date occurring in the flat array of items.
 *
 * @param flatData The flat data array.
 * @returns {*} The earliest date.
 */
function extractEarliestDateWithValue(flatData) {
  let withValue = flatData.filter(item => (item.value || 0) > 0);
  return extractDatesFromFlatData(withValue).shift();
}

/**
 * Returns the latest date occurring in the flat array of items.
 *
 * @param flatData The flat data array.
 * @returns {*} The latest date.
 */
function extractLatestDate(flatData) {
  return extractDatesFromFlatData(flatData).pop();
}

/**
 * Returns the latest date occurring in the flat array of items.
 *
 * @param flatData The flat data array.
 * @returns {*} The latest date.
 */
function extractLatestDateWithValue(flatData) {
  let withValue = flatData.filter(item => (item.value || 0) > 0);
  return extractDatesFromFlatData(withValue).pop();
}

/**
 * Returns a copy of the passed object.  The copy is created by using the
 * JSON's `parse` and `stringify` functions.
 *
 * @param object The java script object to copy.
 * @returns {any} The copy of the object.
 */
function copy(object) {
  return JSON.parse(JSON.stringify(object));
}

/**
 * Returns
 *
 * @param flattenList
 * @returns {[]}
 */
function combine(flattenList) {
  let combined = [];
  for (let index = 0; index < flattenList.length; index++) {
    let listItem = flattenList[index];
    let entry = combined.find(function (entryItem) {
      return entryItem.dataset === listItem.dataset
        && entryItem.stack === listItem.stack
        && entryItem.label === listItem.label
        && entryItem.location === listItem.location
        && entryItem.date === listItem.date;
    });
    if (entry) {
      entry.value += (listItem.value + 0);
    } else {
      let entry = {};
      if (listItem.label) entry.label = listItem.label;
      if (listItem.dataset) entry.dataset = listItem.dataset;
      if (listItem.stack) entry.stack = listItem.stack;
      if (listItem.location) entry.location = listItem.location;
      if (listItem.locationTotal) entry.locationTotal = listItem.locationTotal;
      if (listItem.date) entry.date = listItem.date;
      if (listItem.dateTotal) entry.dateTotal = listItem.dateTotal;
      if (listItem.locationName) entry.locationName = listItem.locationName;
      entry.value = (listItem.value || 0);
      combined.push(entry);
    }
  }
  return combined;
}

/**
 * Returns
 *
 * @param flattenList
 * @returns {[]}
 */
function combineByStacks(flattenList) {
  let combined = [];
  for (let index = 0; index < flattenList.length; index++) {
    let listItem = flattenList[index];
    let entry = combined.find(function (entryItem) {
      return entryItem.stack === listItem.stack
        && entryItem.label === listItem.label
        && entryItem.location === listItem.location
        && entryItem.date === listItem.date;
    });
    if (entry) {
      entry.value += (listItem.value + 0);
    } else {
      let entry = {};
      if (listItem.label) entry.label = listItem.label;
      if (listItem.stack) entry.stack = listItem.stack;
      if (listItem.location) entry.location = listItem.location;
      if (listItem.locationTotal) entry.locationTotal = listItem.locationTotal;
      if (listItem.date) entry.date = listItem.date;
      if (listItem.dateTotal) entry.dateTotal = listItem.dateTotal;
      if (listItem.locationName) entry.locationName = listItem.locationName;
      entry.value = (listItem.value || 0);
      combined.push(entry);
    }
  }
  return combined;
}

/**
 *
 * @param flatData
 * @returns {[]}
 */
function combineByDate(flatData) {
  let combined = [];
  for (let index = 0; index < flatData.length; index++) {
    let listItem = flatData[index];
    let entry = combined.find(function (entryItem) {
      return  entryItem.dataset === listItem.dataset
        && entryItem.stack === listItem.stack
        && entryItem.label === listItem.label
        && entryItem.date === listItem.date;
    });
    if (entry) {
      entry.value += (listItem.value + 0);
    } else {
      let entry = {};
      if (listItem.label) entry.label = listItem.label;
      if (listItem.dataset) entry.dataset = listItem.dataset;
      if (listItem.stack) entry.stack = listItem.stack;
      if (listItem.date) entry.date = listItem.date;
      if (listItem.dateTotal) entry.dateTotal = listItem.dateTotal;
      if (listItem.locationName) entry.locationName = listItem.locationName;
      entry.value = (listItem.value || 0);
      combined.push(entry);
    }
  }
  return combined;
}

/**
 *
 * @param flatData
 * @returns {[]}
 */
function combineByLocation(flatData) {
  let combined = [];
  for (let index = 0; index < flatData.length; index++) {
    let listItem = flatData[index];
    let entry = combined.find(function (entryItem) {
      return  entryItem.dataset === listItem.dataset
        && entryItem.stack === listItem.stack
        && entryItem.label === listItem.label
        && entryItem.location === listItem.location;
    });
    if (entry) {
      entry.value += listItem.value;
    } else {
      let entry = {};
      if (listItem.label) entry.label = listItem.label;
      if (listItem.dataset) entry.dataset = listItem.dataset;
      if (listItem.stack) entry.stack = listItem.stack;
      if (listItem.location) entry.location = listItem.location;
      if (listItem.locationTotal) entry.locationTotal = listItem.locationTotal;
      if (listItem.locationName) entry.locationName = listItem.locationName;
      entry.value = listItem.value;
      combined.push(entry);
    }
  }
  return combined;
}

/**
 *
 * @class DatasetsColorsController
 */
class DatasetsColorsController {

  /**
   * Creates a new instance of DatasetsColorsController.
   *
   * @param controller
   */
  constructor(controller) {

    let datasets = controller.workingDatasets;
    let stacks = controller.stacks;
    let labelToColor = {};
    let stackToColors = {};

    for (let sIndex = 0; sIndex < stacks.length; sIndex++) {
      let stack = stacks[sIndex];

      // filter datasets for stack
      let filtered = datasets.filter(function (dataset) {
        return dataset.label === stack || dataset.stack === stack;
      });

      let colors = Color.colorsForStack(sIndex, filtered.length);
      stackToColors[stack] = colors;
      for (let dIndex = 0; dIndex < filtered.length; dIndex++) {
        labelToColor[filtered[dIndex].label] = colors[dIndex];
      }
    }

    this.colorForDataset = function (label) {
      return labelToColor[label] || Color.defaultTint;
    };

    this.colorForStack = function (stack) {
      return stackToColors[stack][0] || Color.defaultTint;
    };

    this.colorsForStack = function (stack) {
      return stackToColors[stack] || [];
    };
  }
}

/**
 *
 * @class DatasetsController
 */
class DatasetsController {

  constructor(datasets) {
    this.datasets = copy(datasets);
    this.workingDatasets = copy(datasets)
      .sort((left, right) => left.label > right.label);
    this.workingDatasets.forEach(dataset => dataset.isEnabled = true);
    this.flatData = flatDatasets(this.workingDatasets);
    this.labels = extractLabelsFromDatasets(datasets);
    this.stacks = extractStacksFromDatasets(datasets);
    this.dates = extractDatesFromDatasets(datasets);
    this.locations = extractLocationsFromDatasets(datasets);
    this.datasetsColorsController = new DatasetsColorsController(this);
    this.dateAccess = function (date) {
      return Date.parse(date);
    };
  }

  get flatDataCombinedStacks() {
    return combineByStacks(this.flatData);
  }

  get flatDataCombinedDates() {
    return combineByDate(this.flatData);
  }

  get flatDataCombinedLocations() {
    return combineByLocation(this.flatData);
  }

  getSumOfLabel(label) {
    return sumOfLabel(this.flatData, label);
  }

  getSumOfDataset(dataset) {
    return sumOfDataset(this.flatData, dataset);
  }

  getSumOfStack(stack) {
    return sumOfStack(this.flatData, stack);
  }

  getMax() {
    return d3.max(this.workingDatasets, function (dataset) {
      return d3.max(dataset.data, function (item) {
        return item.value;
      });
    });
  }

  // MARK: - Colors

  getColorForDataset(label) {
    return this.datasetsColorsController.colorForDataset(label);
  }

  getColorForStack(stack) {
    return this.datasetsColorsController.colorForStack(stack);
  }

  getColorsForStack(stack) {
    return this.datasetsColorsController.colorsForStack(stack);
  }
}

/**
 *
 */
class DatasetsControllerFilter extends DatasetsController {

  constructor(datasets) {
    super(datasets);
    this.listeners = [];
    this.locationFilters = [];
    this.dateFilters = [];
    this.datasetFilters = [];
  }

  resetFilters() {
    this.locationFilters = [];
    this.dateFilters = [];
    this.datasetFilters = [];
    this.notifyListeners('reset-filters');
  }

  setLocationsFilter(locations) {
    this.resetFilters();
    this.locationFilters = locations.map(location => String(location));
    this.notifyListeners('location-filter');
  }

  setDatesFilter(dates) {
    this.resetFilters();
    this.dateFilters = dates.map(date => String(date));
    this.notifyListeners('dates-filter');
  }

  setDatasetsFilter(datasets) {
    this.resetFilters();
    this.datasetFilters = datasets.map(dataset => String(dataset));
    this.notifyListeners('dataset-filter');
  }

  toggleDataset(label) {
    this.workingDatasets.forEach(function (dataset) {
      if (dataset.label === label) {
        dataset.isEnabled = !dataset.isEnabled;
      }
    });
    this.notifyListeners('dataset-toggle');
  }

  enableAllDatasets() {
    this.workingDatasets.forEach(function (dataset) {
      dataset.isEnabled = true;
    });
    this.notifyListeners('dataset-enable-all');
  }

  get enabledDatasets() {

    let aCopy = copy(this.workingDatasets);

    let enabled = aCopy
      .filter(dataset => dataset.isEnabled === true);

    if (this.datasetFilters && this.datasetFilters.length > 0) {
      enabled = enabled.filter(dataset => this.datasetFilters.includes(dataset.label));
    }

    if (this.locationFilters && this.locationFilters.length > 0) {
      let locationFilters = this.locationFilters;
      enabled = enabled.map(function (dataset) {
        dataset.data = dataset.data
          .filter(data => locationFilters.includes(String(data.location))) || [];
        return dataset;
      });
    }

    if (this.dateFilters && this.dateFilters.length > 0) {
      let dateFilters = this.dateFilters;
      enabled = enabled.map(function (dataset) {
        dataset.data = dataset.data
          .filter(data => dateFilters.includes(String(data.date))) || [];
        return dataset;
      });
    }

    return enabled;
  }

  get enabledFlatData() {
    return flatDatasets(this.enabledDatasets);
  }

  get enabledLabels() {
    return extractLabelsFromDatasets(this.enabledDatasets);
  }

  get enabledStacks() {
    return extractStacksFromDatasets(this.enabledDatasets);
  }

  get enabledDates() {
    return extractDatesFromDatasets(this.enabledDatasets);
  }

  // addListener(listener) {
  //   this.listeners.push(listener);
  // }
  //
  // removeListener(listener) {
  //   let index = this.listeners.indexOf(listener);
  //   if (index === -1) return;
  //   this.listeners = this.listeners.splice(index, 1);
  // }
  //
  // notifyListeners(reason = 'none') {
  //   for (let index = 0; index < this.listeners.length; index++) {
  //     let listener = this.listeners[index];
  //     if (!listener.update) continue;
  //     listener.update(this, reason);
  //   }
  // }
}

/**
 *
 * @class DateGhostBarsRenderer
 */
class DateGhostBarsRenderer {

  /**
   * Creates a new instance of DateGhostBarsRenderer.
   * @param dateChart
   */
  constructor(dateChart) {

    function createID(date) {
      return `ghost-rect-${String(date).replaceAll('.', '-')}`;
    }

    this.hideAll = function () {
      dateChart.svg
        .selectAll('.lotivis-selection-rect')
        // .transition()
        .attr("opacity", 0);
    };

    function onMouseEnter(event, date) {
      this.hideAll();
      let controller = dateChart.datasetController;
      let id = createID(date);

      dateChart.updateSensible = false;
      controller.setDatesFilter([date]);
      dateChart.updateSensible = true;
      dateChart
        .svg
        .select(`#${id}`)
        // .transition()
        .attr("opacity", 0.3);

      dateChart.tooltipRenderer.showTooltip(event, date);
    }

    function onMouserOut(event, date) {
      this.hideAll();
      dateChart.tooltipRenderer.hideTooltip(event, date);
      dateChart.datasetController.resetFilters();
    }

    this.renderGhostBars = function () {
      let dates = dateChart.datasetController.dates;
      dateChart
        .svg
        .append("g")
        .selectAll("rect")
        .data(dates)
        .enter()
        .append("rect")
        .attr("class", 'lotivis-selection-rect')
        .attr("id", date => createID(date))
        .attr("opacity", 0)
        .attr("rx", Constants.barRadius)
        .attr("ry", Constants.barRadius)
        .attr("x", (date) => dateChart.xChart(date))
        .attr("y", dateChart.margin.top)
        .attr("width", dateChart.xChart.bandwidth())
        .attr("height", dateChart.height - dateChart.margin.bottom - dateChart.margin.top)
        .on('mouseenter', onMouseEnter.bind(this))
        .on('mouseout', onMouserOut.bind(this));

    };
  }
}

/**
 * Injects and presents a tooltip on a date chart.
 *
 * @class DateTooltipRenderer
 */
class DateTooltipRenderer {

  /**
   * Creates a new instance of DateTooltipRenderer.
   *
   * @constructor
   */
  constructor(dateChart) {

    const tooltip = dateChart
      .element
      .append('div')
      .attr('class', 'lotivis-tooltip')
      .attr('rx', 5) // corner radius
      .attr('ry', 5)
      .style('opacity', 0);

    /**
     * Returns the size [width, height] of the tooltip.
     *
     * @returns {number[]}
     */
    function getTooltipSize() {
      let tooltipWidth = Number(tooltip.style('width').replace('px', ''));
      let tooltipHeight = Number(tooltip.style('height').replace('px', ''));
      return [tooltipWidth, tooltipHeight];
    }

    /**
     * Calculates and returns the top pixel position for the tooltip.
     *
     * @param factor The size factor of the chart.
     * @param offset The offset of the chart.
     * @param tooltipSize The size of the tooltip.
     * @returns {number}
     */
    function getTop(factor, offset, tooltipSize) {
      let top = dateChart.margin.top * factor;
      top += (((dateChart.graphHeight * factor) - tooltipSize[1]) / 2);
      top += offset[1] - 10;
      return top;
    }

    /**
     * Calculates the x offset to position the tooltip on the left side
     * of a bar.
     *
     * @param date The presented date of selected bar.
     * @param factor The size factor of the chart.
     * @param offset The offset of the chart.
     * @param tooltipSize The size of the tooltip.
     * @returns {number} The x offset for the tooltip.
     */
    function getXLeft(date, factor, offset, tooltipSize) {
      let x = dateChart.xChart(date) * factor;
      return x + offset[0] - tooltipSize[0] - 22 - Constants.tooltipOffset;
    }

    /**
     * Calculates the x offset to position the tooltip on the right side
     * of a bar.
     *
     * @param date The presented date of selected bar.
     * @param factor The size factor of the chart.
     * @param offset The offset of the chart.
     * @returns {number} The x offset for the tooltip.
     */
    function getXRight(date, factor, offset) {
      let x = dateChart.xChart(date) + dateChart.xChart.bandwidth();
      x *= factor;
      x += offset[0] + Constants.tooltipOffset;
      return x;
    }

    /**
     * Returns the HTML content for the given date.
     *
     * @param date The date to get the HTML content for.
     * @returns {string} Return the rendered HTML content.
     */
    function getHTMLForDate(date) {
      let flatData = dateChart.datasetController
        .enabledFlatData
        .filter(item => item.date === date);

      let dataHTML = combineByDate(flatData)
        .filter(item => item.value > 0)
        .map(function (item) {
          let color = dateChart.datasetController.getColorForDataset(item.dataset);
          let divHTML = `<div style="background: ${color};color: ${color}; display: inline;">__</div>`;
          return `${divHTML} ${item.dataset}: <b>${item.value}</b>`;
        })
        .join('<br>');

      return `<b>${date}</b><br>${dataHTML}`;
    }

    /**
     * Presents the tooltip next to bar presenting the given date.
     *
     * @param event The mouse event.
     * @param date The date which is presented.
     */
    this.showTooltip = function (event, date) {

      // set examples content before positioning the tooltip cause the size is
      // calculated based on the size
      tooltip.html(getHTMLForDate(date));

      // position tooltip
      let tooltipSize = getTooltipSize();
      let factor = dateChart.getElementEffectiveSize()[0] / dateChart.width;
      let offset = dateChart.getElementPosition();
      let top = getTop(factor, offset, tooltipSize);
      let left = dateChart.xChart(date);

      // differ tooltip position on bar position
      if (left > (dateChart.width / 2)) {
        left = getXLeft(date, factor, offset, tooltipSize);
      } else {
        left = getXRight(date, factor, offset);
      }

      // update position and opacity of tooltip
      tooltip
        .style('left', `${left}px`)
        .style('top', `${top}px`)
        .style('opacity', 1);
    };

    /**
     * Hides the tooltip.  Does nothing if tooltips opacity is already 0.
     */
    this.hideTooltip = function () {
      if (+tooltip.style('opacity') === 0) return;
      tooltip.style('opacity', 0);
    };
  }
}

/**
 *
 * @class Chart
 * @extends Component
 */
class Chart extends Component {

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

    this.svgSelector = createID();
    this.updateSensible = true;
    this.initialize();
    this.update();
  }

  initialize() {
    // empty
  }

  update() {
    if (!this.updateSensible) return;
    this.remove();
    this.precalculate();
    this.draw();
  }

  precalculate() {
    // empty
  }

  remove() {
    // empty
  }

  draw() {
    // empty
  }

  makeUpdateInsensible() {
    this.updateSensible = false;
  }

  makeUpdateSensible() {
    this.updateSensible = true;
  }
}

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
class DateChart extends Chart {

  /**
   * Initializes this diachronic chart by setting the default values.
   * @override
   */
  initialize() {
    this.initializeDefaultValues();
    this.initializeRenderers();
  }

  initializeDefaultValues() {
    this.config = defaultConfig;
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
    this.dataview = this.datasetController.getDateDataview();
  }

  /**
   * Creates scales which are used to calculate the x and y positions of bars or circles.
   */
  createScales() {

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
      .domain([0, this.dataview.max]).nice()
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
    if (!this.dataview || !this.dataview.datasetStacks || this.dataview.datasetStacks.length === 0) return;
    this.axisRenderer.createAxis();
    this.axisRenderer.renderAxis();
    this.axisRenderer.renderGrid();
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
      // .attr('width', this.width)
      // .attr('height', this.height)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr("viewBox", `0 0 ${this.width} ${this.height}`)
      .attr('id', this.svgSelector);

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
    this.setDatasetController(new DatasetsControllerFilter(newDatasets));
  }

  /**
   *
   * @returns {*}
   */
  get datasets() {
    return this.datasetController ? this.datasetController.datasets || [] : [];
  }
}

/**
 * A lotivis card.
 *
 * @class Card
 * @extends Component
 */
class Card extends Component {

  /**
   * Creates a new instance of Card.
   *
   * @param parent The parental component.
   */
  constructor(parent) {
    super(parent);
    this.element = this.parent
      .append('div')
      .classed('lotivis-card', true);
    this.createHeader();
    this.createBody();
    this.createFooter();
  }

  createHeader() {
    this.header = this.element
      .append('div')
      .classed('lotivis-card-header', true);
    this.headerRow = this.header
      .append('div')
      .classed('row', true);
    this.headerLeftComponent = this.headerRow
      .append('div')
      // .classed('col-lg-2', true)
      .classed('col-3', true);
    this.headerCenterComponent = this.headerRow
      .append('div')
      // .classed('col-lg-2', true)
      .classed('col-6', true);
    this.headerRightComponent = this.headerRow
      .append('div')
      // .classed('col-lg-10', true)
      .classed('col-3 button-group', true)
      .classed('text-end', true);
    this.titleLabel = this.headerLeftComponent
      .append('span')
      .text(this.name);
  }

  createBody() {
    this.body = this.element
      .append('div')
      .classed('lotivis-card-body', true);
    this.content = this.body
      .append('div')
      .attr('id', 'content');
  }

  createFooter() {
    this.footer = this.element
      .append('div')
      .classed('lotivis-card-footer', true);
    this.footerRow = this.footer
      .append('div')
      .classed('row', true);
    this.footerLeftComponent = this.footerRow
      .append('div')
      .classed('col-6', true);
    this.footerRightComponent = this.footerRow
      .append('div')
      .classed('col-6', true)
      .classed('text-end', true);
    this.footer.style('display', 'none');
  }
}

/**
 * A button
 *
 * @class Button
 * @extends Component
 */
class Button extends Component {

  /**
   * Creates an instance of Button.
   *
   * @constructor
   * @param {Component} parent The parental component.
   */
  constructor(parent) {
    super(parent);

    let thisRef = this;
    this.element = parent
      .append('button')
      .attr('id', this.selector)
      .on('click', function (event) {
        if (!thisRef.onClick) return;
        thisRef.onClick(event);
      });
  }

  setText(text) {
    this.element.text(text);
  }

  setFontAwesomeImage(imageName) {
    this.element.html('<i class="fas fa-' + imageName + '"></i>');
  }

  onClick(event) {
    // empty
  }
}

/**
 *
 *
 * @class Popup
 * @extends Component
 */
class Popup extends Component {

  /**
   * Creates a new instance of Popup.
   *
   * @param parent The parental component.
   */
  constructor(parent) {
    super(parent);
    this.renderUnderground(parent);
    this.renderContainer();
    this.renderCard();
    this.render();
    this.renderCloseButton();
    this.addCloseActionListeners();
  }

  // MARK: - Render

  /**
   * Appends components to this popup.
   *
   * Should be overridden by subclasses.
   */
  render() {
    // empty
  }

  /**
   * Appends the 'dim' background to the given parent.
   *
   * @param parent The parental element.
   */
  renderUnderground(parent) {
    this.modalBackgroundId = createID();
    this.modalBackground = parent
      .append('div')
      .classed('popup-underground fade-in', true)
      .attr('id', this.modalBackgroundId);
  }

  /**
   *
   */
  renderContainer() {
    this.elementId = createID();
    this.element = this.modalBackground
      .append('div')
      .classed('popup', true)
      .attr('id', this.elementId);
  }

  /**
   *
   */
  renderCard() {
    this.card = new Card(this.element);
    this.card.element.classed('popup arrow arrow-right', true);
  }

  /**
   * Appends a close button to the right header component.
   */
  renderCloseButton() {
    this.closeButton = new Button(this.card.headerRightComponent);
    this.closeButton.element.classed('button-small', true);
    this.closeButton.setText('Close');
  }

  /**
   * Appends an on click listener to the button.
   */
  addCloseActionListeners() {
    let validIDs = [
      this.closeButton.selector,
      this.modalBackgroundId
    ];
    let popup = this;
    this.modalBackground.on('click', function (event) {
      if (!event || !event.target) return;
      if (!validIDs.includes(event.target.id)) return;
      popup.dismiss();
    });
  }

  // MARK: - Life Cycle

  /**
   * Tells the receiving popup that it is about to be presented.
   *
   * Subclasses may override.
   */
  willShow() {
    // empty
  }

  /**
   * Tells the receiving popup that it is now presented.
   *
   * Subclasses may override.
   */
  didShow() {
    // empty
  }

  /**
   * Presents the popup.
   */
  show() {
    if (this.willShow) this.willShow();
    this.getUnderground().style.display = 'block';
    if (this.didShow) this.didShow();
  }

  /**
   * Tells the receiving popup that it is about to be dismissed.
   *
   * Subclasses may override.
   */
  willDismiss() {
    // empty
  }

  /**
   * Tells the receiving popup that the DOM element will be removed.
   *
   * Subclasses may override.
   */
  willRemoveDOMElement() {
    // empty
  }

  /**
   * Dismisses the popup.
   */
  dismiss() {
    if (this.willDismiss) this.willDismiss();
    this.getUnderground().style.display = 'none';
    if (this.willRemoveDOMElement) this.willRemoveDOMElement();
    this.getUnderground().remove();
  }

  getUnderground() {
    return document.getElementById(this.modalBackgroundId);
  }

  showUnder(sourceElement, position = 'center') {
    if (!sourceElement) return;

    let preferredSize = this.preferredSize();
    let origin = this.calculateBottomCenter(sourceElement);

    if (position === 'left') {
      origin.x -= origin.width / 2;
    } else if (position === 'right') {
      origin.x -= preferredSize.width - origin.width / 2;
    } else { // assume center
      origin.x -= (preferredSize.width / 2);
    }

    let id = this.elementId;
    let popup = document.getElementById(id);

    popup.style.position = 'absolute';
    popup.style.width = preferredSize.width + 'px';
    // popup.style.height = preferredSize.height + 'px';
    popup.style.left = origin.x + 'px';
    popup.style.top = origin.y + 'px';

    this.show();
  }

  showBigModal() {
    let id = this.elementId;
    let popup = document.getElementById(id);
    let preferredSize = this.preferredSize();

    popup.style.position = 'relative';
    popup.style.margin = '50px auto';
    popup.style.width = preferredSize.width + 'px';

    this.show();
  }

  /**
   * Returns the preferred size of the popup.  Subclasses may override in order to
   * change the size of the popup.
   *
   * @returns {{width: number, height: number}}
   */
  preferredSize() {
    return {
      width: 300,
      height: 300
    };
  }

  /**
   * Returns the bottom middle point of the passed element.
   *
   * @param element
   * @param respectWindowScroll
   * @returns {{x: number, width: number, y: number, height: number}}
   */
  calculateBottomCenter(element, respectWindowScroll = false) {
    let rect = element.getBoundingClientRect();
    let x = rect.x + (rect.width / 2);
    let y = rect.y + rect.height;

    if (respectWindowScroll) {
      x += window.scrollX;
      y += window.scrollY;
    }

    return {
      x: x,
      y: y,
      width: rect.width,
      height: rect.height
    };
  }
}

class Checkbox extends Component {
  constructor(parent) {
    super(parent);
    this.renderInput();
    this.renderLabel();
  }

  // MARK: - Life Cycle
  renderInput() {
    let thisReference = this;
    this.element = this.parent
      .classed('radio-group', true)
      .append('input')
      .attr('type', 'checkbox')
      .attr('id', this.selector)
      .on('click', function (event) {
        if (!event.target) {
          return;
        }
        let checkbox = event.target;
        if (thisReference.onClick) {
          thisReference.onClick(checkbox.checked);
        }
      });
  }

  renderLabel() {
    this.label = this.parent
      .append('label')
      .attr('for', this.selector)
      .text('Unknown');
  }

  // MARK: - Functions
  setText(text) {
    this.label.text(text);
    return this;
  }

  setChecked(checked) {
    this.element.attr('checked', checked === true ? checked : null);
    return this;
  }

  onClick(checked) {
    // empty
    console.log('onClick: ' + checked);
  }

  enable() {
    this.element.attr('disabled', null);
    this.label.style('color', 'black');
  }

  disable() {
    this.element.attr('disabled', true);
    this.label.style('color', 'gray');
  }
}

/**
 *
 * @class RadioGroup
 * @extends Component
 */
class RadioGroup extends Component {

  /**
   *
   * @param parent The parental component.
   */
  constructor(parent) {
    super(parent);

    this.inputElements = [];
    this.element = this.parent.append('form');
    this.element.classed('radio-group', true);
  }

  /**
   *
   * @param optionId
   * @param optionName
   * @returns {*}
   */
  addOption(optionId, optionName) {
    let inputElement = this.element
      .append('input')
      .attr('type', 'radio')
      .attr('name', this.selector)
      .attr('value', optionId)
      .attr('id', optionId);

    this.element
      .append('label')
      .attr('for', optionId)
      .text(optionName || optionId);

    let thisReference = this;
    inputElement.on("click", function (event) {
      thisReference.onClick(event);
    });

    return inputElement;
  }

  /**
   *
   * @param options
   * @returns {RadioGroup}
   */
  setOptions(options) {
    this.removeOptions();
    this.inputElements = [];
    for (let i = 0; i < options.length; i++) {
      let id = options[i][0] || options[i].id;
      let name = options[i][1] || options[i].translatedTitle;
      let inputElement = this.addOption(id, name);
      if (i === 0) {
        inputElement.attr('checked', 'true');
      }
      this.inputElements.push(inputElement);
    }
    return this;
  }

  /**
   *
   * @param selectedOption
   * @returns {RadioGroup}
   */
  setSelectedOption(selectedOption) {
    for (let i = 0; i < this.inputElements.length; i++) {
      let inputElement = this.inputElements[i];
      let value = inputElement.attr('value');
      if (value === selectedOption) {
        inputElement.attr('checked', 'true');
      }
    }
    return this;
  }

  /**
   *
   * @returns {RadioGroup}
   */
  removeOptions() {
    this.element.selectAll('input').remove();
    this.element.selectAll('label').remove();
    this.inputElements = [];
    return this;
  }

  /**
   *
   * @param event
   */
  onClick(event) {
    let element = event.target;
    if (!element) return;

    let value = element.value;
    if (!this.onChange) return;

    this.onChange(value);

    return this;
  }

  // onChange(newFunction) {
  //     this.onChange = newFunction;
  //     return this;
  // }
  onChange(value) {
  }
}

/**
 *
 * @class UrlParameters
 */
class UrlParameters {

  /**
   * Returns the singleton instance.
   *
   * @returns {UrlParameters}
   */
  static getInstance() {
    if (!UrlParameters.instance) {
      UrlParameters.instance = new UrlParameters();
    }
    return UrlParameters.instance;
  }

  /**
   * Return the current window URL.
   * @returns {URL}
   */
  getURL() {
    return new URL(window.location.href);
  }

  getBoolean(parameter, defaultValue = false) {
    let value = this.getURL().searchParams.get(parameter);
    return value ? value === 'true' : defaultValue;
  }

  getString(parameter, defaultValue = '') {
    return this.getURL().searchParams.get(parameter) || defaultValue;
  }

  set(parameter, newValue) {
    const url = this.getURL();

    if (newValue === false) {
      url.searchParams.delete(parameter);
    } else {
      url.searchParams.set(parameter, newValue);
    }

    window.history.replaceState(null, null, url);
    this.updateCurrentPageFooter();
  }

  setWithoutDeleting(parameter, newValue) {
    const url = this.getURL();
    url.searchParams.set(parameter, newValue);
    window.history.replaceState(null, null, url);
    this.updateCurrentPageFooter();
  }

  clear() {
    const url = this.getURL();
    const newPath = url.protocol + url.host;
    const newURL = new URL(newPath);
    window.history.replaceState(null, null, newURL);
    this.updateCurrentPageFooter();
  }

  updateCurrentPageFooter() {
    // console.log('window.lotivisApplication: ' + window.lotivisApplication);
    // window.lotivisApplication.currentPage.updateFooter();
  }
}

UrlParameters.language = 'language';
UrlParameters.page = 'page';
UrlParameters.query = 'query';
UrlParameters.searchViewMode = 'search-view-mode';
UrlParameters.chartType = 'chart-type';
UrlParameters.chartShowLabels = 'chart-show-labels';
UrlParameters.chartCombineStacks = 'chart-datasetCombine-stacks';
UrlParameters.contentType = 'content-type';
UrlParameters.valueType = 'value-type';
UrlParameters.searchSensitivity = 'search-sensitivity';
UrlParameters.startYear = 'start-year';
UrlParameters.endYear = 'end-year';

UrlParameters.showTestData = 'show-test-data';

/**
 *
 * @class Option
 */
class Option {

  constructor(id, title) {
    this.id = id;
    this.title = title || id;
  }

  get translatedTitle() {
    return this.title;
  }
}

/**
 *
 * @class DateChartSettingsPopup
 * @extends Popup
 */
class DateChartSettingsPopup extends Popup {

  render() {
    this.card
      .headerRow
      .append('h3')
      .text('Settings');
    // this.card
    //     .header
    //     .style('display', 'none');

    this.row = this.card.body
      .append('div')
      .classed('row', true);

    this.renderShowLabelsCheckbox();
    this.renderCombineStacksCheckbox();
    this.renderRadios();
  }

  renderShowLabelsCheckbox() {
    let container = this.row.append('div').classed('col-12 margin-top', true);
    this.showLabelsCheckbox = new Checkbox(container);
    this.showLabelsCheckbox.setText('Labels');
    this.showLabelsCheckbox.onClick = function (checked) {
      this.diachronicChart.isShowLabels = checked;
      this.diachronicChart.update();
      UrlParameters.getInstance().set(UrlParameters.chartShowLabels, checked);
    }.bind(this);
  }

  renderCombineStacksCheckbox() {
    let container = this.row.append('div').classed('col-12', true);
    this.combineStacksCheckbox = new Checkbox(container);
    this.combineStacksCheckbox.setText('Combine Stacks');
    this.combineStacksCheckbox.onClick = function (checked) {
      this.diachronicChart.isCombineStacks = checked;
      this.diachronicChart.update();
      UrlParameters.getInstance().set(UrlParameters.chartCombineStacks, checked);
    }.bind(this);
  }

  renderRadios() {
    let container = this.row.append('div').classed('col-12', true);
    this.typeRadioGroup = new RadioGroup(container);
    this.typeRadioGroup.setOptions([
      new Option('bar', 'Bar'),
      new Option('line', 'Line')
    ]);

    this.typeRadioGroup.onChange = function (value) {
      this.diachronicChart.type = value;
      this.diachronicChart.update();
      UrlParameters.getInstance().set(UrlParameters.chartType, value);
    }.bind(this);
  }

  preferredSize() {
    return {
      width: 240,
      height: 600
    };
  }

  willShow() {
    this.loadValues();
  }

  loadValues() {
    this.showLabelsCheckbox.setChecked(this.diachronicChart.isShowLabels);
    console.log('this.diachronicChart.showLabels: ' + this.diachronicChart.isShowLabels);
    this.combineStacksCheckbox.setChecked(this.diachronicChart.isCombineStacks);
    console.log('this.diachronicChart.combineGroups: ' + this.diachronicChart.isCombineStacks);
    this.typeRadioGroup.setSelectedOption(this.diachronicChart.type);
  }
}

/**
 *
 * @class ChartCard
 * @extends Card
 */
class ChartCard extends Card {
  chart;

  /**
   * Creates a new instance of ChartCard.
   *
   * @param parent The parental component.
   */
  constructor(parent) {
    super(parent);
    this.injectMapChart();
    this.injectButtons();
    this.injectRadioGroup();
  }

  /**
   * Creates and injects a screenshot button and a more button.
   */
  injectButtons() {
    this.screenshotButton = new Button(this.headerRightComponent);
    this.screenshotButton.setText('Screenshot');
    this.screenshotButton.element.classed('simple-button', true);
    this.screenshotButton.setFontAwesomeImage('camera');
    this.screenshotButton.onClick = function (event) {
      this.screenshotButtonAction(event);
    }.bind(this);

    this.moreButton = new Button(this.headerRightComponent);
    this.moreButton.setText('More');
    this.moreButton.element.classed('simple-button', true);
    this.moreButton.setFontAwesomeImage('ellipsis-h');
    this.moreButton.onClick = function (event) {
      this.presentSettingsPopupAction(event);
    }.bind(this);
  }

  /**
   * Creates and injects the chart.
   *
   * Should be overridden by subclasses.
   */
  injectMapChart() {
    // empty
  }

  /**
   * Creates and injects a radio button group.
   */
  injectRadioGroup() {
    this.radioGroup = new RadioGroup(this.headerCenterComponent);
    this.radioGroup.onChange = function (value) {
      let dataset = this.datasets.find(dataset => dataset.label === value);
      this.chart.datasets = [dataset];
      this.chart.update();
    }.bind(this);
  }

  /**
   * Updates the options of the radio button group dependant on the given datasets.
   */
  updateRadioGroup() {
    if (!this.datasets) return;
    let names = this.datasets.map(dataset => dataset.label);
    let options = names.map(name => new Option(name));
    this.radioGroup.setOptions(options);
  }

  setDatasets(datasets) {
    this.datasets = datasets;
    this.updateRadioGroup();
    let firstDataset = datasets[0];
    this.setDataset(firstDataset);
  }

  setDataset(dataset) {
    if (!this.chart) return;
    this.chart.datasets = [dataset];
    this.chart.update();
    if (this.onSelectedDatasetChanged) {
      this.onSelectedDatasetChanged(dataset.stack);
    }
  }

  /**
   * Triggered when the screenshot button is pushed.
   *
   * Should be overridden by subclasses.
   */
  screenshotButtonAction() {
    // empty
  }

  /**
   * Triggered when the more button is pushed.
   *
   * Should be overridden by subclasses.
   */
  presentSettingsPopupAction() {
    // empty
  }

  /**
   * Triggered for a change of the radio group.
   *
   * Should be overridden by subclasses.
   */
  onSelectedDatasetChanged() {
    // empty
  }
}

/**
 * Creates an PNG image from the given svg element and initiates a download of the PNG image.
 *
 * @param selector The id of the svg element.
 * @param filename The name of file which is downloaded.
 */

// http://bl.ocks.org/Rokotyan/0556f8facbaf344507cdc45dc3622177

/**
 * Parses a String from the given (D3.js) SVG node.
 *
 * @param svgNode The node of the SVG.
 * @returns {string} The parsed String.
 */
function getSVGString(svgNode) {

  svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
  let cssStyleText = getCSSStyles(svgNode);
  appendCSS(cssStyleText, svgNode);

  let serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(svgNode);

  // Fix root xlink without namespace
  svgString = svgString.replace(
    /(\w+)?:?xlink=/g,
    'xmlns:xlink='
  );

  // Safari NS namespace fix
  svgString = svgString.replace(
    /NS\d+:href/g,
    'xlink:href'
  );

  return svgString;

  function getCSSStyles(parentElement) {
    let selectorTextArr = [];

    // Add Parent element Id and Classes to the list
    selectorTextArr.push('#' + parentElement.id);
    for (let c = 0; c < parentElement.classList.length; c++) {
      if (!contains('.' + parentElement.classList[c], selectorTextArr)) {
        selectorTextArr.push('.' + parentElement.classList[c]);
      }
    }

    // Add Children element Ids and Classes to the list
    let nodes = parentElement.getElementsByTagName("*");
    for (let i = 0; i < nodes.length; i++) {
      let id = nodes[i].id;
      if (!contains('#' + id, selectorTextArr)) {
        selectorTextArr.push('#' + id);
      }

      let classes = nodes[i].classList;
      for (let c = 0; c < classes.length; c++) {
        if (!contains('.' + classes[c], selectorTextArr)) {
          selectorTextArr.push('.' + classes[c]);
        }
      }
    }

    // Extract CSS Rules
    let extractedCSSText = "";
    for (let i = 0; i < document.styleSheets.length; i++) {
      let s = document.styleSheets[i];

      try {
        if (!s.cssRules) continue;
      } catch (e) {
        if (e.name !== 'SecurityError') throw e; // for Firefox
        continue;
      }

      let cssRules = s.cssRules;
      for (let r = 0; r < cssRules.length; r++) {
        if (contains(cssRules[r].selectorText, selectorTextArr)) {
          extractedCSSText += cssRules[r].cssText;
        }
      }
    }

    return extractedCSSText;

    function contains(str, arr) {
      return arr.indexOf(str) !== -1;
    }
  }

  function appendCSS(cssText, element) {
    let styleElement = document.createElement("style");
    styleElement.setAttribute("type", "text/css");
    styleElement.innerHTML = cssText;
    let refNode = element.hasChildNodes() ? element.children[0] : null;
    element.insertBefore(styleElement, refNode);
  }
}

/**
 *
 * @param svgString
 * @param width
 * @param height
 * @param callback
 */
function svgString2Image(svgString, width, height, callback) {

  // Convert SVG string to data URL
  let imageSource = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));

  let canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  let context = canvas.getContext("2d");
  let image = new Image();
  image.onload = function () {
    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    let data = canvas.toDataURL("image/png");
    if (callback) callback(data);
  };

  image.src = imageSource;
}

/**
 * Returns the size of the viewBox or the normal size of the given svg element.
 *
 * @param svgElement The svg element.
 * @returns {number[]} The size [width, height].
 */
function getOriginalSizeOfSVG(svgElement) {
  let viewBoxBaseValue = svgElement.viewBox.baseVal;
  if (viewBoxBaseValue.width !== 0 && viewBoxBaseValue.height !== 0) {
    return [
      viewBoxBaseValue.width,
      viewBoxBaseValue.height
    ];
  } else {
    return [
      svgElement.width.baseVal.value,
      svgElement.height.baseVal.value,
    ];
  }
}

/**
 * Creates and appends an anchor linked to the given data which is then immediately clicked.
 *
 * @param data The data to be downloaded.
 * @param filename The name of the file.
 */
function downloadData(data, filename) {
  let anchor = document.createElement("a");
  anchor.href = URL.createObjectURL(data);
  anchor.download = appendPNGIfNeeded(filename);
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  /**
   * Appends '.png' to the given string if the given string not already has this extension.
   *
   * @param filename The filename with or without the '.png' extension.
   * @returns {*|string} The filename with a '.png' extension.
   */
  function appendPNGIfNeeded(filename) {
    return filename.endsWith('.png') ? filename : `${filename}.png`;
  }
}

/**
 * Initiates a download of the PNG image of the SVG with the given selector (id).
 *
 * @param selector The id of the SVG element to create the image of.
 * @param filename The name of the file which is been downloaded.
 */
function downloadImage(selector, filename) {
  let svgElement = d3.select('#' + selector);
  let node = svgElement.node();
  let size = getOriginalSizeOfSVG(node);
  let svgString = getSVGString(node);
  svgString2Image(svgString, 2 * size[0], 2 * size[1], function (dataURL) {
    fetch(dataURL)
      .then(res => res.blob())
      .then(function (dataBlob) {
        downloadData(dataBlob, filename);
      });
  });
}

/**
 *
 *
 * @class DateChartCard
 * @extends Card
 */
class DateChartCard extends ChartCard {

  /**
   *
   * @param selector
   * @param name
   */
  constructor(selector, name) {
    super(selector);
    if (!selector) throw 'No selector specified.';
    this.selector = selector;
    this.name = selector;
    this.datasets = [];
    this.renderChart();
    this.renderRadioGroup();
    this.applyURLParameters();
  }

  /**
   *
   */
  renderChart() {
    this.chart = new DateChart(this.body);
    this.chart.margin.left = 50;
    this.chart.margin.right = 50;
  }

  /**
   *
   */
  renderRadioGroup() {
    this.radioGroup = new RadioGroup(this.headerCenterComponent);
    this.radioGroup.onChange = function (value) {
      let dataset = this.datasets.find(dataset => dataset.label === value);
      this.setDataset(dataset);
    }.bind(this);
  }

  /**
   *
   */
  updateRadioGroup() {
    if (!this.datasets) return;
    let names = this.datasets.map(dataset => dataset.label);
    let options = names.map(name => new Option(name));
    this.radioGroup.setOptions(options);
  }

  /**
   *
   */
  applyURLParameters() {
    this.chart.type = UrlParameters.getInstance()
      .getString(UrlParameters.chartType, 'bar');
    this.chart.isShowLabels = UrlParameters.getInstance()
      .getBoolean(UrlParameters.chartShowLabels, false);
    this.chart.isCombineStacks = UrlParameters.getInstance()
      .getBoolean(UrlParameters.chartCombineStacks, false);
  }

  /**
   *
   */
  presentSettingsPopupAction() {
    let bodyElement = d3.select('body');
    let button = document.getElementById(this.moreButton.selector);
    let settingsPopup = new DateChartSettingsPopup(bodyElement);
    settingsPopup.diachronicChart = this.chart;
    settingsPopup.showUnder(button, 'right');
  }

  /**
   * Creates and downloads a screenshot from the chart.
   * @override
   */
  screenshotButtonAction() {
    let labels = this.chart.datasetController.labels;
    let name = labels.join(',') + '-date-chart';
    downloadImage(this.chart.svgSelector, name);
  }
}

/**
 *
 * @param geoJSON
 * @param removeCandidates
 * @returns {*}
 */
function removeFeatures(geoJSON, removeCandidates) {
  let newGeoJSON = geoJSON;
  for (let index = 0; index < removeCandidates.length; index++) {
    let code = removeCandidates[index];
    let candidate = newGeoJSON.features.find(feature => feature.properties.code === code);
    if (!candidate) continue;
    let candidateIndex = newGeoJSON.features.indexOf(candidate);
    if (candidateIndex < 0) continue;
    newGeoJSON.features.splice(candidateIndex, 1);
  }
  return newGeoJSON;
}

/**
 * Returns the style of the given CSS class or an empty object.
 *
 * @param className The CSS class name.
 * @returns {{}} The CSS style.
 */
function styleForCSSClass(className) {
  let selector = className;
  if (!selector.startsWith('.')) selector = '.' + selector;
  let element = document.querySelector(selector);
  if (!element) return {};
  let style = getComputedStyle(element);
  return style ? style : {};
}

/**
 * The default number format.
 *
 * @type {Intl.NumberFormat}
 */
const numberFormat = new Intl.NumberFormat('de-DE', {
  maximumFractionDigits: 3
});

/**
 * Returns the formatted version from the given number.
 *
 * @param number The number to format.
 * @returns {string} The formatted version of the number.
 */
function formatNumber(number) {
  if (typeof number !== 'number') return number;
  return numberFormat.format(number);
}

/**
 * Compares the string version of each oof the two given values for equality.
 * @param value1 The first value to compare.
 * @param value2 The second value to compare.
 * @returns {boolean} True if the string versions are equal, false if not.
 */
function equals(value1, value2) {
  return String(value1) === String(value2);
}

/**
 *
 * @class MapTooltipRenderer
 */
class MapTooltipRenderer {

  /**
   * Creates a new instance of MapTooltipRenderer.
   *
   * @param mapChart
   */
  constructor(mapChart) {
    this.mapChart = mapChart;

    let color = Color.defaultTint.rgbString();
    let tooltip = mapChart
      .element
      .append('div')
      .attr('class', 'lotivis-tooltip')
      .attr('rx', 5) // corner radius
      .attr('ry', 5)
      .style('opacity', 0);

    function featureMapID(feature) {
      return `lotivis-map-area-${mapChart.featureIDAccessor(feature)}`;
    }

    function htmlTitle(feature) {
      let featureID = mapChart.featureIDAccessor(feature);
      let featureName = mapChart.featureNameAccessor(feature);
      return `ID: ${featureID}<br>Name: ${featureName}`;
    }

    function htmlValues(feature) {
      let components = [];
      let featureID = mapChart.featureIDAccessor(feature);
      if (mapChart.datasetController) {
        let flatData = mapChart.datasetController.flatData;
        let combined = combineByLocation(flatData);
        let data = combined.filter(item => equals(item.location, featureID));
        components.push('');
        for (let index = 0; index < data.length; index++) {
          let item = data[index];
          let label = (item.label || item.dataset || item.stack);
          components.push(label + ': ' + formatNumber(item.value));
        }
      }
      return components.join('<br>');
    }

    /**
     * Returns the size of the tooltip.
     * @returns {number[]}
     */
    function getTooltipSize() {
      let tooltipWidth = Number(tooltip.style('width').replace('px', '') || 200);
      let tooltipHeight = Number(tooltip.style('height').replace('px', ''));
      return [tooltipWidth + 20, tooltipHeight + 20];
    }

    /**
     * Called by map geojson renderer when mouse enters an area drawn on the map.
     * @param event The mouse event.
     * @param feature The drawn feature (area).
     */
    this.mouseEnter = function (event, feature) {
      let mapID = featureMapID(feature);
      mapChart
        .svg
        .selectAll(`#${mapID}`)
        .raise() // bring element to top
        .style('stroke', () => color)
        .style('stroke-width', '2')
        .style('stroke-dasharray', '0');

      mapChart
        .svg
        .selectAll('.lotivis-map-label')
        .raise();


      tooltip.html([htmlTitle(feature), htmlValues(feature)].join('<br>'));

      // position tooltip
      let tooltipSize = getTooltipSize();
      let projection = mapChart.projection;
      let featureBounds = d3.geoBounds(feature);
      let featureLowerLeft = projection(featureBounds[0]);
      let featureUpperRight = projection(featureBounds[1]);
      let featureBoundsWidth = featureUpperRight[0] - featureLowerLeft[0];

      // svg is presented in dynamic sized view box so we need to get the actual size
      // of the element in order to calculate a scale for the position of the tooltip.
      let effectiveSize = mapChart.getElementEffectiveSize();
      let factor = effectiveSize[0] / mapChart.width;
      let positionOffset = mapChart.getElementPosition();

      /**
       * Calculates and returns the left position for the tooltip.
       * @returns {*} The left position in pixels.
       */
      function getTooltipLeft() {
        let left = featureLowerLeft[0];
        left += (featureBoundsWidth / 2);
        left *= factor;
        left -= (tooltipSize[0] / 2);
        left += positionOffset[0];
        return left;
      }

      /**
       * Calculates and returns the top tooltip position when displaying above a feature.
       * @returns {*} The top position in pixels.
       */
      function getTooltipLocationAbove() {
        let top = featureUpperRight[1] * factor;
        top -= tooltipSize[1];
        top += positionOffset[1];
        top -= Constants.tooltipOffset;
        return top;
      }

      /**
       * Calculates and returns the top tooltip position when displaying under a feature.
       * @returns {*} The top position in pixels.
       */
      function getTooltipLocationUnder() {
        let top = featureLowerLeft[1] * factor;
        top += positionOffset[1];
        top += Constants.tooltipOffset;
        return top;
      }

      let top = 0;
      if (featureLowerLeft[1] > (mapChart.height / 2)) {
        top = getTooltipLocationAbove();
      } else {
        top = getTooltipLocationUnder();
      }

      let left = getTooltipLeft();
      tooltip
        .style('opacity', 1)
        .style('left', left + 'px')
        .style('top', top + 'px');

      mapChart.onSelectFeature(event, feature);
    };

    /**
     * Called by map geojson renderer when mouse leaves an area drawn on the map.
     * @param event The mouse event.
     * @param feature The drawn feature (area).
     */
    this.mouseOut = function (event, feature) {
      let style = styleForCSSClass('.lotivis-map-area');
      let mapID = featureMapID(feature);
      d3.select(`#${mapID}`)
        .style('stroke', style.stroke || 'black')
        .style('stroke-width', style['stroke-width'] || '0.7')
        .style('stroke-dasharray', (feature) => feature.departmentsData ? '0' : '1,4');
      tooltip.style('opacity', 0);
    };

    /**
     * Raises the tooltip and the rectangle which draws the bounds.
     */
    this.raise = function () {
      tooltip.raise();
    };
  }
}

/**
 *
 * @class MapLegendRenderer
 */
class MapLegendRenderer {

  /**
   * Creates a new instance of MapLegendRenderer.
   *
   * @param mapChart The parental map chart.
   */
  constructor(mapChart) {
    let legend;

    function appendLegend() {
      legend = mapChart.svg
        .append('svg')
        .attr('class', 'lotivis-map-legend')
        .attr('width', mapChart.width)
        .attr('height', 200)
        .attr('x', 0)
        .attr('y', 0);
    }

    function removeDatasetLegend() {
      legend.selectAll('rect').remove();
      legend.selectAll('text').remove();
    }

    this.render = function () {
      if (!mapChart.datasetController) return;

      let stackNames = mapChart.datasetController.stacks;
      let combinedData = mapChart.combinedData;

      appendLegend();
      legend.raise();
      removeDatasetLegend();

      for (let index = 0; index < stackNames.length; index++) {

        let stackName = stackNames[index];
        let dataForStack = combinedData.filter(data => data.stack === stackName);
        let max = d3.max(dataForStack, item => item.value);
        let offset = index * 80;
        let color = Color.colorsForStack(index, 1)[0];

        let steps = 4;
        let data = [0, 1 / 4 * max, 1 / 2 * max, 3 / 4 * max, max];
        let generator = Color.colorGenerator(max);

        legend
          .append('text')
          .attr('class', 'lotivis-map-legend-title')
          .attr('x', offset + 10)
          .attr('y', '20')
          .style('fill', color.rgbString())
          .text(stackName);

        legend
          .append("g")
          .selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
          .attr('class', 'lotivis-map-legend-rect')
          .style('fill', generator)
          .attr('x', offset + 10)
          .attr('y', (d, i) => (i * 20) + 30)
          .attr('width', 18)
          .attr('height', 18)
          .style('stroke', 'black')
          .style('stroke-width', 1);

        legend
          .append("g")
          .selectAll("text")
          .data(data)
          .enter()
          .append("text")
          .attr('class', 'lotivis-map-legend-text')
          .attr('x', offset + 35)
          .attr('y', (d, i) => (i * 20) + 44)
          .text((d, i) => formatNumber((i / steps) * max));
      }
    };
  }
}

/**
 *
 * @class MapLabelRenderer
 */
class MapLabelRenderer {

  /**
   * Creates a new instance of MapLabelRenderer.
   * @param mapChart The parental map chart.
   */
  constructor(mapChart) {

    /**
     * Removes any old labels from the map.
     */
    function removeLabels() {
      mapChart
        .svg
        .selectAll('.lotivis-map-label')
        .remove();
    }

    /**
     * Appends labels from datasets.
     */
    this.render = function () {
      let geoJSON = mapChart.geoJSON;
      if (!mapChart.geoJSON) return debug_log('No Geo JSON to render.');
      let combinedData = mapChart.combinedData;
      if (!mapChart.datasetController) return debug_log('no datasetController');

      removeLabels();
      if (!mapChart.isShowLabels) return;

      mapChart.svg
        .selectAll('text')
        .data(geoJSON.features)
        .enter()
        .append('text')
        .attr('class', 'lotivis-map-label')
        .text(function (feature) {
          let featureID = mapChart.featureIDAccessor(feature);
          let dataset = combinedData.find(dataset => equals(dataset.location, featureID));
          return dataset ? formatNumber(dataset.value) : '';
        })
        .attr('x', function (feature) {
          return mapChart.projection(feature.center)[0];
        }.bind(this))
        .attr('y', function (feature) {
          return mapChart.projection(feature.center)[1];
        }.bind(this));
    };
  }
}

/**
 *
 * @class MapDatasetRenderer
 */
class MapDatasetRenderer {

  /**
   * Creates a new instance of MapDatasetRenderer.
   *
   * @param mapChart The parental map chart.
   */
  constructor(mapChart) {

    let generator = Color.colorGenerator(1);

    /**
     * Resets the `fill` and `fill-opacity` property of each area.
     */
    function resetAreas() {
      styleForCSSClass('.lotivis-map-area');
      mapChart.svg
        .selectAll('.lotivis-map-area')
        .style('fill', 'whitesmoke')
        .style('fill-opacity', 1);
      // .style('fill', style.fill || 'white')
      // .style('fill-opacity', style['fill-opacity'] || 0);
    }

    /**
     * Iterates the datasets per stack and draws them on svg.
     */
    this.render = function () {
      if (!mapChart.geoJSON) return;
      if (!mapChart.datasetController) return;

      let stackNames = mapChart.datasetController.stacks;
      let combinedData = mapChart.combinedData;

      resetAreas();

      for (let index = 0; index < stackNames.length; index++) {

        let stackName = stackNames[index];
        let dataForStack = combinedData.filter(data => data.stack === stackName);
        let max = d3.max(dataForStack, item => item.value);
        mapChart.datasetController.getColorForStack(stackName);

        for (let index = 0; index < dataForStack.length; index++) {

          let datasetEntry = dataForStack[index];
          let locationID = datasetEntry.location;
          let opacity = Number(datasetEntry.value / max);

          mapChart.svg
            .selectAll('.lotivis-map-area')
            .filter((item) => equals(mapChart.featureIDAccessor(item), locationID))
            .style('fill', generator(opacity));
          // .style('fill-opacity', opacity);

        }
      }
    };
  }
}

/**
 * @class MapGeojsonRenderer
 */

class MapGeojsonRenderer {

  /**
   * Creates a new instance of MapGeojsonRenderer.
   * @param mapChart The parental map chart.
   */
  constructor(mapChart) {

    /**
     * To be called when the mouse enters an area drawn on the map.
     * @param event The mouse event.
     * @param feature The drawn feature (area).
     */
    function mouseEnter(event, feature) {
      mapChart.tooltipRenderer.mouseEnter(event, feature);
      mapChart.selectionBoundsRenderer.mouseEnter(event, feature);
    }

    /**
     * To be called when the mouse leaves an area drawn on the map.
     * @param event The mouse event.
     * @param feature The drawn feature (area).
     */
    function mouseOut(event, feature) {
      mapChart.tooltipRenderer.mouseOut(event, feature);
      mapChart.selectionBoundsRenderer.mouseOut(event, feature);
    }

    /**
     * Renders the `geoJSON` property.
     */
    this.renderGeoJson = function () {
      let geoJSON = mapChart.presentedGeoJSON;
      if (!geoJSON) return debug_log('No Geo JSON file to render.');
      let idAccessor = mapChart.featureIDAccessor;

      mapChart.areas = mapChart.svg
        .selectAll('path')
        .data(geoJSON.features)
        .enter()
        .append('path')
        .attr('d', mapChart.path)
        .attr('id', feature => `lotivis-map-area-${idAccessor(feature)}`)
        .classed('lotivis-map-area', true)
        .style('stroke-dasharray', (feature) => feature.departmentsData ? '0' : '1,4')
        .on('click', mapChart.onSelectFeature.bind(mapChart))
        .on('mouseenter', mouseEnter)
        .on('mouseout', mouseOut);
    };
  }
}

/**
 * Returns a new created instance of Feature combining the given Features.
 * @param geoJSON
 * @param features
 */
function joinFeatures(geoJSON) {
  let topology = topojson.topology(geoJSON.features);
  let objects = extractObjects(topology);

  return {
    "type": "FeatureCollection",
    "features": [
      {
        type: "Feature",
        geometry: topojson.merge(topology, objects),
        properties: {
          code: 1,
          nom: "asdf"
        }
      }
    ]
  };
}

/**
 *
 * @param topology
 * @returns {[]}
 */
function extractObjects(topology) {
  let objects = [];
  for (const topologyKey in topology.objects) {
    if (topology.objects.hasOwnProperty(topologyKey)) {
      objects.push(topology.objects[topologyKey]);
    }
  }
  return objects;
}

/**
 *
 * @class MapExteriorBorderRenderer
 */
class MapExteriorBorderRenderer {

  /**
   * Creates a new instance of MapExteriorBorderRenderer.
   *
   * @property mapChart The parental map chart.
   */
  constructor(mapChart) {

    /**
     * Renders the exterior border of the presented geo json.
     */
    this.render = function () {
      if (!self.topojson) return debug_log('Can\'t find topojson lib.  Skip rendering of exterior border.');
      let geoJSON = mapChart.presentedGeoJSON;
      let borders = joinFeatures(geoJSON);
      mapChart.svg
        .append('path')
        .datum(borders)
        .attr('d', mapChart.path)
        .attr('class', 'lotivis-map-exterior-borders');
    };
  }
}

/**
 *
 * @param datasets
 * @returns {{features: [], type: string}}
 */
function createGeoJSON(datasets) {
  let locations = extractLocationsFromDatasets(datasets);
  let rowsCount = Math.ceil(locations.length / 5);
  let latSpan = 0.1;
  let lngSpan = 0.1;
  let features = [];

  loop1: for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
    for (let itemIndex = 0; itemIndex < 5; itemIndex++) {
      if (locations.length === 0) break loop1;
      let location = locations.shift();

      let lat = (itemIndex + 1) * latSpan;
      let lng = (rowIndex + 1) * -lngSpan;

      let coordinates = [];

      coordinates.push([lat, lng]);
      coordinates.push([lat, lng + lngSpan]);
      coordinates.push([lat + latSpan, lng + lngSpan]);
      coordinates.push([lat + latSpan, lng]);
      coordinates.push([0, 0]);

      let feature = {
        type: 'Feature',
        id: location,
        properties: {
          id: location,
          code: location,
          location: location,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            coordinates
          ]
        }
      };

      features.push(feature);
    }
  }

  return {
    type: "FeatureCollection",
    features: features
  };
}

/**
 *
 * @class MapMinimapRenderer
 */

class MapMinimapRenderer {

  /**
   * Creates a new instance of MapMinimapRenderer.
   *
   * @param mapChart The parental map chart.
   */
  constructor(mapChart) {

    this.render = function () {
      mapChart.minimapFeatureCodes;
      // log_debug('miniMapFeatures', miniMapFeatures);
    };
  }
}

/**
 *
 * @param str
 * @returns {number}
 */
function hashCode(str) {
  let hash = 0, i, chr;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

/**
 *
 * @class
 */
class MapSelectionBoundsRenderer {

  /**
   * Creates a new instance of MapSelectionBoundsRenderer.
   *
   * @param mapChart The parental map chart.
   */
  constructor(mapChart) {

    let bounds = mapChart.svg
      .append('rect')
      .attr('class', 'lotivis-map-selection-rect')
      .style('fill-opacity', 0);

    this.mouseEnter = function (event, feature) {
      let projection = mapChart.projection;
      let featureBounds = d3.geoBounds(feature);
      let featureLowerLeft = projection(featureBounds[0]);
      let featureUpperRight = projection(featureBounds[1]);
      let featureBoundsWidth = featureUpperRight[0] - featureLowerLeft[0];
      let featureBoundsHeight = featureLowerLeft[1] - featureUpperRight[1];
      bounds
        .style('opacity', mapChart.drawRectangleAroundSelection ? 1 : 0)
        .style('width', featureBoundsWidth + 'px')
        .style('height', featureBoundsHeight + 'px')
        .style('x', featureLowerLeft[0])
        .style('y', featureUpperRight[1]);
    };

    this.mouseOut = function () {
      bounds.style('opacity', 0);
    };

    /**
     * Raises the rectangle which draws the bounds.
     */
    this.raise = function () {
      bounds.raise();
    };
  }
}

/**
 * A component which renders a geo json with d3.
 *
 * @class MapChart
 * @extends Chart
 */
class MapChart extends Chart {

  /**
   * Creates a new instance of MapChart.
   *
   * @param parent The parental component.
   */
  constructor(parent) {
    super(parent);
    this.element = parent
      .append('div')
      .attr('id', this.selector);

    this.initialize();
    this.renderSVG();
    this.labelRenderer = new MapLabelRenderer(this);
    this.legendRenderer = new MapLegendRenderer(this);
    this.geoJSONRenderer = new MapGeojsonRenderer(this);
    this.datasetRenderer = new MapDatasetRenderer(this);
    this.exteriorBorderRenderer = new MapExteriorBorderRenderer(this);
    this.minimapRenderer = new MapMinimapRenderer(this);
    this.tooltipRenderer = new MapTooltipRenderer(this);
    this.selectionBoundsRenderer = new MapSelectionBoundsRenderer(this);
  }

  /**
   * Initialize with default values.
   */
  initialize() {
    this.width = 1000;
    this.height = 1000;

    this.isShowLabels = true;
    this.geoJSON = null;
    this.departmentsData = [];
    this.excludedFeatureCodes = [];
    this.updateSensible = true;
    this.drawRectangleAroundSelection = true;

    this.featureIDAccessor = function (feature) {
      if (feature.id) return feature.id;
      if (feature.properties && feature.properties.id) return feature.properties.id;
      if (feature.properties && feature.properties.code) return feature.properties.code;
      return hashCode(feature.properties);
    };

    this.featureNameAccessor = function (feature) {
      if (feature.name) return feature.name;
      if (feature.properties && feature.properties.name) return feature.properties.name;
      if (feature.properties && feature.properties.nom) return feature.properties.nom;
      return 'Unknown';
    };

    this.projection = d3.geoMercator();
    this.path = d3.geoPath().projection(this.projection);
  }

  /**
   * Tells the receiving map chart to update its view.
   */
  update() {
    if (!this.updateSensible) return;
    this.geoJSONDidChange();
    this.datasetsDidChange();
  }

  /**
   *
   */
  renderSVG() {
    this.svg = d3
      .select(`#${this.selector}`)
      .append('svg')
      .attr('id', this.svgSelector)
      .attr('class', 'lotivis-chart-svg lotivis-map')
      // .style('width', this.width)
      // .style('height', this.height);
      .attr('viewBox', `0 0 ${this.width} ${this.height}`);

    this.background = this.svg
      .append('rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', 'white');

    // create a background rectangle for receiving mouse enter events
    // in order to reset the location data filter.
    this.background
      .on('mouseenter', function () {
        let controller = this.datasetController;
        if (!controller) return;
        let filters = controller.locationFilters;
        if (!filters || filters.length === 0) return;
        this.updateSensible = false;
        controller.setLocationsFilter([]);
        this.updateSensible = true;
      }.bind(this));
  }

  /**
   * Sets the size of the projection to fit the given geo json.
   *
   * @param geoJSON
   */
  zoomTo(geoJSON) {
    this.projection.fitSize([this.width, this.height], geoJSON);
  }

  /**
   *
   * @param event
   * @param feature
   */
  onSelectFeature(event, feature) {
    if (!feature || !feature.properties) return;
    if (!this.datasetController) return;
    let locationID = this.featureIDAccessor(feature);
    this.updateSensible = false;
    this.datasetController.setLocationsFilter([locationID]);
    this.updateSensible = true;
  }

  /**
   * Sets the presented geo json.
   *
   * @param newGeoJSON
   */
  setGeoJSON(newGeoJSON) {
    this.geoJSON = newGeoJSON;
    this.presentedGeoJSON = newGeoJSON;
    this.geoJSONDidChange();
  }

  /**
   * Tells the receiving map chart that its `geoJSON` property did change.
   */
  geoJSONDidChange() {
    if (!this.geoJSON) return;
    // precalculate the center of each feature
    this.geoJSON.features.forEach((feature) => feature.center = d3.geoCentroid(feature));
    this.presentedGeoJSON = removeFeatures(this.geoJSON, this.excludedFeatureCodes);
    this.zoomTo(this.geoJSON);
    this.exteriorBorderRenderer.render();
    this.geoJSONRenderer.renderGeoJson();
  }

  /**
   *
   * @param newDatasets
   */
  set datasets(newDatasets) {
    this.setDatasetController(new DatasetsControllerFilter(newDatasets));
  }

  /**
   *
   * @returns {*}
   */
  get datasets() {
    if (!this.datasetController) return [];
    return this.datasetController.datasets;
  }

  /**
   * Tells the receiving map chart that its `datasets` property did change.
   */
  datasetsDidChange() {
    if (!this.datasetController) return;
    const combinedByStack = combineByStacks(this.datasetController.enabledFlatData);
    this.combinedData = combineByLocation(combinedByStack);

    this.svg.remove();
    this.renderSVG();

    if (!this.geoJSON) {
      this.geoJSON = createGeoJSON(this.datasetController.workingDatasets);
      this.geoJSONDidChange();
    }

    this.exteriorBorderRenderer.render();
    this.geoJSONRenderer.renderGeoJson();
    this.tooltipRenderer.raise();
    this.legendRenderer.render();
    this.datasetRenderer.render();
    this.labelRenderer.render();
    this.minimapRenderer.render();
    this.tooltipRenderer.raise();
    this.selectionBoundsRenderer.raise();
  }

  /**
   *
   * @param newController
   */
  setDatasetController(newController) {
    this.datasetController = newController;
    this.datasetController.addListener(this);
    this.datasetsDidChange();
  }
}

/**
 * A popup presenting a settings panel for a map chart.
 *
 * @class MapChartSettingsPopup
 * @extends Popup
 */
class MapChartSettingsPopup extends Popup {

  /**
   * Injects the elements of the settings panel.
   * @override
   */
  render() {
    this.card
      .headerRow
      .append('h3')
      .text('Settings');

    this.row = this
      .card
      .body
      .append('div')
      .classed('row', true);

    this.renderShowLabelsCheckbox();
  }

  /**
   * Injects a checkbox to toggle the visibility of the labels of the map chart.
   */
  renderShowLabelsCheckbox() {
    let container = this.row.append('div').classed('col-12 margin-top', true);
    this.showLabelsCheckbox = new Checkbox(container);
    this.showLabelsCheckbox.setText('Labels');
    this.showLabelsCheckbox.onClick = function (checked) {
      this.mapChart.isShowLabels = checked;
      this.mapChart.update();
      UrlParameters.getInstance().setWithoutDeleting('map-show-labels', checked);
    }.bind(this);
  }

  /**
   * Returns the preferred size for this popup.
   * @override
   * @returns {{width: number, height: number}}
   */
  preferredSize() {
    return {width: 240, height: 600};
  }

  /**
   * Tells the popup that it is about to be presented.
   * @override
   */
  willShow() {
    this.showLabelsCheckbox.setChecked(this.mapChart.isShowLabels);
  }
}

/**
 *
 * @class MapChartCard
 * @extends ChartCard
 */
class MapChartCard extends ChartCard {

  /**
   * Creates a new instance of MapChartCard.
   *
   * @param parent The parental component.
   */
  constructor(parent) {
    super(parent);
  }

  /**
   * Creates and injects the map chart.
   */
  injectMapChart() {
    this.chart = new MapChart(this.body);
  }

  /**
   * Creates and downloads a screenshot from the chart.
   * @override
   */
  screenshotButtonAction() {
    let labels = ['unknown'];
    if (this.chart.datasetController) {
      labels = this.chart.datasetController.labels;
    }
    let name = labels.join(',') + '-map-chart';
    downloadImage(this.chart.svgSelector, name);
  }

  /**
   * Triggered when the more button is pushed.
   */
  presentSettingsPopupAction() {
    let bodyElement = d3.select('body');
    let button = document.getElementById(this.moreButton.selector);
    let settingsPopup = new MapChartSettingsPopup(bodyElement);
    settingsPopup.mapChart = this.chart;
    settingsPopup.showUnder(button, 'right');
  }
}

/**
 * Draws the axis on the plot chart.
 * @class PlotAxisRenderer
 */
class PlotAxisRenderer {

  /**
   * Creates a new instance of PlotAxisRenderer.
   * @constructor
   * @param plotChart The parental plot chart.
   */
  constructor(plotChart) {

    /**
     * Appends axis on the top, left and bottom of the plot chart.
     */
    this.renderAxis = function () {

      // top
      plotChart.svg
        .append("g")
        .call(d3.axisTop(plotChart.xChart))
        .attr("transform", () => `translate(0,${plotChart.margin.top})`);

      // left
      plotChart.svg
        .append("g")
        .call(d3.axisLeft(plotChart.yChart))
        .attr("transform", () => `translate(${plotChart.margin.left},0)`);

      // bottom
      plotChart.svg
        .append("g")
        .call(d3.axisBottom(plotChart.xChart))
        .attr("transform", () => `translate(0,${plotChart.height - plotChart.margin.bottom})`);

    };
  }
}

/**
 * Draws the bar on the plot chart.
 * @class PlotBarsRenderer
 */
class PlotBarsRenderer {

  /**
   * Creates a new instance of PlotAxisRenderer.
   * @constructor
   * @param plotChart The parental plot chart.
   */
  constructor(plotChart) {

    // constant for the radius of the drawn bars.
    const radius = 6;

    let definitions = plotChart.svg.append("defs");

    function createIDFromDataset(dataset) {
      if (!dataset || !dataset.label) return 0;
      return dataset.label.replaceAll(' ', '-');
    }

    function createGradient(dataset) {
      let max = plotChart.datasetController.getMax();
      let gradient = definitions
        .append("linearGradient")
        .attr("id", 'lotivis-plot-gradient-' + createIDFromDataset(dataset))
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
        plotChart.configuration.lowColor,
        plotChart.configuration.highColor
      );

      if (firstDate === lastDate) {
        if (!data || data.length === 0) return;
        let item = data[0];
        let value = item.value;
        let opacity = value / max;

        gradient
          .append("stop")
          .attr("offset", `100%`)
          .attr("stop-color", colorInterpolator(opacity));

      } else {

        for (let index = 0; index < count; index++) {

          let item = data[index];
          let date = item.date;
          let opacity = item.value / max;

          let dateDifference = lastDate - date;
          let datePercentage = (1 - (dateDifference / timespan)) * 100;

          gradient
            .append("stop")
            .attr("offset", `${datePercentage}%`)
            .attr("stop-color", colorInterpolator(opacity));

        }
      }
    }

    /**
     * Draws the bars.
     */
    this.renderBars = function () {
      let datasets = plotChart.workingDatasets;
      definitions = plotChart.svg.append("defs");

      for (let index = 0; index < datasets.length; index++) {
        createGradient(datasets[index]);
      }

      plotChart.barsData = plotChart
        .svg
        .append("g")
        .selectAll("g")
        .data(datasets)
        .enter();

      plotChart.bars = plotChart.barsData
        .append("rect")
        .attr("fill", (d) => `url(#lotivis-plot-gradient-${createIDFromDataset(d)})`)
        .attr('class', 'lotivis-plot-bar')
        .attr("rx", radius)
        .attr("ry", radius)
        .attr("x", (d) => plotChart.xChart(d.earliestDate || 0))
        .attr("y", (d) => plotChart.yChart(d.label))
        .attr("height", plotChart.yChart.bandwidth())
        .attr("id", (d) => 'rect-' + createIDFromDataset(d))
        .on('mouseenter', plotChart.tooltipRenderer.showTooltip.bind(plotChart))
        .on('mouseout', plotChart.tooltipRenderer.hideTooltip.bind(plotChart))
        .attr("width", function (data) {
          if (!data.earliestDate || !data.latestDate) return 0;
          return plotChart.xChart(data.latestDate) - plotChart.xChart(data.earliestDate) + plotChart.xChart.bandwidth();
        }.bind(this));
    };
  }
}

/**
 *
 * @class PlotTooltipRenderer
 */
class PlotTooltipRenderer {

  /**
   * Creates a new instance of PlotTooltipRenderer.
   *
   * @constructor
   * @param plotChart
   */
  constructor(plotChart) {

    const tooltip = plotChart
      .element
      .append('div')
      .attr('class', 'lotivis-tooltip')
      .attr('rx', 5) // corner radius
      .attr('ry', 5)
      .style('opacity', 0);

    /**
     *
     * @param dataset
     */
    function getHTMLContentForDataset(dataset) {
      let components = [];

      components.push('Label: ' + dataset.label);
      components.push('');
      components.push('Start: ' + dataset.earliestDate);
      components.push('End: ' + dataset.latestDate);
      components.push('');
      components.push('Items: ' + dataset.data.map(item => item.value).reduce((acc, next) => acc + next, 0));
      components.push('');

      let filtered = dataset.data.filter(item => item.value !== 0);
      for (let index = 0; index < filtered.length; index++) {
        let entry = filtered[index];
        components.push(`${entry.date}: ${entry.value}`);
      }

      return components.join('<br/>');
    }

    /**
     * Returns the pixel position for to tooltip to display it aligned to the left of a bar.
     * @param dataset The dataset to display the tooltip for.
     * @param factor The factor of the view box of the SVG.
     * @param offset The offset of the chart.
     * @returns {*} The left pixel position for the tooltip.
     */
    function getTooltipLeftForDataset(dataset, factor, offset) {
      let left = plotChart.xChart(dataset.earliestDate);
      left *= factor;
      left += offset[0];
      return left;
    }

    /**
     * Presents the tooltip for the given dataset.
     *
     * @param event The mouse event.
     * @param dataset The dataset.
     */
    this.showTooltip = function (event, dataset) {

      tooltip.html(getHTMLContentForDataset(dataset));

      // position tooltip
      let tooltipHeight = Number(tooltip.style('height').replace('px', ''));
      let factor = plotChart.getElementEffectiveSize()[0] / plotChart.width;
      let offset = plotChart.getElementPosition();

      let top = plotChart.yChart(dataset.label) * factor;
      top += offset[1];

      if ((plotChart.yChart(dataset.label) - plotChart.margin.top) <= (plotChart.graphHeight / 2)) {
        top += (plotChart.lineHeight * factor) + Constants.tooltipOffset;
      } else {
        top -= tooltipHeight + 20; // subtract padding
        top -= Constants.tooltipOffset;
      }

      let left = getTooltipLeftForDataset(dataset, factor, offset);

      tooltip
        .style('left', left + 'px')
        .style('top', top + 'px')
        .style('opacity', 1);

      plotChart.onSelectDataset(event, dataset);
    };

    /**
     * Hides the tooltip by setting its opacity to 0.
     */
    this.hideTooltip = function () {
      let controller = plotChart.datasetController;
      let filters = controller.datasetFilters;

      if (filters && filters.length !== 0) {
        controller.resetFilters();
      }

      if (+tooltip.style('opacity') === 0) return;
      tooltip.style('opacity', 0);
    };
  }
}

/**
 *
 * @class PlotLabelRenderer
 */
class PlotLabelRenderer {

  /**
   * Creates a new instance of PlotLabelRenderer.
   *
   * @constructor
   * @param plotChart The parental plot chart.
   */
  constructor(plotChart) {

    /**
     * Draws the labels on the bars on the plot chart.
     */
    this.renderLabels = function () {
      if (!plotChart.isShowLabels) return;
      let xBandwidth = plotChart.yChart.bandwidth();
      let xChart = plotChart.xChart;
      plotChart.labels = plotChart
        .barsData
        .append('g')
        .attr('transform', `translate(0,${(xBandwidth / 2) + 4})`)
        .append('text')
        .attr('class', 'lotivis-plot-label')
        .attr("id", (d) => 'rect-' + hashCode(d.label))
        .attr("x", (d) => xChart(d.earliestDate) + (xBandwidth / 2))
        .attr("y", (d) => plotChart.yChart(d.label))
        .attr("width", (d) => xChart(d.latestDate) - xChart(d.earliestDate) + xBandwidth)
        .text(function (dataset) {
          if (dataset.sum === 0) return;
          return `${dataset.duration} years, ${dataset.sum} items`;
        });
    };
  }
}

/**
 * Draws a grid on the plot chart.
 *
 * @class PlotGridRenderer
 */
class PlotGridRenderer {

  /**
   * Creates a new instance of PlotGridRenderer.
   *
   * @constructor
   * @param plotChart The parental plot chart.
   */
  constructor(plotChart) {

    /**
     * Adds a grid to the chart.
     */
    this.renderGrid = function () {

      plotChart.svg
        .append('g')
        .attr('class', 'lotivis-plot-grid lotivis-plot-grid-x')
        .attr('transform', 'translate(0,' + (plotChart.height - plotChart.margin.bottom) + ')')
        .call(plotChart.xAxisGrid);

      plotChart.svg
        .append('g')
        .attr('class', 'lotivis-plot-grid lotivis-plot-grid-y')
        .attr('transform', `translate(${plotChart.margin.left},0)`)
        .call(plotChart.yAxisGrid);

    };
  }
}

class PlotBackgroundRenderer {

  constructor(plotChart) {

    this.render = function () {
      plotChart.svg
        .append('rect')
        .attr('width', plotChart.width)
        .attr('height', plotChart.height)
        .attr('class', 'lotivis-plot-background');
    };
  }
}

/**
 * A lotivis plot chart.
 *
 * @class PlotChart
 * @extends Chart
 */
class PlotChart extends Chart {
  radius = 23;
  isShowLabels = true;
  configuration = {
    lowColor: 'rgb(184, 233, 148)',
    highColor: 'rgb(0, 122, 255)'
  };
  sort = PlotChartSort.duration;

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
    this.createSVG();
    this.backgroundRenderer = new PlotBackgroundRenderer(this);
    this.axisRenderer = new PlotAxisRenderer(this);
    this.gridRenderer = new PlotGridRenderer(this);
    this.barsRenderer = new PlotBarsRenderer(this);
    this.labelsRenderer = new PlotLabelRenderer(this);
    this.tooltipRenderer = new PlotTooltipRenderer(this);
  }

  /**
   * Appends the svg element to the parental element.
   */
  createSVG() {
    this.svg = this.element
      .append('svg')
      .attr('id', this.svgSelector)
      .attr('class', 'lotivis-chart-svg')
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr("viewBox", `0 0 ${this.width} ${this.height}`);
  }

  /**
   * Removes any (old) components from the svg.
   */
  remove() {
    this.svg.selectAll('*').remove();
  }

  /**
   *
   */
  precalculate() {
    let margin = this.margin;
    let barsCount = 0;
    if (this.workingDatasets && this.workingDatasets.length > 0) {
      barsCount = this.workingDatasets.length;
    }
    this.height = (barsCount * this.lineHeight) + margin.top + margin.bottom;
    this.graphWidth = this.width - margin.left - margin.right;
    this.graphHeight = this.height - margin.top - margin.bottom;

    this.svg
      .attr("viewBox", `0 0 ${this.width} ${this.height}`);

    this.datasetsDidChange();
  }

  /**
   * Creates and renders the chart.
   */
  draw() {
    if (!this.workingDatasets || this.workingDatasets.length === 0) return;
    this.createScales();
    this.backgroundRenderer.render();
    this.gridRenderer.renderGrid();
    this.axisRenderer.renderAxis();
    this.barsRenderer.renderBars();
    this.labelsRenderer.renderLabels();
  }

  /**
   * Updates the plot chart.
   */
  update(controller, reason) {
    if (!this.updateSensible) return;
    if (reason === 'dates-filter') return;
    this.remove();
    this.precalculate();
    this.draw();
  }

  /**
   * Creates scales which are used to calculate the x and y positions of bars or circles.
   */
  createScales() {
    if (!this.workingDatasets || this.workingDatasets.length === 0) return;
    let listOfDates = extractDatesFromDatasets(this.workingDatasets);
    let listOfLabels = this.workingDatasets
      .map(dataset => dataset.label)
      .reverse();

    this.xChart = d3
      .scaleBand()
      .domain(listOfDates)
      .rangeRound([this.margin.left, this.width - this.margin.right])
      .paddingInner(0.1);

    this.yChart = d3
      .scaleBand()
      .domain(listOfLabels)
      .rangeRound([this.height - this.margin.bottom, this.margin.top])
      .paddingInner(0.1);

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
   * @param event
   * @param dataset
   */
  onSelectDataset(event, dataset) {
    if (!dataset || !dataset.label) return;
    let label = dataset.label;
    this.updateSensible = false;
    this.datasetController.setDatasetsFilter([label]);
    this.updateSensible = true;
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
   * @param newDatasets The array of datasets.
   */
  set datasets(newDatasets) {
    this.setDatasetController(new DatasetsControllerFilter(newDatasets));
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
      data = data.sort((left, right) => left.date - right.date);
      dataset.earliestDate = firstDate;
      dataset.latestDate = lastDate;
      dataset.duration = duration;
      dataset.data = combineByDate(data);
      dataset.sum = sumOfLabel(data, dataset.label);
    });
    this.sortDatasets();
    this.createScales();
  }

  /**
   *
   * @param newController
   */
  setDatasetController(newController) {
    this.datasetController = newController;
    this.datasetController.addListener(this);
    this.update();
  }
}

/**
 * Enumeration of sorts available in the plot chart.
 */
const PlotChartSort = {
  alphabetically: 'alphabetically',
  duration: 'duration',
  intensity: 'intensity',
  firstDate: 'firstDate'
};

/**
 *
 * @class Dropdown
 * @extends Component
 */
class Dropdown extends Component {

    constructor(parent) {
        super(parent);
        this.inputElements = [];
        this.selector = createID();
        this.element = parent
            .append('div')
            .classed('dropdown-container', true);
        this.selectId = createID();
        this.renderLabel();
        this.renderSelect();
    }

    renderLabel() {
        this.label = this.element
            .append('label')
            .attr('for', this.selectId);
    }

    renderSelect() {
        let thisReference = this;
        this.select = this.element
            .append('select')
            .classed('form-control form-control-sm', true)
            .attr('id', this.selectId)
            .on('change', function (event) {
                thisReference.onClick(event);
            });
    }

    addOption(optionId, optionName) {
        return this.select
            .append('option')
            .attr('id', optionId)
            .attr('value', optionId)
            .text(optionName);
    }

    setOptions(options) {
        this.removeAllInputs();
        for (let i = 0; i < options.length; i++) {
            let id = options[i][0] || options[i].id;
            let name = options[i][1] || options[i].translatedTitle;
            let inputElement = this.addOption(id, name);
            this.inputElements.push(inputElement);
        }
        return this;
    }

    removeAllInputs() {
        this.element.selectAll('input').remove();
        return this;
    }

    onClick(event) {
        let element = event.target;
        if (!element) {
            return;
        }
        let value = element.value;
        if (!this.onChange) {
            return;
        }
        this.onChange(value);
        return this;
    }

    onChange(argument) {
        console.log('argument: ' + argument);
        if (typeof argument !== 'string') {
            this.onChange = argument;
        }
        return this;
    }

    // MARK: - Chaining Setter

    setLabelText(text) {
        this.label.text(text);
        return this;
    }

    setOnChange(callback) {
        this.onChange = callback;
        return this;
    }

    setSelectedOption(optionID) {
        if (this.inputElements.find(function (item) {
            return item.attr('value') === optionID;
        }) !== undefined) {
            this.value = optionID;
        }
        return this;
    }

    set value(optionID) {
        document.getElementById(this.selectId).value = optionID;
    }

    get value() {
        return document.getElementById(this.selectId).value;
    }
}

/**
 *
 * @class PlotChartSettingsPopup
 * @extends Popup
 */
class PlotChartSettingsPopup extends Popup {

  /**
   * Appends the headline and the content row of the popup.
   */
  render() {
    this.card.headerRow.append('h3').text('Settings');
    this.row = this.card.body.append('div').classed('row', true);
    this.renderShowLabelsCheckbox();
  }

  /**
   * Appends the checkboxes the popups content.
   */
  renderShowLabelsCheckbox() {
    let container = this.row.append('div').classed('col-12 margin-top', true);
    this.showLabelsCheckbox = new Checkbox(container);
    this.showLabelsCheckbox.setText('Labels');
    this.showLabelsCheckbox.onClick = function (checked) {
      this.chart.showLabels = checked;
      this.chart.update();
      UrlParameters.getInstance().set(UrlParameters.chartShowLabels, checked);
    }.bind(this);

    let dropdownContainer = this.row.append('div').classed('col-12', true);
    this.sortDropdown = new Dropdown(dropdownContainer);
    this.sortDropdown.setLabelText('Sort');
    this.sortDropdown.setOptions([
      new Option(PlotChartSort.alphabetically),
      new Option(PlotChartSort.duration),
      new Option(PlotChartSort.intensity),
      new Option(PlotChartSort.firstDate)
    ]);
    this.sortDropdown.setOnChange(function (value) {
      this.chart.sort = value;
      this.chart.update();
    }.bind(this));
  }

  /**
   * Returns the preferred size of the popup.
   * @returns {{width: number, height: number}}
   */
  preferredSize() {
    return {
      width: 240,
      height: 600
    };
  }

  /**
   * Tells this popup that it is about to be displayed.
   */
  willShow() {
    verbose_log('this.chart.showLabels', this.chart.showLabels);
    this.showLabelsCheckbox.setChecked(this.chart.showLabels);
    this.sortDropdown.setSelectedOption(this.chart.sort);
  }
}

/**
 * A card containing a plot chart.
 *
 * @class PlotChartCard
 * @extends Card
 */
class PlotChartCard extends ChartCard {

  /**
   * Creates a new instance of PlotChartCard.
   *
   * @param selector The selector
   * @param name
   */
  constructor(selector, name) {
    super(selector);
    if (!selector) throw 'No selector specified.';
    this.selector = selector;
    this.name = selector;
    this.datasets = [];
    this.injectChart();
    this.injectRadioGroup();
    this.applyURLParameters();
  }

  /**
   * Injects the plot chart in the body of the card.
   */
  injectChart() {
    this.chart = new PlotChart(this.body);
    this.chart.margin.left = 120;
    this.chart.margin.right = 50;
  }

  /**
   * Injects the radio group in the top.
   */
  injectRadioGroup() {
    this.radioGroup = new RadioGroup(this.headerCenterComponent);
    this.radioGroup.onChange = function (value) {
      let dataset = this.datasets.find(dataset => dataset.label === value);
      this.setDataset(dataset);
    }.bind(this);
  }

  /**
   * Updates the button in the radio group.
   */
  updateRadioGroup() {
    if (!this.datasets) return;
    let names = this.datasets.map(dataset => dataset.label);
    let options = names.map(name => new Option(name));
    this.radioGroup.setOptions(options);
  }

  /**
   * Applies possible url parameters.
   */
  applyURLParameters() {
    let instance = UrlParameters.getInstance();
    this.chart.type = instance.getString(UrlParameters.chartType, 'bar');
    this.chart.isShowLabels = instance.getBoolean(UrlParameters.chartShowLabels, false);
    this.chart.isCombineStacks = instance.getBoolean(UrlParameters.chartCombineStacks, false);
  }

  /**
   * Presents the settings popup.
   */
  presentSettingsPopupAction() {
    let bodyElement = d3.select('body');
    let button = document.getElementById(this.moreButton.selector);
    let settingsPopup = new PlotChartSettingsPopup(bodyElement);
    settingsPopup.chart = this.chart;
    settingsPopup.showUnder(button, 'right');
  }

  /**
   * Creates and downloads a screenshot from the chart.
   * @override
   */
  screenshotButtonAction() {
    let labels = this.chart.datasetController.labels;
    let name = labels.join(',') + '-plot-chart';
    downloadImage(this.chart.svgSelector, name);
  }
}

/**
 * @class Geometry
 */
class Geometry {

  /**
   * Creates a new instance of Geometry.
   *
   * @param source
   */
  constructor(source) {
    this.type = source.type;
    this.coordinates = source.coordinates;
  }
}

/**
 *
 * @class Feature
 */
class Feature {

  constructor(source) {
    this.type = source.type;
    this.properties = source.properties;
    this.geometry = new Geometry(source.geometry);
  }
}

/**
 *
 * @class GeoJson
 */
class GeoJson {

  constructor(source) {
    this.type = source.type;
    this.features = [];

    if (source.features) {
      for (let index = 0; index < source.features.length; index++) {
        let featureSource = source.features[index];
        let feature = new Feature(featureSource);
        this.features.push(feature);
      }
    } else {
      this.properties = source.properties;
      this.geometry = new Geometry(source.geometry);
    }
  }

  getCenter() {
    let allCoordinates = this.extractAllCoordinates();
    console.log('allCoordinates.length: ' + allCoordinates.length);
    let latitudeSum = 0;
    let longitudeSum = 0;

    allCoordinates.forEach(function (coordinates) {
      latitudeSum += coordinates[1];
      longitudeSum += coordinates[0];
    });

    return [
      latitudeSum / allCoordinates.length,
      longitudeSum / allCoordinates.length
    ];
  }

  extractGeometryCollection() {
    let geometryCollection = [];
    if (this.type === 'Feature') {
      geometryCollection.push(this.geometry);
    } else if (this.type === 'FeatureCollection') {
      this.features.forEach(feature => geometryCollection.push(feature.geometry));
    } else if (this.type === 'GeometryCollection') {
      this.geometries.forEach(geometry => geometryCollection.push(geometry));
    } else {
      throw new Error('The geoJSON is not valid.');
    }
    return geometryCollection;
  }

  extractAllCoordinates() {
    let geometryCollection = this.extractGeometryCollection();
    let coordinatesCollection = [];

    geometryCollection.forEach(item => {

      let coordinates = item.coordinates;
      let type = item.type;

      if (type === 'Point') {
        console.log("Point: " + coordinates.length);
        coordinatesCollection.push(coordinates);
      } else if (type === 'MultiPoint') {
        console.log("MultiPoint: " + coordinates.length);
        coordinates.forEach(coordinate => coordinatesCollection.push(coordinate));
      } else if (type === 'LineString') {
        console.log("LineString: " + coordinates.length);
        coordinates.forEach(coordinate => coordinatesCollection.push(coordinate));
      } else if (type === 'Polygon') {
        coordinates.forEach(function (polygonCoordinates) {
          polygonCoordinates.forEach(function (coordinate) {
            coordinatesCollection.push(coordinate);
          });
        });
      } else if (type === 'MultiLineString') {
        coordinates.forEach(function (featureCoordinates) {
          featureCoordinates.forEach(function (polygonCoordinates) {
            polygonCoordinates.forEach(function (coordinate) {
              coordinatesCollection.push(coordinate);
            });
          });
        });
      } else if (type === 'MultiPolygon') {
        coordinates.forEach(function (featureCoordinates) {
          featureCoordinates.forEach(function (polygonCoordinates) {
            polygonCoordinates.forEach(function (coordinate) {
              coordinatesCollection.push(coordinate);
            });
          });
        });
      } else {
        throw new Error('The geoJSON is not valid.');
      }
    });

    return coordinatesCollection;
  }
}

/**
 *
 * @param datasets
 * @param dateAccess
 * @returns {{date: *}[]}
 */
function dateToItemsRelation(datasets, dateAccess) {

  let flatData = flatDatasets(datasets);
  flatData = combineByDate(flatData);

  let listOfDates = extractDatesFromDatasets(datasets);
  // verbose_log('listOfDates', listOfDates);
  listOfDates = listOfDates.reverse();
  // verbose_log('listOfDates', listOfDates);
  // listOfDates = listOfDates.sort(function (left, right) {
  //   return dateAccess(left) - dateAccess(right);
  // });

  let listOfLabels = extractLabelsFromDatasets(datasets);

  return listOfDates.map(function (date) {
    let datasetDate = {date: date};
    flatData
      .filter(item => item.date === date)
      .forEach(function (entry) {
        datasetDate[entry.dataset] = entry.value;
        datasetDate.total = entry.dateTotal;
      });

    // add zero values for empty datasets
    for (let index = 0; index < listOfLabels.length; index++) {
      let label = listOfLabels[index];
      if (!datasetDate[label]) {
        datasetDate[label] = 0;
      }
    }

    return datasetDate;
  });
}

DatasetsController.prototype.addListener = function (listener) {
  this.listeners.push(listener);
};

DatasetsController.prototype.removeListener = function (listener) {
  let index = this.listeners.indexOf(listener);
  if (index === -1) return;
  this.listeners = this.listeners.splice(index, 1);
};

DatasetsController.prototype.notifyListeners = function (reason = 'none') {
  for (let index = 0; index < this.listeners.length; index++) {
    let listener = this.listeners[index];
    if (!listener.update) continue;
    listener.update(this, reason);
  }
};

/**
 *
 * @param datasets
 * @param dateToItemsRelation
 * @returns {*[]}
 */
function createStackModel(controller, datasets, dateToItemsRelation) {
  let listOfStacks = extractStacksFromDatasets(datasets);

  return listOfStacks.map(function (stackName) {

    let stackCandidates = datasets.filter(function (dataset) {
      return dataset.stack === stackName
        || dataset.label === stackName;
    });

    let candidatesNames = stackCandidates.map(stackCandidate => stackCandidate.label);
    let candidatesColors = stackCandidates.map(stackCandidate => controller.getColorForDataset(stackCandidate.label));

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

Array.prototype.first = function () {
  return this[0];
};
Array.prototype.last = function () {
  return this[this.length - 1];
};

/**
 * Combines each `ratio` entries to one.
 * @param datasets The datasets collection.
 * @param ratio The ratio.
 */
function combineDatasetsByRatio(datasets, ratio) {
  let copied = copy(datasets);
  for (let index = 0; index < copied.length; index++) {
    let dataset = copied[index];
    let data = dataset.data;
    dataset.data = combineDataByGroupsize(data, ratio);
    copied[index] = dataset;
  }
  return copied;
}

/**
 *
 * @param data
 * @param ratio
 */
function combineDataByGroupsize(data, ratio) {
  if (!data || data.length <= ratio) return data;
  let combined = combineByDate(data);
  verbose_log('combined', combined);
  let newData = [];

  while (combined.length > 0) {
    let dateGroup = combined.splice(0, ratio);
    let firstItem = dateGroup.first();
    let lastItem = dateGroup.last();
    let item = {};
    item.dataset = firstItem.dataset;
    item.stack = firstItem.stack;
    item.date = firstItem.date;
    item.date = firstItem.date;
    item.from = firstItem.date;
    item.till = lastItem.date;
    item.value = sumOfValues(dateGroup);
    newData.push(item);
  }

  return newData;
}

/**
 * Returns a new generated DateDataview for the current enabled data of dataset of this controller.
 */
DatasetsController.prototype.getDateDataview = function () {
  this.dateAccess;
  let workingDatasets = copy(this.workingDatasets);
  let enabledDatasets = copy(this.enabledDatasets || workingDatasets);
  let dateGroupRatio = 2;
  let dataview = {};

  dataview.dateGroupRatio = dateGroupRatio;
  dataview.datasets = combineDatasetsByRatio(workingDatasets, dateGroupRatio);
  dataview.dateToItemsRelation = dateToItemsRelation(workingDatasets);
  dataview.dateToItemsRelationPresented = dateToItemsRelation(enabledDatasets);
  dataview.datasetStacks = createStackModel(this, workingDatasets, dataview.dateToItemsRelation);
  dataview.datasetStacksPresented = createStackModel(this, enabledDatasets, dataview.dateToItemsRelationPresented);
  dataview.max = d3.max(dataview.datasetStacksPresented, function (stack) {
    return d3.max(stack, function (series) {
      return d3.max(series.map(item => item['1']));
    });
  });
  return dataview;
};

/**
 *
 * @param datasets
 */
function renderCsv(datasets) {
  let flatData = flatDatasets(datasets);
  let csvContent = 'label,value,date,location\n';
  for (let index = 0; index < flatData.length; index++) {
    let data = flatData[index];
    csvContent += `${data.dataset || 'Unknown'},${data.value || '0'},`;
    csvContent += `${data.date || ''},${data.location || ''}\n`;
  }
  return csvContent;
}

/**
 * Returns the last path component of the given url.
 * @param url The url with components.
 * @returns {string} The last path component.
 */
function getFilename(url) {
  return url.substring(url.lastIndexOf('/') + 1);
}

/**
 * Returns a new version of the given string by trimming the given char from the beginning and the end of the string.
 * @param string The string to be trimmed.
 * @param character The character to trim.
 * @returns {string} The trimmed version of the string.
 */
function trimByChar(string, character) {
  const saveString = String(string);
  const first = [...saveString].findIndex(char => char !== character);
  const last = [...saveString].reverse().findIndex(char => char !== character);
  return saveString.substring(first, string.length - last);
}

/**
 *
 * @param url
 * @param extractItemBlock
 * @returns {Promise<[]>}
 */
function parseCsv(
  url,
  extractItemBlock = function (components) {
    return {date: components[0], value: components[1]};
  }) {

  getFilename(url);
  let datasets = [];

  return fetch(url)
    .then(function (response) {
      return response.text();
    })
    .then(function (text) {
      datasets.csv = text;
      let lines = text.split('\n');
      let headline = lines.shift();
      let headlines = headline.split(',');
      headlines.shift(); // drop first column

      for (let index = 0; index < headlines.length; index++) {
        datasets.push({
          label: trimByChar(headlines[index], "\""),
          stack: trimByChar(headlines[index], "\""),
          data: []
        });
      }

      for (let index = 0; index < lines.length; index++) {
        let line = String(lines[index]);
        let components = line.split(',');
        if (components.length < 2) continue;
        let date = components.shift();

        for (let componentIndex = 0; componentIndex < components.length; componentIndex++) {
          let dataset = datasets[componentIndex];
          let data = dataset.data;
          data.push({
            date: trimByChar(date, "\""),
            value: Number(trimByChar(components[componentIndex], "\""))
          });
          dataset.data = data;
          datasets[componentIndex] = dataset;
        }
      }

      return datasets;
    });
}

/**
 *
 * @class ModalPopup
 * @extends Popup
 */
class ModalPopup extends Popup {

  /**
   *
   * @param parent
   */
  constructor(parent) {
    super(parent);
    this.modalBackground
      .classed('popup-underground', false)
      .classed('modal-underground', true);
  }

  /**
   *
   */
  render() {
    super.render();
    this.renderRow();
  }

  /**
   *
   */
  renderRow() {
    this.row = this.card.body
      .append('div')
      .classed('row', true);
    this.content = this.row
      .append('div')
      .classed('col-12 info-box-margin', true);
  }

  /**
   *
   */
  loadContent(url) {
    if (!url) return;
    let content = this.content;

    d3.text(url)
      .then(function (text) {
        console.log(text);
        content.html(text);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  /**
   * Returns the preferred size. The default is 800, 600.
   * @returns {{width: number, height: number}} The preferred size.
   */
  preferredSize() {
    return {
      width: 800,
      height: 600
    };
  }
}

// components
exports.Component = Component;
exports.Card = Card;
exports.ChartCard = ChartCard;
exports.Checkbox = Checkbox;
exports.Dropdown = Dropdown;
exports.ModalPopup = ModalPopup;
exports.Popup = Popup;
exports.RadioGroup = RadioGroup;
exports.Option = Option;

// date
exports.TimeChart = DateChart;
exports.TimeChartCard = DateChartCard;

// map
exports.MapChart = MapChart;
exports.MapChartCard = MapChartCard;

// plot
exports.PlotChart = PlotChart;
exports.PlotChartCard = PlotChartCard;

// datasets
exports.DatasetController = DatasetsController;
exports.FilterableDatasetController = DatasetsControllerFilter;


// url parameters
exports.URLParameters = UrlParameters;

// geo json
exports.GeoJson = GeoJson;
exports.Feature = Feature;
exports.joinFeatures = joinFeatures;

exports.renderCSV = renderCsv;
exports.parseCSV = parseCsv;

exports.createGeoJSON = createGeoJSON;

// data juggling
exports.flatDataset = flatDataset;
exports.flatDatasets = flatDatasets;
exports.combine = combine;
exports.combineByStacks = combineByStacks;
exports.combineByDate = combineByDate;
exports.combineByLocation = combineByLocation;

exports.combineDataByGroupsize = combineDataByGroupsize;
exports.combineDatasetsByRatio = combineDatasetsByRatio;

exports.extractLabelsFromDatasets = extractLabelsFromDatasets;
exports.extractLabelsFromFlatData = extractLabelsFromFlatData;
exports.extractStacksFromDatasets = extractStacksFromDatasets;
exports.extractStacksFromFlatData = extractStacksFromFlatData;
exports.extractDatesFromDatasets = extractDatesFromDatasets;
exports.extractDatesFromFlatData = extractDatesFromFlatData;
exports.extractLocationsFromDatasets = extractLocationsFromDatasets;
exports.extractLocationsFromFlatData = extractLocationsFromFlatData;
exports.extractEarliestDate = extractEarliestDate;
exports.extractEarliestDateWithValue = extractEarliestDateWithValue;
exports.extractLatestDate = extractLatestDate;
exports.extractLatestDateWithValue = extractLatestDateWithValue;
exports.sumOfDataset = sumOfDataset;
exports.sumOfStack = sumOfStack;
exports.dateToItemsRelations = dateToItemsRelation;

// constants
exports.Constants = Constants;

var exports$1 = exports;

exports.default = exports$1;

})));
//# sourceMappingURL=lotivis.js.map
