import {MapChart} from "./map.chart";
import {MapChartSettingsPopup} from "./map.chart.settings.popup";
import {ChartCard} from "../components/chart.card";
import {downloadImage} from "../shared/download";
import {createDownloadFilename} from "../shared/filname";

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
    let theSelector = parent || 'map-chart-card';
    super(theSelector);
    this.config = config;
    this.setCardTitle('Map');
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
    let filename = this.chart.datasetController.getFilename();
    let downloadFilename = createDownloadFilename(filename, `map-chart`);
    downloadImage(this.chart.svgSelector, downloadFilename);
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
