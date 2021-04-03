import {MapChart} from "./map.chart";
import {MapChartSettingsPopup} from "./map.chart.settings.popup";
import {ChartCard} from "../components/chart.card";
import {downloadImage} from "../shared/download";

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
   * @param config The config of the map chart.
   */
  constructor(parent, config) {
    super(parent);
    this.config = config;
    this.setHeaderText(config.name || 'Map');
  }

  /**
   * Creates and injects the map chart.
   */
  injectChart() {
    this.chart = new MapChart(this.body, this.config);
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
