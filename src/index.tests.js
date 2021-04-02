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
import "./js/data/datasets.controller.update";
import "./js/dataview/dataviews.date";
import "./js/dataview/dataviews.plot";
import "./js/dataview/dataviews.map";
import {renderCSV} from "./js/data.render/render.csv";
import {fetchCSV} from "./js/data.parse/fetch.csv";
import {createGeoJSON} from "./js/geojson.juggle/create.geojson";
import {joinFeatures} from "./js/geojson.juggle/join.features";
import {Constants} from "./js/shared/constants";
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

export default exports;