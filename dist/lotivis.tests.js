/*!
 * lotivis.js v1.0.87
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
 * @class Geometry
 */
class Geometry {

  /**
   * Creates a new instance of Geometry.
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
 * Returns a copy of the passed object.  The copy is created by using the
 * JSON's `parse` and `stringify` functions.
 * @param object The java script object to copy.
 * @returns {any} The copy of the object.
 */
function copy(object) {
  return JSON.parse(JSON.stringify(object));
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
    let newItem = {};
    newItem.dataset = dataset.label;
    newItem.label = dataset.label;
    newItem.stack = dataset.stack || dataset.label;
    newItem.location = item.location;
    newItem.date = item.date;
    newItem.dateNumeric = item.dateNumeric;
    newItem.value = item.value;
    flatData.push(newItem);
  });
  return flatData;
}

const LotivisConfig = {
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
  filenameSeparator: '_',
  // A string which is used for unknown values.
  unknown: 'LOTIVIS_UNKNOWN'
};

/**
 * Returns `true` if the given value not evaluates to false and is not 0. false else.
 * @param value The value to check.
 * @returns {boolean} A Boolean value indicating whether the given value is valid.
 */
function isValue(value) {
  return Boolean(value || value === 0);
}

/**
 * Returns the value if it evaluates to true or is 0.  Returns `GlobalConfig.unknown` else.
 * @param value The value to check.
 * @returns The value or `GlobalConfig.unknown`.
 */
function toValue(value) {
  return value || (value === 0 ? 0 : LotivisConfig.unknown);
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
      if (isValue(listItem.label)) entry.label = listItem.label;
      if (isValue(listItem.dataset)) entry.dataset = listItem.dataset;
      if (isValue(listItem.stack)) entry.stack = listItem.stack;
      if (isValue(listItem.location)) entry.location = listItem.location;
      if (isValue(listItem.locationTotal)) entry.locationTotal = listItem.locationTotal;
      if (isValue(listItem.date)) entry.date = listItem.date;
      if (isValue(listItem.dateTotal)) entry.dateTotal = listItem.dateTotal;
      if (isValue(listItem.locationName)) entry.locationName = listItem.locationName;
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
        && entryItem.location === listItem.location
        && entryItem.date === listItem.date;
    });

    if (entry) {
      entry.value += (listItem.value + 0);
    } else {
      let entry = {};
      if (isValue(listItem.label)) entry.label = listItem.label;
      if (isValue(listItem.dataset)) entry.dataset = listItem.dataset;
      if (isValue(listItem.stack)) entry.stack = listItem.stack;
      if (isValue(listItem.location)) entry.location = listItem.location;
      if (isValue(listItem.locationTotal)) entry.locationTotal = listItem.locationTotal;
      if (isValue(listItem.date)) entry.date = listItem.date;
      if (isValue(listItem.dateTotal)) entry.dateTotal = listItem.dateTotal;
      if (isValue(listItem.locationName)) entry.locationName = listItem.locationName;
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
      if (isValue(listItem.label)) entry.label = listItem.label;
      if (isValue(listItem.dataset)) entry.dataset = listItem.dataset;
      if (isValue(listItem.stack)) entry.stack = listItem.stack;
      if (isValue(listItem.date)) entry.date = listItem.date;
      if (isValue(listItem.dateTotal)) entry.dateTotal = listItem.dateTotal;
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
      if (isValue(listItem.label)) entry.label = listItem.label;
      if (isValue(listItem.dataset)) entry.dataset = listItem.dataset;
      if (isValue(listItem.stack)) entry.stack = listItem.stack;
      if (isValue(listItem.location)) entry.location = listItem.location;
      if (isValue(listItem.locationTotal)) entry.locationTotal = listItem.locationTotal;
      if (isValue(listItem.locationName)) entry.locationName = listItem.locationName;
      entry.value = listItem.value;
      combined.push(entry);
    }
  }
  return combined;
}

/**
 * Returns the set of dataset names from the given dataset collection.
 *
 * @param datasets The collection of datasets.
 * @returns {[]} The array containing the flat samples.
 */
function extractLabelsFromDatasets(datasets) {
  return toSet(datasets.map(dataset => toValue(dataset.label)));
}

/**
 * Returns the set of stacks from the given dataset collection.
 * Will fallback on dataset property if stack property isn't present.
 *
 * @param datasets The collection of datasets.
 * @returns {[]} The array containing the flat samples.
 */
function extractStacksFromDatasets(datasets) {
  return toSet(datasets.map(dataset => toValue(dataset.stack || dataset.label)));
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
 * Returns the set of dataset names from the given flat samples array.
 *
 * @param flatData The flat samples array.
 * @returns {[]} The array containing the flat samples.
 */
function extractLabelsFromFlatData(flatData) {
  return toSet(flatData.map(item => toValue(item.dataset)));
}

/**
 * Returns the set of stacks from the given flat samples array.
 * Will fallback on dataset property if stack property isn't present.
 *
 * @param flatData The flat samples array.
 * @returns {[]} The array containing the flat samples.
 */
function extractStacksFromFlatData(flatData) {
  return toSet(flatData.map(item => toValue(item.stack || item.dataset)));
}

/**
 * Returns the set of dates from the given dataset collection.
 *
 * @param flatData The flat samples array.
 * @returns {[]} The set containing the dates.
 */
function extractDatesFromFlatData(flatData) {
  return toSet(flatData.map(item => toValue(item.date)));
}

/**
 * Returns the set of locations from the given dataset collection.
 *
 * @param flatData The flat samples array.
 * @returns {[]} The set containing the locations.
 */
function extractLocationsFromFlatData(flatData) {
  return toSet(flatData.map(item => toValue(item.location)));
}

/**
 * Return an array containing each equal item of the given array only once.
 *
 * @param array The array to create a set of.
 * @returns {any[]} The set version of the array.
 */
function toSet(array) {
  return Array.from(new Set(array));
}

/**
 * Returns the earliest date occurring in the flat array of items.
 *
 * @param flatData The flat samples array.
 * @param dateAccess
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
  return flatData.map(item => +(item.value || 0)).reduce((acc, next) => acc + next, 0);
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

    // addDataset zero values for empty datasets
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
 * A collection of messages which already hast been printed.
 * @type {*[]}
 */
let alreadyLogged = [];

var lotivis_log_once = function (message) {
  if (alreadyLogged.includes(message)) return;
  alreadyLogged.push(message);
  console.warn(`[lotivis]  Warning only once: ${message}`);
};

var lotivis_log = () => null;

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
    lotivis_log_once(`Received NaN for date "${dateString}"`);
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

class LotivisError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class DataValidateError extends LotivisError {
  // constructor(message) {
  //   super(message);
  // }
}

class MissingPropertyError extends DataValidateError {
  constructor(message, data) {
    super(message + ' ' + JSON.stringify(data || {}));
    this.data = data;
  }
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

class LotivisUnimplementedMethodError extends LotivisError {
  constructor(functionName) {
    super(`Subclasses must override function '${functionName}'.`);
  }
}

exports.LotivisError = LotivisError;
exports.DataValidateError = DataValidateError;
exports.MissingPropertyError = MissingPropertyError;
exports.InvalidFormatError = InvalidFormatError;
exports.GeoJSONValidateError = GeoJSONValidateError;
exports.LotivisUnimplementedMethodError = LotivisUnimplementedMethodError;

/**
 * @class DataviewCache
 */


class DataviewCache {

  /**
   * Creates a new instance of DataviewCache
   */
  constructor() {
    this.content = {};

    this.getDataview = function (type, locationFilters, dateFilters, datasetFilters) {
      let name = createName(type, locationFilters, dateFilters, datasetFilters);
      return this.content[name];
    };

    this.setDataview = function (dataview, type, locationFilters, dateFilters, datasetFilters) {
      let name = createName(type, locationFilters, dateFilters, datasetFilters);
      this.content[name] = dataview;
      lotivis_log(`this.content: `, this.content);
    };

    function createName(type, locationFilters, dateFilters, datasetFilters) {
      return type +
        locationFilters +
        dateFilters +
        datasetFilters;
    }
  }
}

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
    if (!Array.isArray(datasets)) {
      throw new InvalidFormatError(`Datasets are not an array.`);
    }
    this.initialize(config || {});
    this.setDatasets(datasets);
  }

  initialize(config) {
    this.config = config;
    this.dateAccess = this.config.dateAccess || DefaultDateAccess;
    this.locationFilters = this.config.locationFilters || [];
    this.dateFilters = this.config.dateFilters || [];
    this.datasetFilters = this.config.datasetFilters || [];
    this.filters = {};
    this.cache = new DataviewCache();
    if (this.config.filters) {
      this.filters.locations = this.config.filters.locations || [];
      this.filters.dates = this.config.filters.dates || [];
      this.filters.datasets = this.config.filters.datasets || [];
    }
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
    return d3LibraryAccess.max(this.datasets, function (dataset) {
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
    if (!this.labels) return 'Unknown';
    let labels = this.labels.map(label => label.replaceAll(' ', '-'));
    if (labels.length > 10) {
      labels = labels.splice(0, 10);
    }
    return labels.join(',');
  }
}

/**
 *
 * @type {{
 * datasetsUpdate: string,
 * filterDates: string,
 * filterDataset: string,
 * filterLocations: string
 * resetFilters: string,
 * registration: string,
 * none: string,
 * datasetsSet: string
 * }}
 */
DatasetsController.NotificationReason = {
  none: 'none',
  registration: 'registration',
  datasetsSet: 'datasets-set',
  datasetsUpdate: 'datasets-update',
  filterDataset: 'dataset-filter',
  filterDates: 'dates-filter',
  filterLocations: 'location-filter',
  resetFilters: 'reset-filters'
};

/**
 * Appends the given listener to the collection of listeners.
 * @param listener The listener to addDataset.
 */
DatasetsController.prototype.addListener = function (listener) {
  if (!this.listeners) this.listeners = [];
  if (!listener.update) return lotivis_log();
  if (this.listeners.includes(listener)) return lotivis_log();
  this.listeners.push(listener);
  listener.update(this, DatasetsController.NotificationReason.registration);
};

/**
 * Removes the given listener from the collection of listeners.
 * @param listener The listener to removeDataset.
 */
DatasetsController.prototype.removeListener = function (listener) {
  if (!this.listeners) return lotivis_log();
  let index = this.listeners.indexOf(listener);
  if (index === -1) return lotivis_log();
  this.listeners = this.listeners.splice(index, 1);
};

/**
 * Notifies all listeners.
 * @param reason The reason to send to the listener.  Default is 'none'.
 */
DatasetsController.prototype.notifyListeners = function (reason = DatasetsController.NotificationReason.none) {
  if (!this.listeners) return;
  for (let index = 0; index < this.listeners.length; index++) {
    let listener = this.listeners[index];
    if (!listener.update) {
      continue;
    }
    console.timeStamp('will update ' + listener);
    listener.update(this, reason);
    console.timeStamp('did update ' + listener);
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
    if (!listener.setDatasetsController) continue;
    listener.setDatasetsController(this);
  }
};

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
 * Resets all filters.  Notifies listeners.
 */
DatasetsController.prototype.resetFilters = function (notifyListeners = true) {
  this.locationFilters = [];
  this.dateFilters = [];
  this.datasetFilters = [];
  this.calculateSelection();
  if (!notifyListeners) return;
  this.notifyListeners(DatasetsController.NotificationReason.resetFilters);
};

/**
 * Sets the locations filter.  Notifies listeners.
 * @param locations The locations to filter.
 */
DatasetsController.prototype.setLocationsFilter = function (locations) {
  let stringVersions = locations.map(location => String(location)).filter(item => item.length > 0);
  if (objectsEqual(this.locationFilters, stringVersions)) {
    return lotivis_log();
  }
  this.locationFilters = stringVersions;
  this.calculateSelection();
  this.notifyListeners(DatasetsController.NotificationReason.filterLocations);
};

/**
 * Sets the dates filter.  Notifies listeners.
 * @param dates The dates to filter.
 */
DatasetsController.prototype.setDatesFilter = function (dates) {
  let stringVersions = dates.map(date => String(date)).filter(item => item.length > 0);
  if (objectsEqual(this.dateFilters, stringVersions)) return lotivis_log();
  this.dateFilters = stringVersions;
  this.calculateSelection();
  this.notifyListeners(DatasetsController.NotificationReason.filterDates);
};

/**
 * Sets the datasets filter.  Notifies listeners.
 * @param datasets The datasets to filter.
 */
DatasetsController.prototype.setDatasetsFilter = function (datasets) {
  let stringVersions = datasets.map(dataset => String(dataset)).filter(item => item.length > 0);
  if (objectsEqual(this.datasetFilters, stringVersions)) return lotivis_log();
  this.datasetFilters = stringVersions;
  this.calculateSelection();
  this.notifyListeners(DatasetsController.NotificationReason.filterDataset);
};

/**
 * Toggles the enabled of the dataset with the given label.
 * @param label The label of the dataset.
 * @param notifyListeners A boolean value indicating whether to notify the listeners.  Default is `true`.
 */
DatasetsController.prototype.toggleDataset = function (label, notifyListeners = true) {
  this.datasets.forEach((dataset) => {
    if (dataset.label !== label) return;
    dataset.isEnabled = !dataset.isEnabled;
  });
  if (!notifyListeners) return;
  this.notifyListeners('dataset-toggle');
};

/**
 * Enables all datasets.  Notifies listeners.
 */
DatasetsController.prototype.enableAllDatasets = function () {
  this.datasets.forEach(dataset => dataset.isEnabled = true);
  this.notifyListeners('dataset-enable-all');
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
 * Returns a newly generated collection containing all enabled datasets.
 * @returns {*} The collection of enabled datasets.
 */
DatasetsController.prototype.enabledDatasets = function () {
  let aCopy = copy(this.datasets);

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

  return enabled.filter(dataset => dataset.data.length > 0);
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
 * Validates the given datasets.controller item by ensuring it has a valid `date`, `location` and `value` property value.
 * @param item The datasets.controller item to validate.
 * @throws MissingPropertyError
 */
function validateDataItem(item) {
  if (!item.date) {
    throw new MissingPropertyError(`Missing date property for item.`, item);
  } else if (!item.location) {
    throw new MissingPropertyError(`Missing location property for item.`, item);
  }
}

/*
CRUD:
- create
- read
- update
- delete
 */

/**
 * Sets the given dataset.
 * @param dataset The new dataset.
 */
DatasetsController.prototype.setDataset = function (dataset) {
  this.setDatasets([dataset]);
};

/**
 * Updates the datasets of this controller.
 * @param datasets The new datasets.
 */
DatasetsController.prototype.setDatasets = function (datasets) {
  this.originalDatasets = datasets;
  this.datasets = copy(datasets);
  validateDatasets(datasets);
  this.datasetsDidChange();
};

/**
 * Appends the given dataset to this controller.
 * @param dataset The dataset to append.
 */
DatasetsController.prototype.addDataset = function (dataset) {
  this.addDatasets([dataset]);
};

/**
 * Appends the given datasets to this controller.
 * @param datasets The collection of datasets to add.
 */
DatasetsController.prototype.addDatasets = function (datasets) {
  if (!this.datasets || !Array.isArray(this.datasets)) return;
  if (!datasets || !Array.isArray(datasets)) return;
  if (this.datasets.find(dataset => dataset.label === datasets.label)) {
    throw new Error(`DatasetsController already contains a dataset with the same label (${datasets.label}).`);
  }
  datasets.forEach(dataset => this.datasets.push(dataset));
  this.datasetsDidChange();
  this.notifyListeners(DatasetsController.NotificationReason.datasetsUpdate);
};

/**
 * Removes the dataset with the given label from this controller.  Will do nothing if no dataset
 * with the given label exists.
 * @param label The label of the dataset to removeDataset.
 */
DatasetsController.prototype.removeDataset = function (label) {
  this.removeDatasets([label]);
};

/**
 * Removes the given datasets from this controller.  Datasets this controller already containing will be ignored.
 * @param labels The collection of labels to remove.
 */
DatasetsController.prototype.removeDatasets = function (labels) {
  if (!this.datasets || !Array.isArray(this.datasets)) return;
  if (!labels || !Array.isArray(labels)) return;
  labels.forEach(function (label) {
    let candidate = this.datasets.find(dataset => dataset.label === label);
    if (!candidate) return;
    let index = this.datasets.indexOf(candidate);
    if (index < 0) return;
    this.datasets = this.datasets.splice(index, 1);
  }.bind(this));
  this.datasetsDidChange();
};

/**
 * Returns the current selection.
 */
DatasetsController.prototype.getSelection = function () {
  return this.selection;
};

/**
 * Calculates the current selection dependant on the set filters.
 */
DatasetsController.prototype.calculateSelection = function () {
  let selectedData = this.enabledDatasets();
  let flatData = flatDatasets(selectedData);
  this.selection = {
    labels: extractLabelsFromDatasets(selectedData),
    stacks: extractStacksFromDatasets(selectedData),
    dates: extractDatesFromFlatData(flatData),
    locations: extractLocationsFromFlatData(flatData),
    datasets: selectedData,
    flatData: flatData,
  };
};

/**
 * Calculates the additional data.
 */
DatasetsController.prototype.calculateAdditionalData = function () {
  let dateAccess = this.dateAccess;

  this.datasets = copy(this.datasets)
    .sort((left, right) => left.label > right.label);

  this.datasets.forEach(function (dataset) {
    dataset.isEnabled = true;
    dataset.data.forEach(function (item) {
      item.dateNumeric = dateAccess(item.date);
    });
    dataset.data = dataset.data
      .sort((left, right) => left.dateNumeric - right.dateNumeric);
  });

  this.flatData = flatDatasets(this.datasets);
  this.labels = extractLabelsFromDatasets(this.datasets);
  this.stacks = extractStacksFromDatasets(this.datasets);
  this.dates = extractDatesFromDatasets(this.datasets)
    .sort((left, right) => dateAccess(left) - dateAccess(right));

  this.locations = extractLocationsFromDatasets(this.datasets);
  this.datasetsColorsController = new DatasetsColorsController(this.datasets, this.stacks);
};

/**
 * Tells this datasets controller that its datasets did change.
 */
DatasetsController.prototype.datasetsDidChange = function () {
  if (!this.datasets || !Array.isArray(this.datasets)) {
    return;
  }

  this.calculateAdditionalData();
  this.calculateSelection();
  this.notifyListeners(DatasetsController.NotificationReason.datasetsUpdate);
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

DatasetsController.prototype.getCached = function (type) {
  let cached = this.cache.getDataview(
    type,
    this.locationFilters,
    this.dateFilters,
    this.datasetFilters
  );
  return cached;
};

DatasetsController.prototype.setCached = function (dataview, type) {
  return this.cache.setDataview(
    dataview,
    type,
    this.locationFilters,
    this.dateFilters,
    this.datasetFilters
  );
};

/**
 * Returns a new generated DateDataview for the current enabled samples of dataset of this controller.
 */
DatasetsController.prototype.getDateDataview = function (groupSize) {

  let cachedDataView = this.getCached('date');
  if (cachedDataView) {
    return cachedDataView;
  }

  this.dateAccess;
  let datasets = copy(this.datasets);
  let enabledDatasets = copy(this.enabledDatasets() || datasets);
  let dataview = {};
  let saveGroupSize = groupSize || 1;

  dataview.groupSize = saveGroupSize;
  if (saveGroupSize <= 1) {
    dataview.datasets = datasets;
    dataview.enabledDatasets = enabledDatasets;
  } else {
    datasets = combineDatasetsByRatio(datasets, saveGroupSize);
    enabledDatasets = combineDatasetsByRatio(enabledDatasets, saveGroupSize);
    dataview.datasets = datasets;
  }

  dataview.dateToItemsRelation = dateToItemsRelation(datasets);
  dataview.dateToItemsRelationPresented = dateToItemsRelation(enabledDatasets);
  dataview.datasetStacks = createStackModel(this, datasets, dataview.dateToItemsRelation);
  dataview.datasetStacksPresented = createStackModel(this, enabledDatasets, dataview.dateToItemsRelationPresented);

  dataview.max = d3.max(dataview.datasetStacksPresented, function (stack) {
    return d3.max(stack, function (series) {
      return d3.max(series.map(item => item['1']));
    });
  });

  dataview.dates = extractDatesFromDatasets(enabledDatasets);
  dataview.enabledStacks = this.enabledStacks();

  this.setCached(dataview, 'date');

  return dataview;
};

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

  newDataset.dataset = dataset.label;
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

  let cachedDataView = this.getCached('plot');
  if (cachedDataView) {
    return cachedDataView;
  }

  this.dateAccess;
  let enabledDatasets = this.enabledDatasets();
  let dataview = {datasets: []};

  dataview.dates = extractDatesFromDatasets(enabledDatasets).sort();
  dataview.labels = extractLabelsFromDatasets(enabledDatasets);

  enabledDatasets.forEach(function (dataset) {
    let newDataset = createPlotDataset(dataset);
    let firstIndex = dataview.dates.indexOf(newDataset.firstDate);
    let lastIndex = dataview.dates.indexOf(newDataset.lastDate);
    newDataset.duration = lastIndex - firstIndex;
    dataview.datasets.push(newDataset);
  });

  dataview.labelsCount = dataview.datasets.length;
  dataview.max = d3LibraryAccess.max(dataview.datasets, function (dataset) {
    return d3LibraryAccess.max(dataset.data, function (item) {
      return item.value;
    });
  });

  this.setCached(dataview, 'plot');

  return dataview;
};

/**
 * Returns a new generated location dataview for the current selected datasets.controller of datasets of this controller.
 *
 * A location dataview has the following form:
 * ```
 * {
 *   stacks: [String],
 *   items: [
 *     {
 *       dataset: String,
 *       stack: String,
 *       location: Any,
 *       value: Number
 *     }
 *   ]
 * }
 * ```
 */
DatasetsController.prototype.getLocationDataview = function () {

  let cachedDataView = this.getCached('location');
  if (cachedDataView) {
    return cachedDataView;
  }

  let dataview = {};
  let flatData = this.enabledFlatData();
  let combinedByStack = combineByStacks(flatData);
  let combinedByLocation = combineByLocation(combinedByStack);

  dataview.stacks = this.stacks;
  dataview.combinedData = combinedByLocation;

  dataview.combinedData.forEach(item => {
    item.stack = item.stack || item.label || item.dataset;
  });

  this.setCached(dataview, 'location');

  return dataview;
};

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

      // start down left, counterclockwise
      let coordinates = [];
      coordinates.push([lat + latSpan, lng + lngSpan]);
      coordinates.push([lat + latSpan, lng]);
      coordinates.push([lat, lng]);
      coordinates.push([lat, lng + lngSpan]);
      coordinates.push([lat + latSpan, lng + lngSpan]);

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

  let geoJSON = {
    type: "FeatureCollection",
    features: features
  };

  return geoJSON;
}

/**
 * Returns a new created instance of Feature combining the given Features.
 * @param geoJSON
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

exports.Color = Color;
exports.DatasetsController = DatasetsController;
exports.GeoJson = GeoJson;
exports.Feature = Feature;
exports.joinFeatures = joinFeatures;
exports.renderCSV = renderCSV;
exports.renderCSVDate = renderCSVDate;
exports.parseCSV = parseCSV;
exports.parseCSVDate = parseCSVDate;
exports.createGeoJSON = createGeoJSON;
exports.flatDatasets = flatDatasets;
exports.flatDataset = flatDataset;
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
exports.createDatasets = createDatasets;
exports.equals = equals;
exports.objectsEqual = objectsEqual;
exports.copy = copy;
exports.appendExtensionIfNeeded = appendExtensionIfNeeded;
exports.validateDataset = validateDataset;
exports.validateDatasets = validateDatasets;
exports.validateDataItem = validateDataItem;
exports.isValue = isValue;

exports.DefaultDateAccess = DefaultDateAccess;
exports.FormattedDateAccess = FormattedDateAccess;
exports.GermanDateAccess = DateGermanAssessor;
exports.DateWeekAssessor = DateWeekAssessor;

var exports$1 = exports;

exports.default = exports$1;

})));
//# sourceMappingURL=lotivis.tests.js.map
