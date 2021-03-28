import {Component} from "./js/components/component";
import {DateChart} from "./js/date/date.chart";
import {DateChartCard} from "./js/date/date.chart.card";
import {MapChart} from "./js/map/map.chart";
import {MapChartCard} from "./js/map/map.chart.card";
import {PlotChart} from "./js/plot/plot.chart";
import {PlotChartCard} from "./js/plot/plot.chart.card";
import {GeoJson} from "./js/geojson/geojson";
import {Feature} from "./js/geojson/feature";
import {RadioGroup} from "./js/components/radio.group";
import {Option} from "./js/components/option";
import {
  flatDataset,
  flatDatasets
} from "./js/data-juggle/dataset.flat";
import {
  combine,
  combineByDate,
  combineByLocation,
  combineByStacks
} from "./js/data-juggle/dataset.combine";
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
} from "./js/data-juggle/dataset.extract";
import {
  sumOfDataset,
  sumOfStack
} from "./js/data-juggle/dataset.sum";
import {
  dateToItemsRelation
} from "./js/data-juggle/dataset.relations";
import {UrlParameters} from "./js/shared/url.parameters";
import {DatasetsController} from "./js/data/datasets.controller";
import "./js/data/datasets.controller.listeners";
import "./js/data/datasets.controller.filter";
import "./js/data/datasets.controller.dataviews.date";
import "./js/data/datasets.controller.dataviews.plot";
import {renderCsv} from "./js/parse/render.csv";
import {parseCsv} from "./js/parse/parse.csv";
import {createGeoJSON} from "./js/geojson-juggle/create.geojson";
import {Card} from "./js/components/card";
import {Checkbox} from "./js/components/checkbox";
import {ModalPopup} from "./js/components/modal.popup";
import {ChartCard} from "./js/components/chart.card";
import {Dropdown} from "./js/components/dropdown";
import {Popup} from "./js/components/popup";
import {joinFeatures} from "./js/geojson-juggle/join.features";
import {Constants} from "./js/shared/constants";
import {
  combineDatasetsByRatio,
  combineDataByGroupsize
} from "./js/data-juggle/dataset.combine.ratio";

import {Color} from "./js/shared/color";
import './js/shared/color.defaults';
import './js/shared/color.map';
import './js/shared/color.plot';
import './js/shared/color.random';
import './js/shared/color.stack';

exports.Color = Color;

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
exports.DateChart = DateChart;
exports.DateChartCard = DateChartCard;

// map
exports.MapChart = MapChart;
exports.MapChartCard = MapChartCard;

// plot
exports.PlotChart = PlotChart;
exports.PlotChartCard = PlotChartCard;

// datasets
exports.DatasetController = DatasetsController;

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

export default exports;
