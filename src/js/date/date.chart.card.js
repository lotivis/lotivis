import {Card} from "../components/card";
import {DateChart} from "./date.chart";
import {DateChartSettingsPopup} from "./date.chart.settings.popup";
import {UrlParameters} from "../shared/url.parameters";
import {RadioGroup} from "../components/radio.group";
import {Option} from "../components/option";
import {ChartCard} from "../components/chart.card";
import {downloadImage} from "../shared/download";
import {createDownloadFilename} from "../shared/filname";

/**
 *
 *
 * @class DateChartCard
 * @extends Card
 */
export class DateChartCard extends ChartCard {

  /**
   *
   * @param selector
   * @param config
   */
  constructor(selector, config) {
    let theSelector = selector || 'date-chart-card';
    super(theSelector, config);
    this.selector = theSelector;
    this.name = theSelector;
    this.datasets = [];
    this.renderChart();
    this.renderRadioGroup();
    this.setCardTitle((config && config.name) ? config.name : 'Date');
    this.applyURLParameters();
  }

  /**
   *
   */
  renderChart() {
    this.chart = new DateChart(this.body, this.config || {});
    this.chartID = this.chart.selector;
  }

  /**
   *
   */
  renderRadioGroup() {
    this.radioGroup = new RadioGroup(this.headerCenterComponent);
    this.radioGroup.onChange = function (value) {
      let dataset = this.datasets.find(dataset => dataset.label === value);
      this.setDataset(dataset);
    }.bind(this);
  }

  /**
   *
   */
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
    this.chart.type = UrlParameters.getInstance()
      .getString(UrlParameters.chartType + this.chartID, 'bar');
    this.chart.config.showLabels = UrlParameters.getInstance()
      .getBoolean(UrlParameters.chartShowLabels + this.chartID, this.chart.config.showLabels);
    this.chart.config.combineStacks = UrlParameters.getInstance()
      .getBoolean(UrlParameters.chartCombineStacks + this.chartID, this.chart.config.combineStacks);
  }

  /**
   *
   */
  presentSettingsPopupAction() {
    let bodyElement = d3.select('body');
    let button = document.getElementById(this.moreButton.selector);
    let settingsPopup = new DateChartSettingsPopup(bodyElement);
    settingsPopup.diachronicChart = this.chart;
    settingsPopup.showUnder(button, 'right');
  }

  /**
   * Creates and downloads a screenshot from the chart.
   * @override
   */
  screenshotButtonAction() {
    let filename = this.chart.datasetController.getFilename();
    let downloadFilename = createDownloadFilename(filename, `date-chart`);
    downloadImage(this.chart.svgSelector, downloadFilename);
  }
}
