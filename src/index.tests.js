import {Color} from "./js/color/color";
import './js/color/color.defaults';
import './js/color/color.map';
import './js/color/color.plot';
import './js/color/color.random';
import './js/color/color.stacks';
import {GeoJson} from "./js/geojson/geojson";
import {Feature} from "./js/geojson/feature";
import {
  flatDataset,
  flatDatasets
} from "./js/data.juggle/dataset.flat";
import {
  combine,
  combineByDate,
  combineByLocation,
  combineByStacks
} from "./js/data.juggle/dataset.combine";
import {
  extractDatesFromDatasets,
  extractDatesFromFlatData,
  extractEarliestDate,
  extractEarliestDateWithValue,
  extractLabelsFromDatasets,
  extractLabelsFromFlatData,
  extractLatestDate,
  extractLatestDateWithValue,
  extractLocationsFromDatasets,
  extractLocationsFromFlatData,
  extractStacksFromDatasets,
  extractStacksFromFlatData
} from "./js/data.juggle/dataset.extract";
import {
  sumOfDataset,
  sumOfStack
} from "./js/data.juggle/dataset.sum";
import {
  dateToItemsRelation
} from "./js/data.juggle/dataset.relations";
import {DatasetsController} from "./js/data/datasets.controller";
import "./js/data/datasets.controller.listeners";
import "./js/data/datasets.controller.filter";
import "./js/data/datasets.controller.colors";
import "./js/data/datasets.controller.update";
import "./js/dataview/dataview.date";
import "./js/dataview/dataview.plot";
import "./js/dataview/dataview.map";
import {renderCSV} from "./js/data.render/render.csv";
import {fetchCSV} from "./js/data.parse/fetch.csv";
import {createGeoJSON} from "./js/geojson.juggle/create.geojson";
import {joinFeatures} from "./js/geojson.juggle/join.features";
import {
  combineDatasetsByRatio,
  combineDataByGroupsize
} from "./js/data.juggle/dataset.combine.ratio";
import './js/color/color.defaults';
import './js/color/color.map';
import './js/color/color.plot';
import './js/color/color.random';
import {parseCSV} from "./js/data.parse/parse.csv";
import {parseCSVDate} from "./js/data.parse/parse.csv.date";
import {equals, objectsEqual} from "./js/shared/equal";
import {renderCSVDate} from "./js/data.render/render.csv.date";
import {createDatasets} from "./js/data.juggle/dataset.create";
import {copy} from "./js/shared/copy";
import {appendExtensionIfNeeded} from "./js/shared/filname";
import {DateAccessWeek} from "./js/data.dateaccess/dateaccess.week";
import {d3LibraryAccess} from "./js/shared/d3libaccess";
import {FormattedDateAccess, GermanDateAccess} from "./js/data.dateaccess/dateaccess";

const d3 = require('d3');

exports.Color = Color;
exports.DatasetController = DatasetsController;
exports.GeoJson = GeoJson;
exports.Feature = Feature;
exports.joinFeatures = joinFeatures;
exports.renderCSV = renderCSV;
exports.renderCSVDate = renderCSVDate;
exports.fetchCSV = fetchCSV;
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

exports.FormattedDateAccess = FormattedDateAccess;
exports.DateAccessWeek = DateAccessWeek;
exports.GermanDateAccess = GermanDateAccess;
export default exports;
