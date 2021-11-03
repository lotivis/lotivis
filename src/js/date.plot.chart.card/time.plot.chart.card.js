import {Card} from "../shared.components/card";
import {UrlParameters} from "../shared/url.parameters";
import {ChartCard} from "../shared.components/chart.card";
import {TimePlotChart} from "../date.plot.chart/time.plot.chart";
import {TimePlotChartCardSettingsPopup} from "./time.plot.chart.card.settings.popup";
import {downloadImage} from "../shared/download";
import {createDownloadFilename} from "../shared/filename";

/**
 * A card containing a date.chart.plot.chart chart.
 * @class TimePlotChartCard
 * @extends Card
 */
export class TimePlotChartCard extends ChartCard {

  /**
   * Creates a new instance of TimePlotChartCard.
   * @param selector The selector
   * @param config
   */
  constructor(selector, config) {
    let theSelector = selector || 'time-plot-chart-card';
    super(theSelector, config);
    this.injectRadioGroup();
    this.applyURLParameters();
    // this.setTitle('Plot');
  }

  /**
   * Injects the time plot chart in the body of the card.
   */
  injectChart() {
    this.chartID = this.selector + '-chart';
    this.body.attr('id', this.chartID);
    this.chart = new TimePlotChart(this.chartID, this.config);
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
    let settingsPopup = new TimePlotChartCardSettingsPopup(bodyElement);
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
