import {Color} from "./js/color/color";
import './js/color/color.defaults';
import './js/color/color.map';
import './js/color/color.plot';
import './js/color/color.random';
import './js/color/color.stacks';
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
import {UrlParameters} from "./js/shared/url.parameters";
import {DatasetsController} from "./js/data/datasets.controller";
import "./js/data/datasets.controller.listeners";
import "./js/data/datasets.controller.filter";
import "./js/data/datasets.controller.update";
import "./js/dataview/dataviews.date";
import "./js/dataview/dataviews.plot";
import "./js/dataview/dataviews.map";
import {Card} from "./js/components/card";
import {Checkbox} from "./js/components/checkbox";
import {ModalPopup} from "./js/components/modal.popup";
import {ChartCard} from "./js/components/chart.card";
import {Dropdown} from "./js/components/dropdown";
import {Popup} from "./js/components/popup";
import {Constants} from "./js/shared/constants";

import {DatasetJsonCard} from "./js/data.card/dataset.json.card";
import {DatasetCSVCard} from "./js/data.card/dataset.csv.card";
import {DatasetCSVDateCard} from "./js/data.card/dataset.csv.date.card";

// colors
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

// datasets / csv cards
exports.DatasetJsonCard = DatasetJsonCard;
exports.DatasetCSVCard = DatasetCSVCard;
exports.DatasetCSVDateCard = DatasetCSVDateCard;

// datasets
exports.DatasetController = DatasetsController;

// url parameters
exports.URLParameters = UrlParameters;

// geo json
exports.GeoJson = GeoJson;
exports.Feature = Feature;

// constants
exports.Constants = Constants;

export default exports;
