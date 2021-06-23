import {Color} from "./js/color/color";
import './js/color/color.defaults';
import './js/color/color.map';
import './js/color/color.plot';
import './js/color/color.random';
import './js/color/color.stacks';
import {Button} from "./js/components/button";
import {Component} from "./js/components/component";
import {RadioGroup} from "./js/components/radio.group";
import {Toast} from "./js/components/toast";
import {Option} from "./js/components/option";
import "./js/components/chart.datasets";
import {Card} from "./js/components/card";
import {Checkbox} from "./js/components/checkbox";
import {ModalPopup} from "./js/components/modal.popup";
import {Dropdown} from "./js/components/dropdown";
import {Popup} from "./js/components/popup";

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

import {DateChart} from "./js/time/date.chart";
import {DateChartCard} from "./js/time/date.chart.card";
import {MapChart} from "./js/map/map.chart";
import {MapChartCard} from "./js/map/map.chart.card";
import {PlotChart} from "./js/plot/plot.chart";
import {PlotChartCard} from "./js/plot/plot.chart.card";

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

// components
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

// time
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

// parse
exports.parseCSV = parseCSV;
exports.parseCSVDate = parseCSVDate;

// constants
exports.config = LotivisConfig;
exports.debug = debug;

// time assessors
exports.DefaultDateAccess = DefaultDateAccess;
exports.FormattedDateAccess = FormattedDateAccess;
exports.GermanDateAccess = DateGermanAssessor;
exports.DateWeekAssessor = DateWeekAssessor;

// url parameters
exports.URLParameters = UrlParameters;

export default exports;

console.log(`[lotivis]  lotivis module loaded.`);
UrlParameters.getInstance().updateCurrentPageFooter();
