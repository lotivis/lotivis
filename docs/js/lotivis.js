/*!
 * lotivis.js v1.0.48
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
 * Color defined by r,g,b.
 * @class Color
 */
class Color {

  /**
   * Creates a new instance of Color.
   * @param r The red value.
   * @param g The green value.
   * @param b The blue value.
   */
  constructor(r, g, b) {
    if ((r || r === 0) && (g || g === 0) && (b || b === 0)) {
      this.initialize(r, g, b);
    } else if (typeof r === `object`) {
      this.initialize(r.r, r.g, r.b);
    } else if (r) ; else if (r) {
      this.initialize(r, r, r);
    } else {
      throw new Error(`Invalid argument: ${r}`);
    }
  }

  initialize(r, g, b) {
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

Color.colorGenerator = function (till) {
  return d3
    .scaleLinear()
    .domain([0, 1 / 3 * till, 2 / 3 * till, till])
    .range(['yellow', 'orange', 'red', 'purple']);
};

/**
 *
 * @param till
 * @returns {*}
 */
Color.plotColor = function (till) {
  return d3
    .scaleLinear()
    .domain([0, 1 / 2 * till, till])
    .range(['lightgreen', 'steelblue', 'purple']);
};

/**
 * Returns a randomly generated color.
 * @returns {string}
 */
Color.randomColor = function () {
  return "rgb(" +
    (Math.random() * 255) + ", " +
    (Math.random() * 255) + "," +
    (Math.random() * 255) + ")";
};

var d3LibraryAccess;
try {
  d3LibraryAccess = require('d3');
} catch (e) {
  d3LibraryAccess = d3;
}

/**
 * Returns a randomly generated color.
 * @returns {[]}
 */
Color.colorsForStack = function (stackNumber, amount = 1) {
  let colorCouple = Color.stackColors[stackNumber % Color.stackColors.length];
  let colorGenerator = d3LibraryAccess
    .scaleLinear()
    .domain([0, amount])
    .range([colorCouple[0], colorCouple[1]]);

  let colors = [];
  for (let i = 0; i < amount; i++) {
    let color = colorGenerator(i);
    colors.push(new Color(color));
  }

  return colors;
};

/**
 * Returns the hash of the given string.
 * @param aString The string to create the hash of.
 * @returns {number} The hash of the given string.
 */
function hashCode(aString) {
  let hash = 0, i, chr;
  for (i = 0; i < aString.length; i++) {
    chr = aString.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

/**
 * Creates and returns a unique ID.
 */
var createID;
(function () {
  let uniquePrevious = 0;
  createID = function () {
    return 'lotivis-id-' + uniquePrevious++;
  };
}());

/**
 * Returns a 'save-to-use' id for a HTML element by replacing whitespace with dashes.
 * @param theID The id for a HTML element.
 * @returns {string} The save version of the given id.
 */
function toSaveID(theID) {
  return theID.replaceAll(' ', '-');
}

/**
 * Creates and returns a unique (save to use for elements) id.  The id is created by calculating the hash of the
 * dataset's label.
 * @param dataset The dataset.
 * @returns {number} The created id.
 */
function createIDFromDataset(dataset) {
  if (!dataset || !dataset.label) return 0;
  return hashCode(dataset.label);
}

class LotivisError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class ElementNotFoundError extends LotivisError {
  constructor(selector) {
    super(`Can't find an element with ID '${selector}'.`);
  }
}

class DataValidateError extends LotivisError {
  // constructor(message) {
  //   super(message);
  // }
}

class MissingPropertyError extends DataValidateError {
  // constructor(message, propertyName) {
  //   super(message);
  //   this.propertyName = propertyName;
  // }
}

class InvalidFormatError extends DataValidateError {
  // constructor(message) {
  //   super(message);
  // }
}

class GeoJSONValidateError extends LotivisError {
  // constructor(message) {
  //   super(message);
  // }
}

exports.LotivisError = LotivisError;
exports.DataValidateError = DataValidateError;
exports.MissingPropertyError = MissingPropertyError;
exports.InvalidFormatError = InvalidFormatError;
exports.GeoJSONValidateError = GeoJSONValidateError;

/**
 *
 * @class Component
 */
class Component {

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
    if (this.parent.empty()) {
      throw new ElementNotFoundError(selector);
    }
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

/**
 * @class DateAxisRenderer
 */
class DateAxisRenderer {

  /**
   * Creates a new instance of DateAxisRenderer.
   *
   * @param dateChart The parental date chart.
   */
  constructor(dateChart) {

    /**
     * Appends the `left` and `bottom` axis to the date chart.
     */
    this.renderAxis = function () {
      let height = dateChart.config.height;
      let margin = dateChart.config.margin;

      // left
      dateChart.svg
        .append("g")
        .call(d3.axisLeft(dateChart.yChart))
        .attr("transform", () => `translate(${margin.left},0)`);

      // bottom
      dateChart.svg
        .append("g")
        .call(d3.axisBottom(dateChart.xChart))
        .attr("transform", () => `translate(0,${height - margin.bottom})`);

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
 * Returns the sum of samples values for the given dataset.
 *
 * @param flatData The flat samples array.
 * @param dataset The dataset name.
 * @returns {*} The sum.
 */
function sumOfDataset(flatData, dataset) {
  return sumOfValues(flatData.filter(item => item.dataset === dataset));
}

/**
 * Returns the sum of samples values for the given label.
 *
 * @param flatData The flat samples array.
 * @param label The label.
 * @returns {*} The sum.
 */
function sumOfLabel(flatData, label) {
  return sumOfValues(flatData.filter(item => item.label === label));
}

/**
 * Returns the sum of samples values for the given stack.
 *
 * @param flatData The flat samples array.
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

  constructor(dateChart) {

    this.renderNormalLegend = function () {
      let config = dateChart.config;
      let controller = dateChart.datasetController;
      let datasets = controller.workingDatasets;
      let datasetNames = controller.labels;
      let circleRadius = 6;
      let labelMargin = 50;

      let xLegend = d3.scaleBand()
        .domain(datasetNames)
        .rangeRound([config.margin.left, config.width - config.margin.right]);

      let legends = dateChart.graph
        .selectAll('.legend')
        .data(datasets)
        .enter();

      legends
        .append('text')
        .attr('class', 'lotivis-date-chart-legend-label')
        .attr("font-size", 13)
        .attr("x", (item) => xLegend(item.label) - 30)
        .attr("y", dateChart.graphHeight + labelMargin)
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
          dateChart.toggleDataset(label);
        }.bind(this));

      legends
        .append("circle")
        .attr('class', 'lotivis-date-chart-legend-circle')
        .attr("r", circleRadius)
        .attr("cx", (item) => xLegend(item.label) - (circleRadius * 2) - 30)
        .attr("cy", dateChart.graphHeight + labelMargin - circleRadius + 2)
        .style("stroke", (item) => controller.getColorForDataset(item.label))
        .style("fill", function (item) {
          return item.isEnabled ? controller.getColorForDataset(item.label) : 'white';
        }.bind(this));
    };

    this.renderCombinedStacksLegend = function () {
      let stackNames = dateChart.datasetController.stacks;
      let circleRadius = 6;
      let labelMargin = 50;

      let xLegend = d3
        .scaleBand()
        .domain(stackNames)
        .rangeRound([dateChart.config.margin.left, dateChart.config.width - dateChart.config.margin.right]);

      let legends = dateChart
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
          return dateChart.graphHeight + labelMargin;
        }.bind(this))
        .style('cursor', 'pointer')
        .style("fill", function (item, index) {
          return Color.colorsForStack(index)[0].rgbString();
        }.bind(this))
        .text(function (item) {
          return `${item} (${sumOfStack(dateChart.datasetController.flatData, item)})`;
        }.bind(this));

      legends
        .append("circle")
        .attr("r", circleRadius)
        .attr("cx", item => xLegend(item) - (circleRadius * 2) - 30)
        .attr("cy", dateChart.graphHeight + labelMargin - circleRadius + 2)
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

const GlobalConfig = {
  // The default margin to use for charts.
  defaultMargin: 60,
  // The default offset for the space between an object an the toolbar.
  tooltipOffset: 7,
  // The default radius to use for bars drawn on a chart.
  barRadius: 5,
  // A Boolean value indicating whether the debug logging is enabled.
  debugLog: false,
  // A Boolean value indicating whether the debug logging is enabled.
  debug: true,
  // A string which is used as prefix for download.
  downloadFilePrefix: 'lotivis',
  // A string which is used as separator between components when creating a file name.
  filenameSeparator: '_'
};

let alreadyLogged = [];

function LogOnlyOnce(id, message) {
  if (alreadyLogged.includes(id)) return;
  alreadyLogged.push(id);
  lotivis_log(`[lotivis]  Warning only once! ${message}`);
}

function clearAlreadyLogged() {
  alreadyLogged = [];
}

// export const debug_log = function (message) {
//   if (!GlobalConfig.debugLog) return;
//   console.log(prefix + message);
// };

var lotivis_log = () => null;

/**
 * Sets whether lotivis prints debug log messages to the console.
 * @param enabled A Boolean value indicating whether to enable debug logging.
 */
function debug(enabled) {
  GlobalConfig.debugLog = enabled;
  GlobalConfig.debug = enabled;
  lotivis_log = enabled ? console.log : () => null;
  lotivis_log(`[lotivis]  debug ${enabled ? 'en' : 'dis'}abled`);
}

class DateBarsRenderer {

  /**
   *
   * @param timeChart
   */
  constructor(timeChart) {

    /**
     *
     * @param stack
     * @param stackIndex
     */
    this.renderBars = function (stack, stackIndex) {
      let isCombineStacks = timeChart.config.combineStacks;
      let colors = timeChart.datasetController.getColorsForStack(stack.stack);
      timeChart
        .svg
        .append("g")
        .selectAll("g")
        .data(stack)
        .enter()
        .append("g")
        .attr("fill", function (stackData, index) {
          if (isCombineStacks) {
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
        .attr("rx", isCombineStacks ? 0 : GlobalConfig.barRadius)
        .attr("ry", isCombineStacks ? 0 : GlobalConfig.barRadius)
        .attr("x", (d) => timeChart.xChart(d.data.date) + timeChart.xStack(stack.label))
        .attr("y", (d) => timeChart.yChart(d[1]))
        .attr("width", timeChart.xStack.bandwidth())
        .attr("height", (d) => timeChart.yChart(d[0]) - timeChart.yChart(d[1]));
    };
  }
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

      if (dateChart.config.sendsNotifications) {
        dateChart.updateSensible = false;
        controller.setDatesFilter([date]);
        dateChart.updateSensible = true;
      }

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

      if (dateChart.config.sendsNotifications) {
        dateChart.datasetController.resetFilters();
      }
    }

    this.renderGhostBars = function () {
      let margin = dateChart.config.margin;
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
        .attr("rx", GlobalConfig.barRadius)
        .attr("ry", GlobalConfig.barRadius)
        .attr("x", (date) => dateChart.xChart(date))
        .attr("y", margin.top)
        .attr("width", dateChart.xChart.bandwidth())
        .attr("height", dateChart.config.height - margin.bottom - margin.top)
        .on('mouseenter', onMouseEnter.bind(this))
        .on('mouseout', onMouserOut.bind(this));

    };
  }
}

/**
 * Returns a copy of the passed object.  The copy is created by using the
 * JSON's `parse` and `stringify` functions.
 * @param object The java script object to copy.
 * @returns {any} The copy of the object.
 */
function copy(object) {
  return JSON.parse(JSON.stringify(object));
}

function containsValue(value) {
  return value || value === 0;
}

/**
 *
 * @param flattenList
 * @returns {[]}
 */
function combine(flattenList) {
  let combined = [];
  let copiedList = copy(flattenList);
  for (let index = 0; index < copiedList.length; index++) {
    let listItem = copiedList[index];
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
      if (containsValue(listItem.label)) entry.label = listItem.label;
      if (containsValue(listItem.dataset)) entry.dataset = listItem.dataset;
      if (containsValue(listItem.stack)) entry.stack = listItem.stack;
      if (containsValue(listItem.location)) entry.location = listItem.location;
      if (containsValue(listItem.locationTotal)) entry.locationTotal = listItem.locationTotal;
      if (containsValue(listItem.date)) entry.date = listItem.date;
      if (containsValue(listItem.dateTotal)) entry.dateTotal = listItem.dateTotal;
      if (containsValue(listItem.locationName)) entry.locationName = listItem.locationName;
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
      if (containsValue(listItem.label)) entry.label = listItem.label;
      if (containsValue(listItem.dataset)) entry.dataset = listItem.dataset;
      if (containsValue(listItem.stack)) entry.stack = listItem.stack;
      if (containsValue(listItem.location)) entry.location = listItem.location;
      if (containsValue(listItem.locationTotal)) entry.locationTotal = listItem.locationTotal;
      if (containsValue(listItem.date)) entry.date = listItem.date;
      if (containsValue(listItem.dateTotal)) entry.dateTotal = listItem.dateTotal;
      if (containsValue(listItem.locationName)) entry.locationName = listItem.locationName;
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
      return entryItem.dataset === listItem.dataset
        && entryItem.stack === listItem.stack
        && entryItem.label === listItem.label
        && entryItem.date === listItem.date;
    });
    if (entry) {
      entry.value += (listItem.value + 0);
    } else {
      let entry = {};
      if (containsValue(listItem.label)) entry.label = listItem.label;
      if (containsValue(listItem.dataset)) entry.dataset = listItem.dataset;
      if (containsValue(listItem.stack)) entry.stack = listItem.stack;
      if (containsValue(listItem.date)) entry.date = listItem.date;
      if (containsValue(listItem.dateTotal)) entry.dateTotal = listItem.dateTotal;
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
      return entryItem.dataset === listItem.dataset
        && entryItem.stack === listItem.stack
        && entryItem.label === listItem.label
        && entryItem.location === listItem.location;
    });
    if (entry) {
      entry.value += listItem.value;
    } else {
      let entry = {};
      if (containsValue(listItem.label)) entry.label = listItem.label;
      if (containsValue(listItem.dataset)) entry.dataset = listItem.dataset;
      if (containsValue(listItem.stack)) entry.stack = listItem.stack;
      if (containsValue(listItem.location)) entry.location = listItem.location;
      if (containsValue(listItem.locationTotal)) entry.locationTotal = listItem.locationTotal;
      if (containsValue(listItem.locationName)) entry.locationName = listItem.locationName;
      entry.value = listItem.value;
      combined.push(entry);
    }
  }
  return combined;
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
      let top = dateChart.config.margin.top * factor;
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
      return x + offset[0] - tooltipSize[0] - 22 - GlobalConfig.tooltipOffset;
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
      x += offset[0] + GlobalConfig.tooltipOffset;
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
        .enabledFlatData()
        .filter(item => item.date === date);

      let first = flatData.first();
      let title;
      if (first && first.from && first.till) {
        title = `${first.from} - ${first.till}`;
      } else {
        title = `${date}`;
      }

      let dataHTML = combineByDate(flatData)
        .filter(item => item.value > 0)
        .map(function (item) {
          let color = dateChart.datasetController.getColorForDataset(item.dataset);
          let divHTML = `<div style="background: ${color};color: ${color}; display: inline;">__</div>`;
          return `${divHTML} ${item.dataset}: <b>${item.value}</b>`;
        })
        .join('<br>');

      return `<b>${title}</b><br>${dataHTML}`;
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
      let factor = dateChart.getElementEffectiveSize()[0] / dateChart.config.width;
      let offset = dateChart.getElementPosition();
      let top = getTop(factor, offset, tooltipSize);
      let left = dateChart.xChart(date);

      // differ tooltip position on bar position
      if (left > (dateChart.config.width / 2)) {
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
   * @param config The configuration of the chart.
   */
  constructor(parent, config) {
    super(parent);

    if (Object.getPrototypeOf(parent) === String.prototype) {
      this.selector = parent;
      this.element = d3.select('#' + parent);
      if (this.element.empty()) {
        throw new Error(`ID not found: ${parent}`);
      }
    } else {
      this.element = parent;
      this.element.attr('id', this.selector);
    }

    this.config = config || {};
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

/**
 * @class DateGridRenderer
 */
class DateGridRenderer {

  /**
   * Creates a new instance of DateGridRenderer.
   *
   * @param dateChart
   */
  constructor(dateChart) {

    /**
     *
     */
    this.createAxis = function () {

      this.xAxisGrid = d3
        .axisBottom(dateChart.xChart)
        .tickSize(-dateChart.graphHeight)
        .tickFormat('');

      this.yAxisGrid = d3
        .axisLeft(dateChart.yChart)
        .tickSize(-dateChart.graphWidth)
        .tickFormat('')
        .ticks(20);

    };

    /**
     *
     */
    this.renderGrid = function () {
      let config = dateChart.config;
      let color = 'lightgray';
      let width = '0.5';
      let opacity = 0.3;

      dateChart.svg
        .append('g')
        .attr('class', 'x axis-grid')
        .attr('transform', 'translate(0,' + (config.height - config.margin.bottom) + ')')
        .attr('stroke', color)
        .attr('stroke-width', width)
        .attr("opacity", opacity)
        .call(this.xAxisGrid);

      dateChart.svg
        .append('g')
        .attr('class', 'y axis-grid')
        .attr('transform', `translate(${config.margin.left},0)`)
        .attr('stroke', color)
        .attr('stroke-width', width)
        .attr("opacity", opacity)
        .call(this.yAxisGrid);

    };
  }
}

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

    this.config;
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

    if (this.config.combineStacks) {
      this.dataview = this.datasetController.getDateDataviewCombinedStacks(groupSize);
    } else {
      this.dataview = this.datasetController.getDateDataview(groupSize);
    }
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

/**
 * A lotivis card.
 *
 * @class Card
 * @extends Component
 */
class Card extends Component {

  /**
   * Creates a new instance of Card.
   * @param parent The parental component.
   */
  constructor(parent) {
    super(parent);
    this.injectCard();
    this.injectHeader();
    this.injectBody();
    this.injectFooter();
  }

  injectCard() {
    this.element = this.parent
      .append('div')
      .classed('lotivis-card', true);
  }

  injectHeader() {
    this.header = this.element
      .append('div')
      .attr('class', 'lotivis-card-header');
    this.headerRow = this.header
      .append('div')
      .attr('class', 'lotivis-row');
    this.headerLeftComponent = this.headerRow
      .append('div')
      .attr('class', 'lotivis-col-3 lotivis-card-header-left');
    this.headerCenterComponent = this.headerRow
      .append('div')
      .attr('class', 'lotivis-col-6 lotivis-card-header-center');
    this.headerRightComponent = this.headerRow
      .append('div')
      .attr('class', 'lotivis-col-3 lotivis-card-header-right lotivis-button-group');
    this.titleLabel = this.headerLeftComponent
      .append('div')
      .attr('class', 'lotivis-title-label');
  }

  injectBody() {
    this.body = this.element
      .append('div')
      .attr('class', 'lotivis-card-body');
    this.content = this.body
      .append('div')
      .attr('class', 'lotivis-card-body-content');
  }

  injectFooter() {
    this.footer = this.element
      .append('div')
      .attr('class', 'lotivis-card-footer');
    this.footerRow = this.footer
      .append('div')
      .attr('class', 'lotivis-row');
    this.footerLeftComponent = this.footerRow
      .append('div')
      .attr('class', 'lotivis-col-6');
    this.footerRightComponent = this.footerRow
      .append('div')
      .attr('class', 'lotivis-col-6');
    this.footer.style('display', 'none');
  }

  /**
   * @param newTitle The text of the title label.
   */
  setCardTitle(newTitle) {
    this.titleLabel.text(newTitle);
  }

  /**
   * Shows the footer by resetting its style display value.
   */
  showFooter() {
    this.footer.style('display', '');
  }

  /**
   * Hides the footer by setting its style display value to `none`.
   */
  hideFooter() {
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
   * @param style The style of the button.  One of default|back|forward
   */
  constructor(parent, style = 'default') {
    super(parent);

    this.element = parent
      .append('button')
      .attr('id', this.selector)
      .attr('class', 'lotivis-button')
      .on('click', function (event) {
        if (!this.onClick) return;
        this.onClick(event);
      }.bind(this));

    switch (style) {
      case 'round':
        this.element.classed('lotivis-button-round', true);
        break;
    }
  }

  /**
   * Sets the text of the button.
   * @param text The text of the button.
   */
  setText(text) {
    this.element.text(text);
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
    this.injectUnderground(parent);
    this.injectContainer();
    this.injectCard();
    this.inject();
    this.injectCloseButton();
    this.addCloseActionListeners();
  }

  // MARK: - Render

  /**
   * Appends components to this popup.
   *
   * Should be overridden by subclasses.
   */
  inject() {
    // empty
  }

  /**
   * Appends the 'dim' background to the given parent.
   *
   * @param parent The parental element.
   */
  injectUnderground(parent) {
    this.modalBackgroundId = createID();
    this.modalBackground = parent
      .append('div')
      .classed('lotivis-popup-underground lotivis-fade-in', true)
      .attr('id', this.modalBackgroundId);
  }

  /**
   *
   */
  injectContainer() {
    this.elementId = createID();
    this.element = this.modalBackground
      .append('div')
      .classed('lotivis-popup', true)
      .attr('id', this.elementId);
  }

  /**
   *
   */
  injectCard() {
    this.card = new Card(this.element);
    this.card.element.classed('lotivis-popup lotivis-arrow lotivis-arrow-right', true);
  }

  /**
   * Appends a close button to the right header component.
   */
  injectCloseButton() {
    this.closeButton = new Button(this.card.headerRightComponent);
    this.closeButton.element.classed('lotivis-button-small', true);
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

UrlParameters.showTestData = 'show-samples';

/**
 * Represents an option of a dropdown or radio group.
 * @class Option
 */
class Option {

  /**
   * Creates a new instance of Option.
   * @param title The title of the option.
   */
  constructor(title) {
    this.title = title;
    this.id = toSaveID(title);
  }
}

/**
 *
 * @class DateChartSettingsPopup
 * @extends Popup
 */
class DateChartSettingsPopup extends Popup {

  inject() {
    this.card.setCardTitle('Settings');
    this.card.content.classed('lotivis-card-body-settings', true);
    this.row = this.card.content
      .append('div')
      .classed('row', true);

    this.injectShowLabelsCheckbox();
    this.injectCombineStacksCheckbox();
    this.injectRadios();
  }

  injectShowLabelsCheckbox() {
    let container = this.row.append('div').classed('col-12', true);
    this.showLabelsCheckbox = new Checkbox(container);
    this.showLabelsCheckbox.setText('Labels');
    this.showLabelsCheckbox.onClick = function (checked) {
      this.diachronicChart.config.showLabels = checked;
      this.diachronicChart.update();
      UrlParameters.getInstance().set(UrlParameters.chartShowLabels + this.selector, checked);
    }.bind(this);
  }

  injectCombineStacksCheckbox() {
    let container = this.row.append('div').classed('col-12', true);
    this.combineStacksCheckbox = new Checkbox(container);
    this.combineStacksCheckbox.setText('Combine Stacks');
    this.combineStacksCheckbox.onClick = function (checked) {
      this.diachronicChart.config.combineStacks = checked;
      this.diachronicChart.update();
      UrlParameters.getInstance().set(UrlParameters.chartCombineStacks + this.selector, checked);
    }.bind(this);
  }

  injectRadios() {
    let container = this.row.append('div').classed('col-12', true);
    this.typeRadioGroup = new RadioGroup(container);
    this.typeRadioGroup.setOptions([
      new Option('bar', 'Bar'),
      new Option('line', 'Line')
    ]);

    this.typeRadioGroup.onChange = function (value) {
      this.diachronicChart.type = value;
      this.diachronicChart.update();
      UrlParameters.getInstance().set(UrlParameters.chartType + this.selector, value);
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
    // console.log('this.diachronicChart.showLabels: ' + this.diachronicChart.isShowLabels);
    this.combineStacksCheckbox.setChecked(this.diachronicChart.isCombineStacks);
    // console.log('this.diachronicChart.combineGroups: ' + this.diachronicChart.isCombineStacks);
    this.typeRadioGroup.setSelectedOption(this.diachronicChart.type);
  }
}

/**
 *
 * @class ChartCard
 * @extends Card
 */
class ChartCard extends Card {

  /**
   * Creates a new instance of ChartCard.
   *
   * @param parent The parental component.
   */
  constructor(parent, config) {
    super(parent);
    this.config = config;
    this.injectButtons();
    this.injectRadioGroup();
    this.injectChart();
  }

  /**
   * Creates and injects the chart.
   * Should be overridden by subclasses.
   */
  injectChart() {
    // empty
  }

  /**
   * Creates and injects a screenshot button and a more button.
   */
  injectButtons() {
    this.screenshotButton = new Button(this.headerRightComponent);
    this.screenshotButton.setText('Screenshot');
    this.screenshotButton.element.classed('simple-button', true);
    this.screenshotButton.onClick = function (event) {
      this.screenshotButtonAction(event);
    }.bind(this);

    this.moreButton = new Button(this.headerRightComponent);
    this.moreButton.setText('More');
    this.moreButton.element.classed('simple-button', true);
    this.moreButton.onClick = function (event) {
      this.presentSettingsPopupAction(event);
    }.bind(this);
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
 * Appends the given string in extension to the given string filename if filename not already ends with this extension.
 * @param filename A string with or without an extension.
 * @param extension The extension the filename will end with.
 * @returns {*|string} The filename with the given extension.
 */
function appendExtensionIfNeeded(filename, extension) {
  if (extension === '' || extension === '.') return filename;
  extension = extension.startsWith(".") ? extension : `.${extension}`;
  return filename.endsWith(extension) ? filename : `${filename}${extension}`;
}

function createDownloadFilename() {
  let components = [GlobalConfig.downloadFilePrefix];
  let separator = GlobalConfig.filenameSeparator;
  for (let i = 0; i < arguments.length; i++) {
    components.push(String(arguments[i]));
  }
  return components.join(separator);
}

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

  // Convert SVG string to samples URL
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
 * Creates and appends an anchor linked to the given samples which is then immediately clicked.
 *
 * @param blob The samples to be downloaded.
 * @param filename The name of the file.
 */
function downloadBlob(blob, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    let anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
}

/**
 * Initiates a download of a JSON file with the given content and the given filename.
 * @param jsonString The JSON content.
 * @param filename The filename of the file to be downloaded. Will append '.json' extension
 * if needed.
 */
function downloadJSON(jsonString, filename) {
  let blob = new Blob([jsonString], {type: 'text/json'});
  let saveFilename = appendExtensionIfNeeded(filename, 'json');
  downloadBlob(blob, saveFilename);
}

function downloadCSV(jsonString, filename) {
  let blob = new Blob([jsonString], {type: 'text/csv'});
  let saveFilename = appendExtensionIfNeeded(filename, 'csv');
  downloadBlob(blob, saveFilename);
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
        let saveFilename = appendExtensionIfNeeded(filename, 'png');
        downloadBlob(dataBlob, saveFilename);
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
   * @param config
   */
  constructor(selector, config) {
    let theSelector = selector || 'date-chart-card';
    super(theSelector, config);
    this.selector = theSelector;
    this.name = theSelector;
    this.datasets = [];
    this.renderChart();
    this.renderRadioGroup();
    this.setCardTitle((config && config.name) ? config.name : 'Date');
    this.applyURLParameters();
  }

  /**
   *
   */
  renderChart() {
    this.chart = new DateChart(this.body, this.config || {});
    this.chartID = this.chart.selector;
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
      .getString(UrlParameters.chartType + this.chartID, 'bar');
    this.chart.config.showLabels = UrlParameters.getInstance()
      .getBoolean(UrlParameters.chartShowLabels + this.chartID, this.chart.config.showLabels);
    this.chart.config.combineStacks = UrlParameters.getInstance()
      .getBoolean(UrlParameters.chartCombineStacks + this.chartID, this.chart.config.combineStacks);
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
    let filename = this.chart.datasetController.getFilename();
    let downloadFilename = createDownloadFilename(filename, `date-chart`);
    downloadImage(this.chart.svgSelector, downloadFilename);
  }
}

/**
 *
 * @param geoJSON
 * @param removeCandidates
 * @returns {*}
 */
function removeFeatures(geoJSON, removeCandidates) {
  if (!Array.isArray(removeCandidates)) return geoJSON;
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
 * @returns {boolean} `True` if the string versions are equal, `false` if not.
 */
function equals(value1, value2) {
  return String(value1) === String(value2);
}

/**
 * Returns a Boolean value indicating whether the JSON string version of the given two objects are equal.
 * @param object1 The first object to compare.
 * @param object2 The second object to compare.
 * @returns {boolean} `True` if the JSON strings of the given objects are equal,`false` if not.
 */
function objectsEqual(object1, object2) {
  if (object1 === object2) return true;
  let string1 = JSON.stringify(object1);
  let string2 = JSON.stringify(object2);
  return string1 === string2;
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
      return `lotivis-map-area-${mapChart.config.featureIDAccessor(feature)}`;
    }

    function htmlTitle(feature) {
      let featureID = mapChart.config.featureIDAccessor(feature);
      let featureName = mapChart.config.featureNameAccessor(feature);
      return `ID: ${featureID}<br>Name: ${featureName}`;
    }

    function htmlValues(feature) {
      let components = [];
      let featureID = mapChart.config.featureIDAccessor(feature);
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
      let factor = effectiveSize[0] / mapChart.config.width;
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
        top -= GlobalConfig.tooltipOffset;
        return top;
      }

      /**
       * Calculates and returns the top tooltip position when displaying under a feature.
       * @returns {*} The top position in pixels.
       */
      function getTooltipLocationUnder() {
        let top = featureLowerLeft[1] * factor;
        top += positionOffset[1];
        top += GlobalConfig.tooltipOffset;
        return top;
      }

      let top = 0;
      if (featureLowerLeft[1] > (mapChart.config.height / 2)) {
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
      if (!mapChart.geoJSON) return lotivis_log('No Geo JSON to render.');
      let combinedData = mapChart.combinedData;
      if (!mapChart.datasetController) return lotivis_log('no datasetController');

      removeLabels();
      if (!mapChart.config.isShowLabels) return;

      mapChart.svg
        .selectAll('text')
        .data(geoJSON.features)
        .enter()
        .append('text')
        .attr('class', 'lotivis-map-label')
        .text(function (feature) {
          let featureID = mapChart.config.featureIDAccessor(feature);
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
            .filter((item) => equals(mapChart.config.featureIDAccessor(item), locationID))
            .style('fill', generator(opacity));

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
     * Renders the `presentedGeoJSON` property.
     */
    this.renderGeoJson = function () {
      let geoJSON = mapChart.presentedGeoJSON;
      if (!geoJSON) return lotivis_log('No Geo JSON file to render.');
      let idAccessor = mapChart.config.featureIDAccessor;

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

    if (!self.topojson) lotivis_log('[lotivis]  Can\'t find topojson lib.  Skip rendering of exterior border.');

    /**
     * Renders the exterior border of the presented geo json.
     */
    this.render = function () {
      if (!self.topojson) return;
      let geoJSON = mapChart.presentedGeoJSON;
      let borders = joinFeatures(geoJSON);
      if (!borders) return;
      mapChart.svg
        .append('path')
        .datum(borders)
        .attr('d', mapChart.path)
        .attr('class', 'lotivis-map-exterior-borders');
    };
  }
}

/**
 * Returns a flat version of the given dataset collection.
 *
 * @param datasets The collection of datasets.
 * @returns {[]} The array containing the flat samples.
 */
function flatDatasets(datasets) {
  let flatData = [];
  let datasetsCopy = datasets;
  for (let datasetIndex = 0; datasetIndex < datasetsCopy.length; datasetIndex++) {
    let dataset = datasetsCopy[datasetIndex];
    let flatDataChunk = flatDataset(dataset);
    flatData = flatData.concat(flatDataChunk);
  }
  return flatData;
}

/**
 * Returns an array containing the flat samples of the given dataset.
 *
 * @param dataset The dataset with samples.
 * @returns {[]} The array containing the flat samples.
 */
function flatDataset(dataset) {
  let flatData = [];
  if (!dataset.data) {
    console.log('Lotivis: Flat samples for dataset without samples requested. Will return an empty array.');
    return flatData;
  }
  dataset.data.forEach(item => {
    let newItem = copy(item);
    newItem.dataset = dataset.label;
    newItem.stack = dataset.stack;
    flatData.push(newItem);
  });
  return flatData;
}

/**
 * Returns the set of dataset names from the given dataset collection.
 *
 * @param datasets The collection of datasets.
 * @returns {[]} The array containing the flat samples.
 */
function extractLabelsFromDatasets(datasets) {
  return toSet(datasets.map(dataset => dataset.label || 'unknown'));
}

/**
 * Returns the set of stacks from the given dataset collection.
 * Will fallback on dataset property if stack property isn't present.
 *
 * @param datasets The collection of datasets.
 * @returns {[]} The array containing the flat samples.
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
 * Returns the set of dates from the given dataset collection.
 *
 * @param flatData The flat samples array.
 * @returns {[]} The set containing the dates.
 */
function extractDatesFromFlatData(flatData) {
  return toSet(flatData.map(item => item.date || 'unknown'));
}

/**
 * Returns the set of locations from the given dataset collection.
 *
 * @param flatData The flat samples array.
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
 * @param flatData The flat samples array.
 * @returns {*} The earliest date.
 */
function extractEarliestDate(flatData, dateAccess = (date) => date) {
  return extractDatesFromFlatData(flatData)
    .sort((left, right) => dateAccess(left) - dateAccess(right)).shift();
}

/**
 * Returns the earliest date occurring in the flat array of items.
 *
 * @param flatData The flat samples array.
 * @param dateAccess
 * @returns {*} The earliest date.
 */
function extractEarliestDateWithValue(flatData, dateAccess = (date) => date) {
  return extractEarliestDate(filterWithValue(flatData), dateAccess);
}

/**
 * Returns the latest date occurring in the flat array of items.
 *
 * @param flatData The flat samples array.
 * @param dateAccess
 * @returns {*} The latest date.
 */
function extractLatestDate(flatData, dateAccess = (date) => date) {
  return extractDatesFromFlatData(flatData)
    .sort((left, right) => dateAccess(left) - dateAccess(right)).pop();
}

/**
 * Returns the latest date occurring in the flat array of items.
 *
 * @param flatData The flat samples array.
 * @param dateAccess
 * @returns {*} The latest date.
 */
function extractLatestDateWithValue(flatData, dateAccess = (date) => date) {
  return extractLatestDate(filterWithValue(flatData), dateAccess);
}

/**
 * Returns a filtered collection containing all items which have a valid value greater than 0.
 *
 * @param flatData The flat samples to filter.
 * @returns {*} All items with a value greater 0.
 */
function filterWithValue(flatData) {
  return flatData.filter(item => (item.value || 0) > 0);
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
 * @class MapSelectionBoundsRenderer
 */
class MapSelectionBoundsRenderer {

  /**
   * Creates a new instance of MapSelectionBoundsRenderer.
   *
   * @param mapChart The parental map chart.
   */
  constructor(mapChart) {

    let bounds;
    if (mapChart.svg) {
      bounds = mapChart.svg
        .append('rect')
        .attr('class', 'lotivis-map-selection-rect')
        .style('fill-opacity', 0);
    }

    /**
     * Tells this renderer that the mouse moved in an area.
     * @param event The mouse event.
     * @param feature The feature (area) that the mouse is now pointing on.
     */
    this.mouseEnter = function (event, feature) {
      if (!mapChart.config.drawRectangleAroundSelection) return;
      let projection = mapChart.projection;
      let featureBounds = d3.geoBounds(feature);
      let featureLowerLeft = projection(featureBounds[0]);
      let featureUpperRight = projection(featureBounds[1]);
      let featureBoundsWidth = featureUpperRight[0] - featureLowerLeft[0];
      let featureBoundsHeight = featureLowerLeft[1] - featureUpperRight[1];
      bounds
        .style('width', featureBoundsWidth + 'px')
        .style('height', featureBoundsHeight + 'px')
        .style('x', featureLowerLeft[0])
        .style('y', featureUpperRight[1])
        .style('opacity', 1);
    };

    /**
     * Tells this renderer that the mouse moved out of an area.
     */
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
 *
 * @type {{}}
 */
const defaultMapChartConfig = {
  width: 1000,
  height: 1000,
  margin: {
    top: GlobalConfig.defaultMargin,
    right: GlobalConfig.defaultMargin,
    bottom: GlobalConfig.defaultMargin,
    left: GlobalConfig.defaultMargin
  },
  isShowLabels: true,
  geoJSON: null,
  departmentsData: [],
  excludedFeatureCodes: [],
  drawRectangleAroundSelection: false,
  featureIDAccessor: function (feature) {
    if (feature.id) return feature.id;
    if (feature.properties && feature.properties.id) return feature.properties.id;
    if (feature.properties && feature.properties.code) return feature.properties.code;
    return hashCode(feature.properties);
  },
  featureNameAccessor: function (feature) {
    if (feature.name) return feature.name;
    if (feature.properties && feature.properties.name) return feature.properties.name;
    if (feature.properties && feature.properties.nom) return feature.properties.nom;
    return 'Unknown';
  }
};

/**
 *
 * @class MapBackgroundRenderer
 */
class MapBackgroundRenderer {

  /**
   * Creates a new instance of MapBackgroundRenderer.
   *
   * @param mapChart The parental map chart.
   */
  constructor(mapChart) {

    /**
     * Appends a background rectangle.
     */
    this.render = function () {
      // create a background rectangle for receiving mouse enter events
      // in order to reset the location samples filter.
      mapChart.svg
        .append('rect')
        .attr('width', mapChart.config.width)
        .attr('height', mapChart.config.height)
        .attr('fill', 'white')
        .on('mouseenter', function () {

          let controller = mapChart.datasetController;
          if (!controller) return;
          let filters = controller.locationFilters;
          if (!filters || filters.length === 0) return;
          this.updateSensible = false;
          controller.setLocationsFilter([]);
          this.updateSensible = true;

        }.bind(this));
    };
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
   * @param config The configuration of the map chart.
   */
  constructor(parent, config) {
    super(parent, config);
    this.element = parent
      .append('div')
      .attr('id', this.selector);

    this.initialize();
  }

  /**
   * Initialize with default values.
   */
  initialize() {
    let theConfig = this.config;
    let margin;
    margin = Object.assign({}, defaultMapChartConfig.margin);
    margin = Object.assign(margin, theConfig.margin || {});

    let config = Object.assign({}, defaultMapChartConfig);
    this.config = Object.assign(config, this.config);
    this.config.margin = margin;

    this.projection = d3.geoMercator();
    this.path = d3.geoPath().projection(this.projection);

    this.backgroundRenderer = new MapBackgroundRenderer(this);
    this.geoJSONRenderer = new MapGeojsonRenderer(this);
    this.datasetRenderer = new MapDatasetRenderer(this);
    this.exteriorBorderRenderer = new MapExteriorBorderRenderer(this);
    this.minimapRenderer = new MapMinimapRenderer(this);
    this.labelRenderer = new MapLabelRenderer(this);
    this.legendRenderer = new MapLegendRenderer(this);
    this.selectionBoundsRenderer = new MapSelectionBoundsRenderer(this);
    this.tooltipRenderer = new MapTooltipRenderer(this);
  }

  precalculate() {
    if (this.svg) this.svg.remove();
    this.renderSVG();
    if (!this.datasetController) return;
    if (!this.geoJSON) {
      this.geoJSON = createGeoJSON(this.datasetController.workingDatasets);
      this.geoJSONDidChange();
    }
    const combinedByStack = combineByStacks(this.datasetController.enabledFlatData());
    this.combinedData = combineByLocation(combinedByStack);
    this.dataview = this.datasetController.getMapDataview();
  }

  draw() {
    this.backgroundRenderer.render();
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
   */
  renderSVG() {
    this.svg = d3
      .select(`#${this.selector}`)
      .append('svg')
      .attr('id', this.svgSelector)
      .attr('viewBox', `0 0 ${this.config.width} ${this.config.height}`);
    this.selectionBoundsRenderer = new MapSelectionBoundsRenderer(this);
  }

  /**
   * Sets the size of the projection to fit the given geo json.
   * @param geoJSON
   */
  zoomTo(geoJSON) {
    this.projection.fitSize([this.config.width, this.config.height], geoJSON);
  }

  /**
   *
   * @param event
   * @param feature
   */
  onSelectFeature(event, feature) {
    if (!feature || !feature.properties) return;
    if (!this.datasetController) return;
    let locationID = this.config.featureIDAccessor(feature);
    this.updateSensible = false;
    this.datasetController.setLocationsFilter([locationID]);
    this.updateSensible = true;
  }

  /**
   * Sets the presented geo json.
   * @param newGeoJSON
   */
  setGeoJSON(newGeoJSON) {
    if (typeof newGeoJSON === 'object' && newGeoJSON.prototype === 'GeoJSON') {
      this.geoJSON = newGeoJSON;
    } else {
      this.geoJSON = new GeoJson(newGeoJSON);
    }

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
    this.presentedGeoJSON = removeFeatures(this.geoJSON, this.config.excludedFeatureCodes);
    this.zoomTo(this.geoJSON);
    // this.exteriorBorderRenderer.render();
    // this.geoJSONRenderer.renderGeoJson();
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
  inject() {
    this.card.setCardTitle('Settings');
    this.card.content.classed('lotivis-card-body-settings', true);
    this.row = this
      .card
      .content
      .append('div')
      .classed('lotivis-row', true);

    this.renderShowLabelsCheckbox();
  }

  /**
   * Injects a checkbox to toggle the visibility of the labels of the map chart.
   */
  renderShowLabelsCheckbox() {
    let container = this.row.append('div').classed('lotivis-col-12', true);
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
   * @param config The config of the map chart.
   */
  constructor(parent, config) {
    let theSelector = parent || 'map-chart-card';
    super(theSelector);
    this.config = config;
    this.setCardTitle('Map');
  }

  /**
   * Creates and injects the map chart.
   */
  injectChart() {
    this.chart = new MapChart(this.body, this.config);
  }

  /**
   * Creates and downloads a screenshot from the chart.
   * @override
   */
  screenshotButtonAction() {
    let filename = this.chart.datasetController.getFilename();
    let downloadFilename = createDownloadFilename(filename, `map-chart`);
    downloadImage(this.chart.svgSelector, downloadFilename);
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
      let margin = plotChart.config.margin;

      // top
      plotChart.svg
        .append("g")
        .call(d3.axisTop(plotChart.xChart))
        .attr("transform", () => `translate(0,${margin.top})`);

      // left
      plotChart.svg
        .append("g")
        .call(d3.axisLeft(plotChart.yChart))
        .attr("transform", () => `translate(${margin.left},0)`);

      // bottom
      plotChart.svg
        .append("g")
        .call(d3.axisBottom(plotChart.xChart))
        .attr("transform", () => `translate(0,${plotChart.height - margin.bottom})`);

    };
  }
}

/**
 * Calculates and creates the gradients for the bars of a plot chart.
 *
 * @class PlotGradientCreator
 */
class PlotGradientCreator {

  /**
   * Creates a new instance of PlotGradientCreator.
   *
   * @constructor
   * @param plotChart The parental plot chart.
   */
  constructor(plotChart) {
    this.plotChart = plotChart;
    this.colorGenerator = Color.plotColor(1);
  }

  /**
   * Creates the gradient for the bar representing the given dataset.
   * @param dataset The dataset to represent.
   */
  createGradient(dataset) {

    let max = this.plotChart.dataView.max;
    let gradient = this.plotChart.definitions
      .append("linearGradient")
      .attr("id", 'lotivis-plot-gradient-' + createIDFromDataset(dataset))
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");

    let data = dataset.data;
    let count = data.length;
    let latestDate = dataset.lastDate;
    let duration = dataset.duration;

    if (!data || data.length === 0) return;

    if (duration === 0) {

      let item = data[0];
      let value = item.value;
      let opacity = value / max;

      gradient
        .append("stop")
        .attr("offset", `100%`)
        .attr("stop-color", this.colorGenerator(opacity));

    } else {

      for (let index = 0; index < count; index++) {

        let item = data[index];
        let date = item.date;
        let opacity = item.value / max;

        let dateDifference = latestDate - date;
        let value = (dateDifference / duration);
        let datePercentage = (1 - value) * 100;

        gradient
          .append("stop")
          .attr("offset", `${datePercentage}%`)
          .attr("stop-color", this.colorGenerator(opacity));

      }
    }
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

    this.gradientCreator = new PlotGradientCreator(plotChart);
    plotChart.definitions = plotChart.svg.append("defs");

    /**
     * To be called when the mouse enters a bar on the plot chart.
     * @param event The mouse event.
     * @param dataset The represented dataset.
     */
    function mouseEnter(event, dataset) {
      plotChart.tooltipRenderer.showTooltip.bind(plotChart)(event, dataset);
      plotChart.onSelectDataset(event, dataset);
    }

    /**
     * To be called when the mouse leaves a bar on the plot chart.
     * @param event The mouse event.
     * @param dataset The represented dataset.
     */
    function mouseOut(event, dataset) {
      plotChart.tooltipRenderer.hideTooltip.bind(plotChart)(event, dataset);
    }

    /**
     * Draws the bars.
     */
    this.renderBars = function () {
      let datasets = plotChart.dataView.datasets;
      plotChart.definitions = plotChart.svg.append("defs");

      for (let index = 0; index < datasets.length; index++) {
        this.gradientCreator.createGradient(datasets[index]);
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
        .attr("x", (d) => plotChart.xChart((d.duration < 0) ? d.lastDate : d.firstDate || 0))
        .attr("y", (d) => plotChart.yChart(d.label))
        .attr("height", plotChart.yChart.bandwidth())
        .attr("id", (d) => 'rect-' + createIDFromDataset(d))
        .on('mouseenter', mouseEnter)
        .on('mouseout', mouseOut)
        .attr("width", function (data) {
          if (!data.firstDate || !data.lastDate) return 0;
          return plotChart.xChart(data.lastDate) - plotChart.xChart(data.firstDate) + plotChart.xChart.bandwidth();
        }.bind(this));
    };
  }
}

/**
 * Appends and updates the tooltip of a plot chart.
 * @class PlotTooltipRenderer
 * @see PlotChart
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
     * Returns the HTML content for the given dataset.
     * @param dataset The dataset to represent in HTML.
     */
    function getHTMLContentForDataset(dataset) {
      let components = [];

      components.push('Label: ' + dataset.label);
      components.push('');
      components.push('Start: ' + dataset.earliestDate);
      components.push('End: ' + dataset.latestDate);
      components.push('');
      components.push('Items: ' + dataset.data.map(item => item.value).reduce((acc, next) => +acc + +next, 0));
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
      if (!plotChart.config.showTooltip) return;
      tooltip.html(getHTMLContentForDataset(dataset));

      // position tooltip
      let tooltipHeight = Number(tooltip.style('height').replace('px', ''));
      let factor = plotChart.getElementEffectiveSize()[0] / plotChart.config.width;
      let offset = plotChart.getElementPosition();

      let top = plotChart.yChart(dataset.label) * factor;
      top += offset[1];

      if ((plotChart.yChart(dataset.label) - plotChart.config.margin.top) <= (plotChart.graphHeight / 2)) {
        top += (plotChart.config.lineHeight * factor) + GlobalConfig.tooltipOffset;
      } else {
        top -= tooltipHeight + 20; // subtract padding
        top -= GlobalConfig.tooltipOffset;
      }

      let left = getTooltipLeftForDataset(dataset, factor, offset);

      tooltip
        .style('left', left + 'px')
        .style('top', top + 'px')
        .style('opacity', 1);
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
      if (!plotChart.config.isShowLabels) return;
      let xBandwidth = plotChart.yChart.bandwidth();
      let xChart = plotChart.xChart;
      plotChart.labels = plotChart
        .barsData
        .append('g')
        .attr('transform', `translate(0,${(xBandwidth / 2) + 4})`)
        .append('text')
        .attr('class', 'lotivis-plot-label')
        .attr("id", (d) => 'rect-' + hashCode(d.label))
        .attr("x", (d) => xChart(d.firstDate) + (xBandwidth / 2))
        .attr("y", (d) => plotChart.yChart(d.label))
        .attr("width", (d) => xChart(d.lastDate) - xChart(d.firstDate) + xBandwidth)
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
    this.render = function () {
      if (!plotChart.config.drawGrid) return;

      plotChart.svg
        .append('g')
        .attr('class', 'lotivis-plot-grid lotivis-plot-grid-x')
        .attr('transform', 'translate(0,' + (plotChart.preferredHeight - plotChart.config.margin.bottom) + ')')
        .call(plotChart.xAxisGrid);

      plotChart.svg
        .append('g')
        .attr('class', 'lotivis-plot-grid lotivis-plot-grid-y')
        .attr('transform', `translate(${plotChart.config.margin.left},0)`)
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
 * Enumeration of sorts available in the plot chart.
 */
const PlotChartSort = {
  alphabetically: 'alphabetically',
  duration: 'duration',
  intensity: 'intensity',
  firstDate: 'firstDate'
};

const defaultPlotChartConfig = {
  width: 1000,
  height: 600,
  margin: {
    top: GlobalConfig.defaultMargin,
    right: GlobalConfig.defaultMargin,
    bottom: GlobalConfig.defaultMargin,
    left: GlobalConfig.defaultMargin
  },
  lineHeight: 28,
  radius: 23,
  isShowLabels: true,
  drawGrid: true,
  showTooltip: true,
  lowColor: 'rgb(184, 233, 148)',
  highColor: 'rgb(0, 122, 255)',
  sort: PlotChartSort.duration
};

/**
 *
 * @param date
 * @constructor
 */
const DefaultDateAccess = (date) => date;

/**
 *
 * @param dateString
 * @returns {number}
 * @constructor
 */
const FormattedDateAccess = function (dateString) {
  let value = Date.parse(dateString);
  if (isNaN(value)) {
    LogOnlyOnce('isNaN', `Received NaN for date "${dateString}"`);
  }
  return value;
};

/**
 *
 * @param dateString
 * @returns {number}
 * @constructor
 */
const DateGermanAssessor = function (dateString) {
  let saveDateString = String(dateString);
  let components = saveDateString.split('.');
  let day = components[0];
  let month = components[1];
  let year = components[2];
  let date = new Date(`${year}-${month}-${day}`);
  return Number(date);
};

/**
 *
 * @param weekday
 * @returns {number}
 * @constructor
 */
const DateWeekAssessor = function (weekday) {
  let lowercase = weekday.toLowerCase();
  switch (lowercase) {
    case 'sunday':
    case 'sun':
      return 0;
    case 'monday':
    case 'mon':
      return 1;
    case 'tuesday':
    case 'tue':
      return 2;
    case 'wednesday':
    case 'wed':
      return 3;
    case 'thursday':
    case 'thr':
      return 4;
    case 'friday':
    case 'fri':
      return 5;
    case 'saturday':
    case 'sat':
      return 6;
    default:
      return -1;
  }
};

/**
 * Controls a collection of datasets.
 * @class DatasetsController
 */
class DatasetsController {

  /**
   * Creates a new instance of DatasetsController
   * @param datasets The datasets to control.
   * @param config
   */
  constructor(datasets, config) {
    if (!Array.isArray(datasets)) throw new InvalidFormatError();
    this.config = config || {};
    this.dateAccess = this.config.dateAccess || DefaultDateAccess;
    this.setDatasets(datasets);
  }

  getFlatDataCombinedStacks() {
    return combineByStacks(this.flatData);
  }

  getFlatDataCombinedDates() {
    return combineByDate(this.flatData);
  }

  getFlatDataCombinedLocations() {
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
    return d3LibraryAccess.max(this.workingDatasets, function (dataset) {
      return d3LibraryAccess.max(dataset.data, function (item) {
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

  /**
   * Returns a string that can be used as filename for downloads.
   */
  getFilename() {
    return this.labels.join(',');
  }
}

/**
 *
 * @param dataset
 * @param dateAccess
 * @returns {{}}
 */
function createPlotDataset(dataset, dateAccess) {
  let newDataset = {};
  let data = copy(dataset.data);
  let firstDate = extractEarliestDateWithValue(data) || 0;
  let lastDate = extractLatestDateWithValue(data) || 0;
  let flatData = flatDataset(dataset);

  newDataset.label = dataset.label;
  newDataset.stack = dataset.stack;
  newDataset.firstDate = firstDate;
  newDataset.lastDate = lastDate;
  newDataset.sum = sumOfValues(flatData);
  newDataset.data = combineByDate(data)
    .sort((left, right) => left.dateNumeric - right.dateNumeric)
    .filter(item => (item.value || 0) > 0);

  return newDataset;
}

/**
 * Returns a new generated plot samples view for the current enabled samples of dataset of this controller.
 */
DatasetsController.prototype.getPlotDataview = function () {

  this.dateAccess;
  let enabledDatasets = this.enabledDatasets();
  let dataview = {datasets: []};
  dataview.dates = extractDatesFromDatasets(enabledDatasets);
  dataview.labels = extractLabelsFromDatasets(enabledDatasets);
  dataview.max = this.getMax();

  enabledDatasets.forEach(function (dataset) {
    let newDataset = createPlotDataset(dataset);
    let firstIndex = dataview.dates.indexOf(newDataset.firstDate);
    let lastIndex = dataview.dates.indexOf(newDataset.lastDate);
    newDataset.duration = lastIndex - firstIndex;
    dataview.datasets.push(newDataset);
  });

  dataview.labelsCount = dataview.datasets.length;

  return dataview;
};

/**
 * A lotivis plot chart.
 *
 * @class PlotChart
 * @extends Chart
 */
class PlotChart extends Chart {

  /**
   * Initializes this diachronic chart by setting the default values.
   */
  initialize() {

    this.config;
    let margin;
    margin = Object.assign({}, defaultPlotChartConfig.margin);
    margin = Object.assign(margin, this.config.margin);

    let config = Object.assign({}, defaultPlotChartConfig);
    this.config = Object.assign(config, this.config);
    this.config.margin = margin;

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
      .attr("viewBox", `0 0 ${this.config.width} ${this.config.height}`);
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
    if (this.datasetController) {
      this.dataView = this.datasetController.getPlotDataview();
    } else {
      this.dataView = {datasets: [], barsCount: 0};
    }

    let margin = this.config.margin;
    let barsCount = this.dataView.labelsCount || 0;

    this.graphWidth = this.config.width - margin.left - margin.right;
    this.graphHeight = (barsCount * this.config.lineHeight);
    this.height = this.graphHeight + margin.top + margin.bottom;
    this.preferredHeight = this.height;

    this.svg
      .attr("viewBox", `0 0 ${this.config.width} ${this.preferredHeight}`);

    this.sortDatasets();
    this.createScales();
  }

  /**
   * Creates and renders the chart.
   */
  draw() {
    this.backgroundRenderer.render();
    this.gridRenderer.render();
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

    this.xChart = d3
      .scaleBand()
      .domain(this.dataView.dates || [])
      .rangeRound([this.config.margin.left, this.config.width - this.config.margin.right])
      .paddingInner(0.1);

    this.yChart = d3
      .scaleBand()
      .domain(this.dataView.labels || [])
      .rangeRound([this.height - this.config.margin.bottom, this.config.margin.top])
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
    if (this.datasetController.listeners.length === 1) return;
    this.updateSensible = false;
    this.datasetController.setDatasetsFilter([label]);
    this.updateSensible = true;
  }

  sortDatasets() {
    this.dataView.datasets = this.dataView.datasets.reverse();
    switch (this.sort) {
      case PlotChartSort.alphabetically:
        this.dataView.datasets = this.dataView.datasets
          .sort((set1, set2) => set1.label > set2.label);
        break;
      case PlotChartSort.duration:
        this.dataView.datasets = this.dataView.datasets
          .sort((set1, set2) => set1.duration < set2.duration);
        break;
      case PlotChartSort.intensity:
        this.dataView.datasets = this.dataView.datasets
          .sort((set1, set2) => set1.sum < set2.sum);
        break;
      case PlotChartSort.firstDate:
        this.dataView.datasets = this.dataView.datasets
          .sort((set1, set2) => set1.earliestDate > set2.earliestDate);
        break;
    }
  }
}

/**
 *
 * @class Dropdown
 * @extends Component
 */
class Dropdown extends Component {

  /**
   * Creates a new instance of Dropdown.
   * @param parent The parent or selector.
   */
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
      let name;

      if (Array.isArray(options[i])) {
        options[i][0] || options[i].id;
        name = options[i][1] || options[i].translatedTitle;
      } else if (typeof options[i] === 'string') {
        options[i];
        name = options[i];
      } else {
        options[i].id;
        name = options[i].title;
      }

      let inputElement = this.addOption(name, name);
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

Dropdown.create = function (selector, options, selectedOption, onChange) {
  let div = d3.select(`#${selector}`);
  let dropdown = new Dropdown(div);
  dropdown.setLabelText('Group Size');
  dropdown.setOptions(options);
  dropdown.setSelectedOption(selectedOption);
  dropdown.setOnChange(onChange);
  return dropdown;
};

/**
 *
 * @class PlotChartSettingsPopup
 * @extends Popup
 */
class PlotChartSettingsPopup extends Popup {

  /**
   * Appends the headline and the content row of the popup.
   */
  inject() {
    this.card.setCardTitle('Settings');
    this.card.content.classed('lotivis-card-body-settings', true);
    this.row = this.card.content
      .append('div')
      .classed('lotivis-row', true);
    this.renderShowLabelsCheckbox();
  }

  /**
   * Appends the checkboxes the popups content.
   */
  renderShowLabelsCheckbox() {
    let container = this.row.append('div').classed('lotivis-col-12', true);

    this.showLabelsCheckbox = new Checkbox(container);
    this.showLabelsCheckbox.setText('Labels');
    this.showLabelsCheckbox.onClick = function (checked) {
      this.chart.config.isShowLabels = checked;
      this.chart.update();
      UrlParameters.getInstance().set(UrlParameters.chartShowLabels, checked);
    }.bind(this);

    let dropdownContainer = this.row.append('div').classed('lotivis-col-12', true);
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
    return {width: 240, height: 600};
  }

  /**
   * Tells this popup that it is about to be displayed.
   */
  willShow() {
    this.showLabelsCheckbox.setChecked(this.chart.config.isShowLabels);
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
   * @param config
   */
  constructor(selector, config) {
    let theSelector = selector || 'plot-chart-card';
    super(theSelector, config);
    this.selector = selector;
    this.name = selector;
    this.datasets = [];
    this.injectRadioGroup();
    this.applyURLParameters();
    this.setCardTitle('Plot');
  }

  /**
   * Injects the plot chart in the body of the card.
   */
  injectChart() {
    this.chart = new PlotChart(this.body, {
      margin: {
        left: 120,
        right: 50
      }
    });
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
    let filename = this.chart.datasetController.getFilename();
    let downloadFilename = createDownloadFilename(filename, `plot-chart`);
    downloadImage(this.chart.svgSelector, downloadFilename);
  }
}

/**
 * Sets a new datasets controller.  The chart is updated automatically.
 * @param newController The new datasets controller.
 */
Chart.prototype.setDatasetController = function (newController) {
  this.datasetController = newController;
  this.datasetController.addListener(this);
  this.update();
};

/**
 * Sets the datasets of this map chart.
 * @param newDatasets The new dataset.
 */
Chart.prototype.setDatasets = function (newDatasets) {
  this.setDatasetController(new DatasetsController(newDatasets));
};

/**
 * Returns the presented datasets.
 * @returns {[*]} The collection of datasets.
 */
Chart.prototype.setDatasets = function () {
  if (!this.datasetController || !Array.isArray(this.datasetController.datasets)) return [];
  return this.datasetController.datasets;
};

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
  inject() {
    super.inject();
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

/**
 * Validates the given datasets.
 * @param datasets The datasets to validate.
 * @throws InvalidFormatError
 */
function validateDatasets(datasets) {

  if (!datasets) {
    throw new InvalidFormatError(`No dataset given.`);
  } else if (!Array.isArray(datasets)) {
    throw new InvalidFormatError(`Expecting array of datasets.`);
  }

  for (let index = 0; index < datasets.length; index++) {
    validateDataset(datasets[index]);
  }
}

/**
 * Validates the given dataset.
 * @param dataset The dataset to validate.
 * @throws InvalidFormatError
 * @throws MissingPropertyError
 */
function validateDataset(dataset) {
  if (!dataset) {
    throw new InvalidFormatError(`No dataset given.`);
  } else if (!dataset.label) {
    throw new MissingPropertyError(`Missing label for dataset. ${dataset}`);
  } else if (!dataset.data) {
    throw new MissingPropertyError(`Invalid data. Property is not an array. Dataset: ${dataset.label}`);
  } else if (!Array.isArray(dataset.data)) {
    throw new InvalidFormatError(`Invalid data. Property is not an array. Dataset: ${dataset.label}`);
  }

  let data = dataset;
  for (let index = 0; index < data.length; index++) {
    validateDataItem(data[index]);
  }
}

/**
 * Validates the given data item by ensuring it has a valid `date`, `location` and `value` property value.
 * @param item The data item to validate.
 * @throws MissingPropertyError
 */
function validateDataItem(item) {
  if (!item.date) {
    throw new MissingPropertyError(`Missing date property for item.`);
  } else if (!item.location) {
    throw new MissingPropertyError(`Missing location property for item.`);
  }
}

/**
 * A toast in the top of the page.
 *
 * @class Toast
 * @extends Component
 */
class Toast extends Component {

  /**
   * Creates an instance of Toast.
   *
   * @constructor
   * @param {Component} parent The parental component.
   */
  constructor(parent) {
    super(parent);
    this.element = this
      .parent
      .append('div')
      .style('opacity', 0)
      .style('display', `none`)
      .attr('class', 'lotivis-data-card-status-tooltip');
  }

  /**
   * Sets the text of the Toast.
   * @param text The text of the Toast.
   */
  setText(text) {
    this.element.text(text);
  }

  show() {
    super.show();
    this.element.style('opacity', 1);
  }

  hide() {
    super.hide();
    this.element.style('opacity', 0);
  }

  /**
   * Sets the text of the status label.  If text is empty the status label will be hide.
   * @param newStatusMessage The new status message.
   */
  setStatusMessage(newStatusMessage) {
    this.element.text(newStatusMessage);
    if (newStatusMessage === "") {
      this.hide();
    } else {
      this.show();
    }
  }
}

/**
 *
 * @class DataCard
 * @extends Card
 */
class DataCard extends Card {

  /**
   * Creates a new instance of DatasetCard.
   * @param parent The parental element or a selector (id).
   */
  constructor(parent) {
    super(parent);
    this.updateSensible = true;
    this.body.style('overflow', 'scroll');
    this.render();
    this.toast = new Toast(this.parent);
    this.setCardTitle('Dataset');
  }

  /**
   * Appends the component to this card.
   */
  render() {
    // this.element.classed('lotivis-data-card', true);
    this.textareaID = createID();
    this.textarea = this.body
      .append('textarea')
      .attr('id', this.textareaID)
      .attr('name', this.textareaID)
      .attr('class', 'lotivis-data-textarea');

    this.textarea.on('keyup', this.onKeyup.bind(this));

    this.downloadButton = new Button(this.headerRightComponent);
    this.downloadButton.setText('Download');
    this.downloadButton.onClick = function (event) {
      let content = this.getTextareaContent();
      this.download(content);
    }.bind(this);
  }

  /**
   * Returns the text of the textarea.
   * @returns {*} The text of the textarea.
   */
  getTextareaContent() {
    return document.getElementById(this.textareaID).value || "";
  }

  /**
   * Sets the text of the textarea.
   * @param newContent The text for the textarea.
   */
  setTextareaContent(newContent) {
    let textarea = document.getElementById(this.textareaID);
    if (!textarea) return;
    textarea.value = newContent;

    if (typeof newContent !== 'string') return;
    // let numberOfRows = newContent.split(`\n`).length;
    // this.textarea.attr('rows', numberOfRows);
    this.textarea.attr('rows', 30);
  }

  /**
   * Sets the dataset controller.
   * @param newDatasetController
   */
  setDatasetController(newDatasetController) {
    this.datasetController = newDatasetController;
    this.datasetController.addListener(this);
    this.updateContentsOfTextarea();
  }

  /**
   * Tells this dataset card that a 'keyup'-event occurred in the textarea.
   */
  onKeyup() {
    this.updateDatasetsOfController.bind(this)(true);
  }

  /**
   * Tells thi dataset card that the datasets of the datasets controller has changed.
   * @param datasetsController The datasets controller.
   * @param reason The reason of the update.
   */
  update(datasetsController, reason) {
    if (!this.updateSensible) return lotivis_log(`[lotivis]  Skipping update due to not update sensible (Reason: ${reason}).`);
    this.updateContentsOfTextarea();
  }

  /**
   * Tells
   * @param notifyController A boolean value indicating whether the datasets controller should be notified about the
   * update.
   */
  updateDatasetsOfController(notifyController = false) {

    let content = this.getTextareaContent();
    this.toast.setStatusMessage('', true);

    try {

      // will throw an error if parsing is not possible
      let parsedDatasets = this.textToDatasets(content);

      // will throw an error if parsed datasets aren't valid.
      validateDatasets(parsedDatasets);

      if (notifyController === true) {

        if (!this.datasetController) {
          return lotivis_log(`[lotivis]  No datasets controller.`);
        }

        if (objectsEqual(this.cachedDatasets, parsedDatasets)) {
          return lotivis_log(`[lotivis]  No changes in datasets.`);
        }

        this.cachedDatasets = parsedDatasets;
        this.updateSensible = false;
        this.datasetController.setDatasets(parsedDatasets);
        this.updateSensible = true;
      }

    } catch (error) {
      lotivis_log(`[lotivis]  ERROR: ${error}`);
      this.toast.setStatusMessage(error, false);
    }
  }

  /**
   * Tells this datasets card to update the content of the textarea by rendering the datasets to text.
   */
  updateContentsOfTextarea() {
    if (!this.datasetController || !this.datasetController.datasets) return;
    let datasets = this.datasetController.datasets;
    let content = this.datasetsToText(datasets);
    this.setTextareaContent(content);
    this.cachedDatasets = datasets;
  }

  /**
   * Initiates a download of the content of the textarea.
   */
  download(content) {
    throw new Error(`Subclasses should override.`);
  }

  /**
   * Returns the parsed datasets from the content of the textarea.  Will throw an exception if parsing is not possible.
   * Subclasses should override.
   * @param text The text to samples.parse to datasets.
   * @return {*}
   */
  textToDatasets(text) {
    throw new Error(`Subclasses should override.`);
  }

  /**
   * Sets the content of the textarea by rendering the given datasets to text.  Subclasses should override.
   * @param datasets The datasets to render.
   * @return {*}
   */
  datasetsToText(datasets) {
    throw new Error(`Subclasses should override.`);
  }
}

/**
 * A card containing a textarea which contains the JSON text of a dataset collection.
 * @class DatasetJSONCard
 * @extends DataCard
 */
class DatasetJSONCard extends DataCard {

  /**
   * Creates a new instance of DatasetJSONCard.
   * @param parent The parental element or a selector (id).
   */
  constructor(parent = 'datasets-json-card') {
    super(parent);
    this.setCardTitle('Dataset JSON');
  }

  download(content) {
    let filename = this.datasetController.getFilename();
    let downloadFilename = createDownloadFilename(filename, `datasets`);
    downloadJSON(content, downloadFilename);
  }

  textToDatasets(text) {
    if (text === "") return [];
    return JSON.parse(text.trim());
  }

  datasetsToText(datasets) {
    return JSON.stringify(datasets, null, 2);
  }
}

/*
Following code from:
https://gist.github.com/Jezternz/c8e9fafc2c114e079829974e3764db75

We use this function to save samples.parse a CSV file.
 */

const csvStringToArray = strData => {
  const objPattern = new RegExp(("(\\,|\\r?\\n|\\r|^)(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^\\,\\r\\n]*))"), "gi");
  let arrMatches = null, arrData = [[]];
  while (arrMatches = objPattern.exec(strData)) {
    if (arrMatches[1].length && arrMatches[1] !== ",") arrData.push([]);
    arrData[arrData.length - 1].push(arrMatches[2] ?
      arrMatches[2].replace(new RegExp("\"\"", "g"), "\"") :
      arrMatches[3]);
  }
  return arrData;
};

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
  return saveString.substring(first, saveString.length - last);
}

/**
 * Returns a dataset collection created from the given flat samples collection.
 * @param flatData The flat samples collection.
 * @returns {[]} A collection of datasets.
 */
function createDatasets(flatData) {
  let datasetsByLabel = {};

  for (let itemIndex = 0; itemIndex < flatData.length; itemIndex++) {
    let item = flatData[itemIndex];

    if (!validateDataItem(item)) ;

    let label = item.dataset || item.label;
    let dataset = datasetsByLabel[label];

    if (dataset) {
      dataset.data.push({
        date: item.date,
        location: item.location,
        value: item.value
      });
    } else {
      datasetsByLabel[label] = {
        label: label,
        stack: item.stack,
        data: [{
          date: item.date,
          location: item.location,
          value: item.value
        }]
      };
    }
  }

  let datasets = [];
  let labels = Object.getOwnPropertyNames(datasetsByLabel);

  for (let index = 0; index < labels.length; index++) {
    let label = labels[index];
    if (label.length === 0) continue;
    datasets.push(datasetsByLabel[label]);
  }

  return datasets;
}

function parseCSV(text) {
  let flatData = [];
  let arrays = csvStringToArray(text);
  let headlines = arrays.shift();

  for (let lineIndex = 0; lineIndex < arrays.length; lineIndex++) {

    let lineArray = arrays[lineIndex].map(element => trimByChar(element, `"`));

    if (lineArray.length < 5) {
      lotivis_log(`Skipping row: ${lineArray}`);
      continue;
    }

    flatData.push({
      label: lineArray[0],
      stack: lineArray[1],
      value: +lineArray[2],
      date: lineArray[3],
      location: lineArray[4]
    });
  }

  let datasets = createDatasets(flatData);
  datasets.csv = {
    content: text,
    headlines: headlines,
    lines: arrays,
  };

  return datasets;
}

/**
 * Returns the given string with a quotation mark in the left and right.
 * @param aString The string to surround by quotation marks.
 * @returns {string} The string surrounded by quotation marks.
 */
function surroundWithQuotationMarks(aString) {
  return `"${aString}"`;
}

/**
 * Returns the CSV string of the given datasets.
 * @param datasets The datasets to create the CSV of.
 */
function renderCSV(datasets) {
  let flatData = flatDatasets(datasets);
  let headlines = ['label', 'stack', 'value', 'date', 'location'];
  let csvContent = `${headlines.join(',')}\n`;
  for (let index = 0; index < flatData.length; index++) {
    let data = flatData[index];
    let components = [];
    components.push(surroundWithQuotationMarks(data.dataset || 'Unknown'));
    components.push(surroundWithQuotationMarks(data.stack || ''));
    components.push(data.value || '0');
    components.push(surroundWithQuotationMarks(data.date || ''));
    components.push(surroundWithQuotationMarks(data.location || ''));
    csvContent += `${components.join(`,`)}\n`;
  }
  return csvContent;
}

/**
 * Presents the CSV version of datasets.  The presented CSV can be edited.
 * @class DatasetCSVCard
 * @extends Card
 */
class DatasetCSVCard extends DataCard {

  /**
   * Creates a new instance of DatasetCSVCard.
   * @param parent The parental element or a selector (id).
   */
  constructor(parent) {
    super(parent);
    this.setCardTitle('Dataset CSV');
  }

  download(content) {
    let filename = this.datasetController.getFilename();
    let downloadFilename = createDownloadFilename(filename, `datasets`);
    downloadCSV(content, downloadFilename);
  }

  textToDatasets(text) {
    if (text === "") return [];
    return parseCSV(text);
  }

  datasetsToText(datasets) {
    return renderCSV(datasets);
  }
}

/**
 * Returns a collection of datasets parsed from the given CSV content.
 * @param text The CSV content.
 * @returns {[]} The parsed datasets.
 */
function parseCSVDate(text) {
  let arrays = csvStringToArray(text);
  let datasetLabels = arrays.shift();
  datasetLabels.shift();
  let datasets = [];
  let minLineLength = datasetLabels.length;

  for (let index = 0; index < datasetLabels.length; index++) {
    datasets.push({
      label: datasetLabels[index],
      data: []
    });
  }

  for (let lineIndex = 0; lineIndex < arrays.length; lineIndex++) {
    let lineArray = arrays[lineIndex].map(element => trimByChar(element, `"`));
    if (lineArray.length < minLineLength) continue;

    let date = lineArray.shift();

    for (let columnIndex = 0; columnIndex < lineArray.length; columnIndex++) {
      let value = lineArray[columnIndex];
      datasets[columnIndex].data.push({
        date: date,
        value: value
      });
    }
  }

  datasets.csv = {
    content: text,
    headlines: datasetLabels.push(),
    lines: arrays,
  };

  return datasets;
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

/**
 *
 * @param datasets
 */
function renderCSVDate(datasets) {
  let dateRelation = dateToItemsRelation(datasets);
  let labels = extractLabelsFromDatasets(datasets);
  let headlines = ['date'];

  for (let labelIndex = 0; labelIndex < labels.length; labelIndex++) {
    headlines.push(labels[labelIndex]);
  }

  let csvContent = `${headlines.join(',')}\n`;

  for (let index = 0; index < dateRelation.length; index++) {
    let dateRow = dateRelation[index];
    let csvRow = `${dateRow.date}`;

    for (let labelIndex = 0; labelIndex < labels.length; labelIndex++) {
      let label = labels[labelIndex];
      csvRow += `,${dateRow[label]}`;
    }

    csvContent += `${csvRow}\n`;
  }

  return csvContent;
}

/**
 * Presents the CSV version of datasets.  The presented CSV can be edited.
 * @class DatasetCSVDateCard
 * @extends Card
 */
class DatasetCSVDateCard extends DataCard {

  /**
   * Creates a new instance of DatasetCSVCard.
   * @param parent The parental element or a selector (id).
   */
  constructor(parent) {
    super(parent);
    this.setCardTitle('Dataset CSV');
  }

  download(content) {
    let filename = this.datasetController.getFilename();
    let downloadFilename = createDownloadFilename(filename, `datasets`);
    downloadCSV(content, downloadFilename);
  }

  textToDatasets(text) {
    if (text === "") return [];
    return parseCSVDate(text);
  }

  datasetsToText(datasets) {
    return renderCSVDate(datasets);
  }
}

/**
 * A card containing a textarea which contains the JSON text of a dataset collection.
 * @class DataViewCard
 * @extends DataCard
 */
class DataViewCard extends DatasetJSONCard {

  /**
   * Creates a new instance of DataViewCard.
   * @param parent The parental element or a selector (id).
   */
  constructor(parent = 'dataview-card') {
    super(parent);
    this.setCardTitle(this.getTitle());
  }

  updateDatasetsOfController(notifyController = false) {
    // do nothing
  }

  datasetsToText(datasets) {
    if (!this.datasetController) return "No datasets controller.";
    let dataview = this.getDataView();
    return JSON.stringify(dataview, null, 2);
  }

  getTitle() {
    return 'Dataview';
  }

  getDataView() {
    // empty
  }
}

class DataViewDateCard extends DataViewCard {
  getTitle() {
    return 'Dataview Date';
  }

  getDataView() {
    return this.datasetController.getDateDataview();
  }
}

class DataViewPlotCard extends DataViewCard {
  getTitle() {
    return 'Dataview Plot';
  }

  getDataView() {
    return this.datasetController.getPlotDataview();
  }
}

class DataViewMapCard extends DataViewCard {
  getTitle() {
    return 'Dataview Map';
  }

  getDataView() {
    return this.datasetController.getMapDataview();
  }
}

class DataViewFlatCard extends DataViewCard {
  getTitle() {
    return 'Flat Data';
  }

  getDataView() {
    return this.datasetController.flatData;
  }
}

class DataViewDatasetsControllerCard extends DataViewCard {
  getTitle() {
    return 'Datasets Controller';
  }

  getDataView() {
    return {
      workingDatasets: this.datasetController.workingDatasets,
      flatData: this.datasetController.flatData,
      labels: this.datasetController.labels,
      stacks: this.datasetController.stacks,
      dates: this.datasetController.dates
    };
  }
}

/**
 * Appends the given listener to the collection of listeners.
 * @param listener The listener to add.
 */
DatasetsController.prototype.addListener = function (listener) {
  if (!this.listeners) this.listeners = [];
  this.listeners.push(listener);
};

/**
 * Removes the given listener from the collection of listeners.
 * @param listener The listener to remove.
 */
DatasetsController.prototype.removeListener = function (listener) {
  if (!this.listeners) return;
  let index = this.listeners.indexOf(listener);
  if (index === -1) return;
  this.listeners = this.listeners.splice(index, 1);
};

/**
 * Notifies all listeners.
 * @param reason The reason to send to the listener.  Default is 'none'.
 */
DatasetsController.prototype.notifyListeners = function (reason = DatasetsController.NotificationReason.none) {
  if (!this.listeners) return lotivis_log(`[lotivis]  No listeners to notify.`);
  for (let index = 0; index < this.listeners.length; index++) {
    let listener = this.listeners[index];
    if (!listener.update) continue;
    listener.update(this, reason);
  }
};

/**
 * Sets this controller to all of the given listeners via the `setDatasetsController` function.
 * @param listeners A collection of listeners.
 */
DatasetsController.prototype.register = function (listeners) {
  if (!Array.isArray(listeners)) return;
  for (let index = 0; index < listeners.length; index++) {
    let listener = listeners[index];
    if (!listener.setDatasetController) continue;
    listener.setDatasetController(this);
  }
};

DatasetsController.NotificationReason = {
  none: 'none',
  datasetsUpdate: 'datasets-update',
  filterDataset: 'dataset-filter',
  filterDates: 'dates-filter',
  filterLocations: 'location-filter',
  resetFilters: 'reset-filters'
};

/**
 * Resets all filters.  Notifies listeners.
 */
DatasetsController.prototype.resetFilters = function (notifyListeners = true) {
  this.locationFilters = [];
  this.dateFilters = [];
  this.datasetFilters = [];
  if (!notifyListeners) return;
  this.notifyListeners(DatasetsController.NotificationReason.resetFilters);
};

/**
 * Sets the locations filter.  Notifies listeners.
 * @param locations The locations to filter.
 */
DatasetsController.prototype.setLocationsFilter = function (locations) {
  let stringVersions = locations.map(location => String(location));
  if (objectsEqual(this.locationFilters, stringVersions)) {
    return lotivis_log(`[lotivis]  Date filters not changed.`);
  }
  this.resetFilters(false);
  this.locationFilters = stringVersions;
  this.notifyListeners(DatasetsController.NotificationReason.locationFilters);
};

/**
 * Sets the dates filter.  Notifies listeners.
 * @param dates The dates to filter.
 */
DatasetsController.prototype.setDatesFilter = function (dates) {
  let stringVersions = dates.map(date => String(date));
  if (objectsEqual(this.dateFilters, stringVersions)) {
    return lotivis_log(`[lotivis]  Date filters not changed.`);
  }
  this.resetFilters(false);
  this.dateFilters = stringVersions;
  this.notifyListeners(DatasetsController.NotificationReason.dateFilters);
};

/**
 * Sets the datasets filter.  Notifies listeners.
 * @param datasets The datasets to filter.
 */
DatasetsController.prototype.setDatasetsFilter = function (datasets) {
  let stringVersions = datasets.map(dataset => String(dataset));
  if (objectsEqual(this.datasetFilters, stringVersions)) {
    return lotivis_log(`[lotivis]  Dataset filters not changed.`);
  }
  this.resetFilters(false);
  this.datasetFilters = stringVersions;
  this.notifyListeners(DatasetsController.NotificationReason.filterDataset);
};

/**
 * Toggles the enabled of the dataset with the given label.
 * @param label The label of the dataset.
 * @param notifyListeners A boolean value indicating whether to notify the listeners.  Default is `true`.
 */
DatasetsController.prototype.toggleDataset = function (label, notifyListeners=true) {
  this.workingDatasets.forEach(function (dataset) {
    if (dataset.label === label) {
      dataset.isEnabled = !dataset.isEnabled;
    }
  });
  if (!notifyListeners) return;
  this.notifyListeners('dataset-toggle');
};

/**
 * Enables all datasets.  Notifies listeners.
 */
DatasetsController.prototype.enableAllDatasets = function () {
  this.workingDatasets.forEach(function (dataset) {
    dataset.isEnabled = true;
  });
  this.notifyListeners('dataset-enable-all');
};

/**
 * Returns a newly generated collection containing all enabled datasets.
 * @returns {*} The collection of enabled datasets.
 */
DatasetsController.prototype.enabledDatasets = function () {
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
};

/**
 * Returns the flat version of the collection of enabled datasets.
 * @returns {[]}
 */
DatasetsController.prototype.enabledFlatData = function () {
  return flatDatasets(this.enabledDatasets());
};

/**
 * Returns the set of labels of the enabled datasets.
 * @returns {*[]} The set of labels.
 */
DatasetsController.prototype.enabledLabels = function () {
  return extractLabelsFromDatasets(this.enabledDatasets());
};

/**
 * Returns the set of stacks of the enabled datasets.
 * @returns {*[]} The set of stacks.
 */
DatasetsController.prototype.enabledStacks = function () {
  return extractStacksFromDatasets(this.enabledDatasets());
};

/**
 * Returns the set of dates of the enabled datasets.
 * @returns {*[]} The set of dates.
 */
DatasetsController.prototype.enabledDates = function () {
  return extractDatesFromDatasets(this.enabledDatasets());
};

/**
 *
 * @class DatasetsColorsController
 */
class DatasetsColorsController {

  /**
   * Creates a new instance of DatasetsColorsController.
   * @param workingDatasets
   * @param stacks
   */
  constructor(workingDatasets, stacks) {

    let datasets = workingDatasets;
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
 * Updates the datasets of this controller.
 * @param datasets The new datasets.
 */
DatasetsController.prototype.setDatasets = function (datasets) {
  this.originalDatasets = datasets;
  this.datasets = copy(datasets);
  clearAlreadyLogged();
  this.update();
};

/**
 *
 */
DatasetsController.prototype.update = function () {
  if (!this.datasets || !Array.isArray(this.datasets)) return;

  let dateAccess = this.dateAccess;
  this.workingDatasets = copy(this.datasets)
    .sort((left, right) => left.label > right.label);
  this.workingDatasets.forEach(function (dataset) {
    dataset.isEnabled = true;
    dataset.data.forEach(function (item) {
      item.dateNumeric = dateAccess(item.date);
    });
    dataset.data = dataset.data
      .sort((left, right) => left.dateNumeric - right.dateNumeric);
  });

  this.flatData = flatDatasets(this.workingDatasets);
  this.labels = extractLabelsFromDatasets(this.datasets);
  this.stacks = extractStacksFromDatasets(this.datasets);
  this.dates = extractDatesFromDatasets(this.datasets)
    .sort((left, right) => dateAccess(left) - dateAccess(right));
  this.locations = extractLocationsFromDatasets(this.datasets);
  this.datasetsColorsController = new DatasetsColorsController(this.workingDatasets, this.stacks);
  // this.dateAccess = function (date) {
  //   return Date.parse(date);
  // };

  this.locationFilters = [];
  this.dateFilters = [];
  this.datasetFilters = [];
  this.notifyListeners(DatasetsController.NotificationReason.datasetsUpdate);
};

/**
 * Appends the given dataset to this controller.
 * @param additionalDataset The dataset to append.
 */
DatasetsController.prototype.add = function (additionalDataset) {
  if (this.datasets.find(dataset => dataset.label === additionalDataset.label)) {
    throw new Error(`DatasetsController already contains a dataset with the same label (${additionalDataset.label}).`);
  }
  this.datasets.push(additionalDataset);
  this.update();
};

/**
 * Removes the dataset with the given label from this controller. Will do nothing if no dataset
 * with the given label exists.
 *
 * @param label The label of the dataset to remove.
 */
DatasetsController.prototype.remove = function (label) {
  if (!this.datasets || !Array.isArray(this.datasets)) return;
  let candidate = this.datasets.find(dataset => dataset.label === label);
  if (!candidate) return;
  let index = this.datasets.indexOf(candidate);
  if (index < 0) return;
  this.datasets = this.datasets.splice(index, 1);
  this.update();
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

/**
 * Returns the first item of the array.
 * @returns {*} The first item.
 */
Array.prototype.first = function () {
  return this[0];
};

/**
 * Returns the last item of the array.
 * @returns {*} The last item.
 */
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
  if (ratio <= 1) return data;

  let combined = combineByDate(copy(data));
  let newData = [];

  while (combined.length > 0) {
    let dateGroup = combined.splice(0, ratio);
    let firstItem = dateGroup.first() || {};
    let lastItem = dateGroup.last() || {};
    let item = {};
    item.dataset = firstItem.dataset;
    item.label = firstItem.label;
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
 * Returns a new generated DateDataview for the current enabled samples of dataset of this controller.
 */
DatasetsController.prototype.getDateDataview = function (groupSize) {
  this.dateAccess;
  let workingDatasets = copy(this.workingDatasets);
  let enabledDatasets = copy(this.enabledDatasets() || workingDatasets);
  let dataview = {};
  let saveGroupSize = groupSize || 1;

  dataview.groupSize = saveGroupSize;
  if (saveGroupSize <= 1) {
    dataview.datasets = workingDatasets;
    dataview.enabledDatasets = enabledDatasets;
  } else {
    workingDatasets = combineDatasetsByRatio(workingDatasets, saveGroupSize);
    enabledDatasets = combineDatasetsByRatio(enabledDatasets, saveGroupSize);
    dataview.datasets = workingDatasets;
  }

  dataview.dateToItemsRelation = dateToItemsRelation(workingDatasets);
  dataview.dateToItemsRelationPresented = dateToItemsRelation(enabledDatasets);
  dataview.datasetStacks = createStackModel(this, workingDatasets, dataview.dateToItemsRelation);
  dataview.datasetStacksPresented = createStackModel(this, enabledDatasets, dataview.dateToItemsRelationPresented);

  dataview.max = d3.max(dataview.datasetStacksPresented, function (stack) {
    return d3.max(stack, function (series) {
      return d3.max(series.map(item => item['1']));
    });
  });

  dataview.dates = extractDatesFromDatasets(enabledDatasets);
  dataview.enabledStacks = this.enabledStacks();

  return dataview;
};

/**
 * Returns a new generated DateDataview for the current enabled samples of dataset of this controller.
 */
DatasetsController.prototype.getDateDataviewCombinedStacks = function (groupSize) {
  this.dateAccess;
  let workingDatasets = copy(this.workingDatasets);
  let enabledDatasets = copy(this.enabledDatasets() || workingDatasets);
  let dataview = {};
  let saveGroupSize = groupSize || 1;

  workingDatasets.forEach(function (dataset) {
    dataset.label = dataset.stack || dataset.label;
  });

  enabledDatasets.forEach(function (dataset) {
    dataset.label = dataset.stack || dataset.label;
  });

  workingDatasets = createDatasets(combine(flatDatasets(workingDatasets)));
  enabledDatasets = createDatasets(combine(flatDatasets(enabledDatasets)));

  dataview.groupSize = saveGroupSize;
  if (saveGroupSize <= 1) {
    dataview.datasets = workingDatasets;
    dataview.enabledDatasets = enabledDatasets;
  } else {
    workingDatasets = combineDatasetsByRatio(workingDatasets, saveGroupSize);
    enabledDatasets = combineDatasetsByRatio(enabledDatasets, saveGroupSize);
    dataview.datasets = workingDatasets;
  }

  dataview.dateToItemsRelation = dateToItemsRelation(workingDatasets);
  dataview.dateToItemsRelationPresented = dateToItemsRelation(enabledDatasets);
  dataview.datasetStacks = createStackModel(this, workingDatasets, dataview.dateToItemsRelation);
  dataview.datasetStacksPresented = createStackModel(this, enabledDatasets, dataview.dateToItemsRelationPresented);

  dataview.max = d3.max(dataview.datasetStacksPresented, function (stack) {
    return d3.max(stack, function (series) {
      return d3.max(series.map(item => item['1']));
    });
  });

  dataview.dates = extractDatesFromDatasets(enabledDatasets);
  dataview.enabledStacks = this.enabledStacks();

  return dataview;
};

/**
 * Returns a new generated map data view for the current enabled samples of dataset of this controller.
 */
DatasetsController.prototype.getMapDataview = function () {

  let dataview = {};
  let flatData = this.enabledFlatData();
  let combinedByStack = combineByStacks(flatData);
  dataview.combinedData = combineByLocation(combinedByStack);

  return dataview;
};

// colors
exports.Color = Color;

// components
exports.Component = Component;
exports.Card = Card;
exports.Chart = Chart;
exports.ChartCard = ChartCard;
exports.Checkbox = Checkbox;
exports.Dropdown = Dropdown;
exports.ModalPopup = ModalPopup;
exports.Popup = Popup;
exports.RadioGroup = RadioGroup;
exports.Option = Option;

// date
exports.DateChart = DateChart;
exports.DateChartCard = DateChartCard;

// map
exports.MapChart = MapChart;
exports.MapChartCard = MapChartCard;

// plot
exports.PlotChart = PlotChart;
exports.PlotChartCard = PlotChartCard;

// datasets / csv cards
exports.DatasetCard = DataCard;
exports.DatasetJSONCard = DatasetJSONCard;
exports.DatasetCSVCard = DatasetCSVCard;
exports.DatasetCSVDateCard = DatasetCSVDateCard;
exports.DataViewCard = DataViewCard;
exports.DataViewDateCard = DataViewDateCard;
exports.DataViewPlotCard = DataViewPlotCard;
exports.DataViewMapCard = DataViewMapCard;
exports.DataViewFlatCard = DataViewFlatCard;
exports.DataViewDatasetsControllerCard = DataViewDatasetsControllerCard;

// datasets
exports.DatasetController = DatasetsController;

// url parameters
exports.URLParameters = UrlParameters;

// geo json
// exports.GeoJson = GeoJson;
// exports.Feature = Feature;

// parse
exports.parseCSV = parseCSV;
exports.parseCSVDate = parseCSVDate;

// constants
exports.config = GlobalConfig;
exports.debug = debug;

// date assessors
exports.DefaultDateAccess = DefaultDateAccess;
exports.FormattedDateAccess = FormattedDateAccess;
exports.GermanDateAccess = DateGermanAssessor;
exports.DateWeekAssessor = DateWeekAssessor;

var exports$1 = exports;

exports.default = exports$1;

})));
//# sourceMappingURL=lotivis.js.map
