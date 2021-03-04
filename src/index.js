import {Component} from "./js/components/component";
import {TimeChart} from "./js/time/time-chart";
import {TimeChartCard} from "./js/time/time-chart-card";
import {MapChart} from "./js/map/map-chart";
import {MapChartCard} from "./js/map/map-chart-card";
import {PlotChart} from "./js/plot/plot-chart";
import {PlotChartCard} from "./js/plot/plot-chart-card";
import {GeoJson} from "./js/geojson/geojson";
import {RadioGroup} from "./js/components/radio-group";
import {Option} from "./js/components/option";
import {
  flatDataset,
  flatDatasets
} from "./js/data-juggle/dataset-flat";
import {
  combine,
  combineByDate,
  combineByLocation,
  combineByStacks
} from "./js/data-juggle/dataset-combine";
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
} from "./js/data-juggle/dataset-extract";
import {
  sumOfDataset,
  sumOfStack
} from "./js/data-juggle/dataset-sum";
import {
  dateToItemsRelation
} from "./js/data-juggle/dataset-relations";
import {URLParameters} from "./js/shared/url-parameters";
import {DatasetController} from "./js/data/dataset-controller";
import {FilterableDatasetController} from "./js/data/filterable-dataset-controller";
import {renderCSV} from "./js/parse/render-csv";
import {parseCSV} from "./js/parse/parse-csv";
import {createGeoJSON} from "./js/geojson/create-geojson";


exports.Component = Component;
exports.GeoJson = GeoJson;
exports.RadioGroup = RadioGroup;
exports.Option = Option;

exports.TimeChart = TimeChart;
exports.TimeChartCard = TimeChartCard;

exports.MapChart = MapChart;
exports.MapChartCard = MapChartCard;

exports.PlotChart = PlotChart;
exports.PlotChartCard = PlotChartCard;

exports.DatasetController = DatasetController;
exports.FilterableDatasetController = FilterableDatasetController;

exports.URLParameters = URLParameters;

exports.renderCSV = renderCSV;
exports.parseCSV = parseCSV;

exports.createGeoJSON = createGeoJSON;

// data juggling
exports.flatDataset = flatDataset;
exports.flatDatasets = flatDatasets;
exports.combine = combine;
exports.combineByStacks = combineByStacks;
exports.combineByDate = combineByDate;
exports.combineByLocation = combineByLocation;
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

export default exports;
