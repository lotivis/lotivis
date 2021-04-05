import {Card} from "../components/card";
import {UrlParameters} from "../shared/url.parameters";
import {RadioGroup} from "../components/radio.group";
import {Option} from "../components/option";
import {ChartCard} from "../components/chart.card";
import {PlotChart} from "./plot.chart";
import {PlotChartSettingsPopup} from "./plot.chart.settings.popup";
import {downloadImage} from "../shared/download";
import {createDownloadFilename} from "../shared/filname";

/**
 * A card containing a plot chart.
 * @class PlotChartCard
 * @extends Card
 */
export class PlotChartCard extends ChartCard {

  /**
   * Creates a new instance of PlotChartCard.
   * @param selector The selector
   * @param config
   */
  constructor(selector, config) {
    let theSelector = selector || 'plot-chart-card';
    super(theSelector, config);
    this.injectRadioGroup();
    this.applyURLParameters();
    this.setTitle('Plot');
  }

  /**
   * Injects the plot chart in the body of the card.
   */
  injectChart() {
    this.chartID = this.selector + '-chart';
    this.body.attr('id', this.chartID);
    this.chart = new PlotChart(this.chartID, this.config);
  }

  /**
   * Injects the radio group in the top.
   */
  injectRadioGroup() {
    this.radioGroup = new RadioGroup(this.headerCenterComponent);
    this.radioGroup.onChange = function (value) {
      let dataset = this.datasets.find(dataset => dataset.label === value);
      this.setDataset(dataset);
    }.bind(this);
  }

  /**
   * Updates the button in the radio group.
   */
  updateRadioGroup() {
    if (!this.datasets) return;
    let names = this.datasets.map(dataset => dataset.label);
    let options = names.map(name => new Option(name));
    this.radioGroup.setOptions(options);
  }

  /**
   * Applies possible url parameters.
   */
  applyURLParameters() {
    let instance = UrlParameters.getInstance();
    this.chart.type = instance.getString(UrlParameters.chartType, 'bar');
    this.chart.isShowLabels = instance.getBoolean(UrlParameters.chartShowLabels, false);
    this.chart.isCombineStacks = instance.getBoolean(UrlParameters.chartCombineStacks, false);
  }

  /**
   * Presents the settings popup.
   */
  presentSettingsPopupAction() {
    let bodyElement = d3.select('body');
    let button = document.getElementById(this.moreButton.selector);
    let settingsPopup = new PlotChartSettingsPopup(bodyElement);
    settingsPopup.chart = this.chart;
    settingsPopup.showUnder(button, 'right');
  }

  /**
   * Creates and downloads a screenshot from the chart.
   * @override
   */
  screenshotButtonAction() {
    let filename = this.chart.datasetController.getFilename();
    let downloadFilename = createDownloadFilename(filename, `plot-chart`);
    downloadImage(this.chart.svgSelector, downloadFilename);
  }
}
