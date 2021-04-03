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
import {RadioGroup} from "./js/components/radio.group";
import {Option} from "./js/components/option";
import {UrlParameters} from "./js/shared/url.parameters";
import {DatasetsController} from "./js/data/datasets.controller";
import "./js/data/datasets.controller.listeners";
import "./js/data/datasets.controller.filter";
import "./js/data/datasets.controller.update";
import "./js/dataview/dataview.date";
import "./js/dataview/dataview.date.combined.stacks";
import "./js/dataview/dataview.plot";
import "./js/dataview/dataview.map";
import {Chart} from "./js/components/chart";
import "./js/components/chart.datasets";
import {Card} from "./js/components/card";
import {Checkbox} from "./js/components/checkbox";
import {ModalPopup} from "./js/components/modal.popup";
import {ChartCard} from "./js/components/chart.card";
import {Dropdown} from "./js/components/dropdown";
import {Popup} from "./js/components/popup";

import {DataCard} from "./js/data.card/data.card";
import {DatasetJSONCard} from "./js/data.card/data.json.card";
import {DatasetCSVCard} from "./js/data.card/data.csv.card";
import {DatasetCSVDateCard} from "./js/data.card/data.csv.date.card";
import {GlobalConfig} from "./js/shared/config";
import {debug} from "./js/shared/debug";
import {parseCSV} from "./js/data.parse/parse.csv";
import {parseCSVDate} from "./js/data.parse/parse.csv.date";
import {DateAccessWeek} from "./js/data.date.assessor/date.assessor.weekday";
import {FormattedDateAccess, GermanDateAccess} from "./js/data.date.assessor/date.assessor";
import {
  DataViewCard, DataViewDatasetsControllerCard,
  DataViewDateCard,
  DataViewFlatCard,
  DataViewMapCard,
  DataViewPlotCard
} from "./js/data.card/data.view.card";

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

exports.FormattedDateAccess = FormattedDateAccess;
exports.DateAccessWeek = DateAccessWeek;
exports.GermanDateAccess = GermanDateAccess;

export default exports;
