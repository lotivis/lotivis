import {Card} from "../components/card";
import {Button} from "../components/button";
import {TimeChart} from "./time-chart";
import {createUUID} from "../shared/uuid";
import {TimeChartSettingsPopup} from "./time-chart-settings-popup";
import {URLParameters} from "../shared/url-parameters";
import {screenshotElement} from "../shared/screenshot";
import {RadioGroup} from "../components/radio-group";
import {Option} from "../components/option";
import {ChartCard} from "../components/chart-card";

/**
 *
 *
 * @class TimeChartCard
 * @extends Card
 */
export class TimeChartCard extends ChartCard {

  /**
   *
   * @param selector
   * @param name
   */
  constructor(selector, name) {
    super(selector);
    if (!selector) throw 'No selector specified.';
    this.selector = selector;
    this.name = selector;
    this.datasets = [];
    this.renderChart();
    this.renderRadioGroup();
    this.applyURLParameters();
  }

  /**
   *
   */
  renderChart() {
    this.chart = new TimeChart(this.body);
    this.chart.margin.left = 50;
    this.chart.margin.right = 50;
  }

  renderRadioGroup() {
    this.radioGroup = new RadioGroup(this.headerCenterComponent);
    this.radioGroup.onChange = function (value) {
      let dataset = this.datasets.find(dataset => dataset.label === value);
      this.setDataset(dataset);
    }.bind(this);
  }

  updateRadioGroup() {
    if (!this.datasets) return;
    let names = this.datasets.map(dataset => dataset.label);
    let options = names.map(name => new Option(name));
    this.radioGroup.setOptions(options);
  }

  /**
   *
   */
  applyURLParameters() {
    this.chart.type = URLParameters.getInstance()
      .getString(URLParameters.chartType, 'bar');
    this.chart.isShowLabels = URLParameters.getInstance()
      .getBoolean(URLParameters.chartShowLabels, false);
    this.chart.isCombineStacks = URLParameters.getInstance()
      .getBoolean(URLParameters.chartCombineStacks, false);
  }


  // MARK: - Settings Popup

  /**
   *
   */
  presentSettingsPopupAction() {
    let bodyElement = d3.select('body');
    let button = document.getElementById(this.moreButton.selector);
    let settingsPopup = new TimeChartSettingsPopup(bodyElement);
    settingsPopup.diachronicChart = this.chart;
    settingsPopup.showUnder(button, 'right');
  }
}
