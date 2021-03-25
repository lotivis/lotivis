import {MapChart} from "./map.chart";
import {MapChartSettingsPopup} from "./map.chart.settings.popup";
import {ChartCard} from "../components/chart.card";
import {downloadImage} from "../shared/screenshot";

/**
 *
 * @class MapChartCard
 * @extends ChartCard
 */
export class MapChartCard extends ChartCard {

  /**
   * Creates a new instance of MapChartCard.
   *
   * @param parent The parental component.
   */
  constructor(parent) {
    super(parent);
  }

  /**
   * Creates and injects the map chart.
   */
  injectMapChart() {
    this.chart = new MapChart(this.body);
  }

  /**
   * Creates and downloads a screenshot from the chart.
   * @override
   */
  screenshotButtonAction() {
    let labels = ['unknown'];
    if (this.chart.datasetController) {
      labels = this.chart.datasetController.labels;
    }
    let name = labels.join(',') + '-map-chart';
    downloadImage(this.chart.svgSelector, name);
  }

  /**
   * Triggered when the more button is pushed.
   */
  presentSettingsPopupAction() {
    let bodyElement = d3.select('body');
    let button = document.getElementById(this.moreButton.selector);
    let settingsPopup = new MapChartSettingsPopup(bodyElement);
    settingsPopup.mapChart = this.chart;
    settingsPopup.showUnder(button, 'right');
  }
}
