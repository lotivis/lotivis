import {Page} from "./page";
import {Language} from "../language/language";
import {MapChartCard} from "../map-chart/map-chart-card";
import {URLParameters} from "../shared/url-parameters";

/**
 *
 * @class LocationDataPage
 * @extends Page
 */
export class LocationDataPage extends Page {

  constructor(application) {
    let title = Language.translate('Location Data');
    super(application, title);

    this.buildSubpage();
    this.applyURLParameters();
    this.loadGeoJSONFromDelegate();
    this.didLoadGeoJSONFromDelegate();
  }

  renderBody() {
    super.renderBody();
    this.mapChartContainer = this.row.append('div').classed('col-12', true);
    this.mapChartCard = new MapChartCard(this.mapChartContainer);
    this.mapChartCard.titleLabel.text(Language.translate('Map'));
    this.mapChartCard.mapChart.isDrawsBackground = false;
    this.mapChartCard.mapChart.isShowLabels = true;
    this.mapChartCard.mapChart.isZoomable = false;
  }

  applyURLParameters() {
    let parameters = URLParameters.getInstance();
    let showLabels = parameters.getBoolean('map-show-labels', true);
    this.mapChartCard.mapChart.isShowLabels = showLabels;
    this.mapChartCard.mapChart.update();
  }

  loadGeoJSONFromDelegate() {
    let url = this.application.delegate.geoJSON;
    this.mapChartCard.mapChart.loadGeoJSON(url);
  }

  didLoadGeoJSONFromDelegate() {
    let mapChart = this.mapChartCard.mapChart;
    let corpus = this.application.corpus;
    // let delegate = this.application.delegate;
    // let departmentData = corpus.getDepartementsData();
    // let data = [];
    //
    // departmentData.forEach(function (departmentData) {
    //   data.push({
    //     departmentName: departmentData.departmentName,
    //     dlabel: departmentData.departmentNumber,
    //     value: departmentData.value,
    //   });
    // });
    //
    // let dataset = {
    //   dlabel: 'Total Lyrics',
    //   stack: 'Total Lyrics',
    //   data: data
    // };
    //
    // mapChart.setDatasets([dataset]);
  }
}
