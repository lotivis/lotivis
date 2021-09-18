import {Color} from "./js/shared.color/color";
import './js/shared.color/color.defaults';
import './js/shared.color/color.map';
import './js/shared.color/color.plot';
import './js/shared.color/color.random';
import './js/shared.color/color.stacks';
import {Button} from "./js/shared.components/button";
import {Component} from "./js/shared.components/component";
import {RadioGroup} from "./js/shared.components/radio.group";
import {Toast} from "./js/shared.components/toast";
import {Option} from "./js/shared.components/option";
import "./js/chart/chart.datasets";
import {Card} from "./js/shared.components/card";
import {Checkbox} from "./js/shared.components/checkbox";
import {ModalPopup} from "./js/shared.components/modal.popup";
import {Dropdown} from "./js/shared.components/dropdown";
import {Popup} from "./js/shared.components/popup";

import {UpdatableDataviewCard} from "./js/dataview.card/updatable.dataview.card";
import {EditableDataviewCard} from "./js/dataview.card/editable.dataview.card";
import {DatasetsJSONCard} from "./js/dataview.card/data.json.card";
import {DatasetCSVCard} from "./js/dataview.card/data.csv.card";
import {DatasetCSVDateCard} from "./js/dataview.card/data.csv.date.card";
import {DataviewDatasetsControllerCard} from "./js/dataview.card/dataview.datasets.controller.card";
import {DataviewDatasetsControllerSelectionCard} from "./js/dataview.card/dataview.datasets.controller.selection.card";
import {
  DataviewCard,
  DataviewDateCard,
  DataviewFlatCard,
  DataViewMapCard,
  DataViewPlotCard
} from "./js/dataview.card/dataview.card";

import {TimeChart} from "./js/time.chart/time.chart";
import {DateChartCard} from "./js/time.chart.card/date.chart.card";
import {MapChart} from "./js/location.chart/map.chart";
import {MapChartCard} from "./js/location.chart/map.chart.card";
import {TimePlotChart} from "./js/time.plot.chart/time.plot.chart";
import {TimePlotChartCard} from "./js/time.plot.chart.card/time.plot.chart.card";

import {DatasetsController} from "./js/datasets.controller/datasets.controller";
import "./js/datasets.controller/datasets.controller.listeners";
import "./js/datasets.controller/datasets.controller.filter";
import "./js/datasets.controller/datasets.controller.data";
import "./js/datasets.controller/datasets.controller.selection";
import "./js/datasets.controller/datasets.controller.notification.reason";

import {parseCSV} from "./js/data.parse/parse.csv";
import {parseCSVDate} from "./js/data.parse/parse.csv.date";

import "./js/dataview/dataview.date";
import "./js/dataview/dataview.date.combined.stacks";
import "./js/dataview/dataview.plot";
import "./js/dataview/dataview.location";


import {LotivisConfig} from "./js/shared/config";
import {debug} from "./js/shared/debug";

import {
  FormattedDateAccess,
  DateGermanAssessor,
  DefaultDateAccess,
  DateWeekAssessor
} from "./js/data.date.assessor/date.assessor";
import {UrlParameters} from "./js/shared/url.parameters";
import {createID} from "./js/shared/selector";

exports.createID = createID;

// colors
exports.Color = Color;

// shared.components
exports.Button = Button;
exports.Card = Card;
exports.Checkbox = Checkbox;
exports.Component = Component;
exports.Dropdown = Dropdown;
exports.ModalPopup = ModalPopup;
exports.Popup = Popup;
exports.RadioGroup = RadioGroup;
exports.Option = Option;
exports.Toast = Toast;

// datasets / csv cards
exports.DatasetsJSONCard = DatasetsJSONCard;
exports.DatasetCSVCard = DatasetCSVCard;
exports.DatasetCSVDateCard = DatasetCSVDateCard;
exports.DataviewCard = DataviewCard;
exports.DataviewDateCard = DataviewDateCard;
exports.DataviewPlotCard = DataViewPlotCard;
exports.DataviewMapCard = DataViewMapCard;
exports.DataviewFlatCard = DataviewFlatCard;
exports.DataviewDatasetsControllerCard = DataviewDatasetsControllerCard;
exports.DataviewDatasetsControllerSelectionCard = DataviewDatasetsControllerSelectionCard;
exports.UpdatableDataviewCard = UpdatableDataviewCard;
exports.EditableDataviewCard = EditableDataviewCard;

// time.chart
exports.DateChart = TimeChart;
exports.DateChartCard = DateChartCard;

// location.chart
exports.MapChart = MapChart;
exports.MapChartCard = MapChartCard;

// time.chart.plot.chart
exports.PlotChart = TimePlotChart;
exports.PlotChartCard = TimePlotChartCard;

// datasets
exports.DatasetController = DatasetsController;

// parse
exports.parseCSV = parseCSV;
exports.parseCSVDate = parseCSVDate;

// constants
exports.config = LotivisConfig;
exports.debug = debug;

// time.chart assessors
exports.DefaultDateAccess = DefaultDateAccess;
exports.FormattedDateAccess = FormattedDateAccess;
exports.GermanDateAccess = DateGermanAssessor;
exports.DateWeekAssessor = DateWeekAssessor;

// url parameters
exports.URLParameters = UrlParameters;
exports.version = '1.0.90';
exports.versionShort = '1';

export default exports;

console.log(`[lotivis]  lotivis module loaded.`);
