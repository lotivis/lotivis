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
} from "./js/data.juggle/data.flat";
import {
  combine,
  combineByDate,
  combineByLocation,
  combineByStacks
} from "./js/data.juggle/data.combine";
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
} from "./js/data.juggle/data.extract";
import {
  sumOfDataset,
  sumOfStack
} from "./js/data.juggle/data.sum";
import {
  dateToItemsRelation
} from "./js/data.juggle/data.relations";
import {DatasetsController} from "./js/datasets.controller/datasets.controller";
import "./js/datasets.controller/datasets.controller.listeners";
import "./js/datasets.controller/datasets.controller.filter";
import "./js/datasets.controller/datasets.controller.colors";
import "./js/datasets.controller/datasets.controller.data";
import "./js/datasets.controller/datasets.controller.selection";
import "./js/datasets.controller/datasets.controller.notification.reason";
import "./js/dataview/dataview.date";
import "./js/dataview/dataview.plot";
import "./js/dataview/dataview.location";
import {renderCSV} from "./js/data.render/render.csv";
import {createGeoJSON} from "./js/geojson/create.geojson";
import {joinFeatures} from "./js/geojson/join.features";
import {
  combineDatasetsByRatio,
  combineDataByGroupsize
} from "./js/data.juggle/data.combine.ratio";
import './js/color/color.defaults';
import './js/color/color.map';
import './js/color/color.plot';
import './js/color/color.random';
import {parseCSV} from "./js/data.parse/parse.csv";
import {parseCSVDate} from "./js/data.parse/parse.csv.date";
import {equals, objectsEqual} from "./js/shared/equal";
import {renderCSVDate} from "./js/data.render/render.csv.date";
import {createDatasets} from "./js/data.juggle/data.create.datasets";
import {copy} from "./js/shared/copy";
import {appendExtensionIfNeeded} from "./js/shared/filename";
import {
  FormattedDateAccess,
  DateGermanAssessor,
  DefaultDateAccess,
  DateWeekAssessor
} from "./js/data.date.assessor/date.assessor";
import {validateDataItem, validateDataset, validateDatasets} from "./js/data.juggle/data.validate";
import {isValue} from "./js/shared/value";

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

export default exports;
