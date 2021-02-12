import {Page} from "./page";
import {Language} from "../language/language";
import {MapChartCard} from "../map-chart/map-chart-card";
import {URLParameters} from "../shared/url-parameters";

/**
 *
 * @class DiatopicDataPage
 * @extends Page
 */
export class DiatopicDataPage extends Page {

    constructor(application) {
        let title = Language.translate('Diatopic Data');
        super(application, title);
        this.buildSubpage();
        this.applyURLParameters();
        this.loadCorpusIfNeeded();
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

    didLoadCorpus() {
        super.didLoadCorpus();

        let mapChart = this.mapChartCard.mapChart;
        let corpus = this.application.corpus;
        let departmentData = corpus.getDepartementsData();
        let data = [];
        departmentData.forEach(function (departmentData) {
            data.push({
                departmentName: departmentData.departmentName,
                dlabel: departmentData.departmentNumber,
                value: departmentData.value,
            })
        })

        let dataset = {
            dlabel: 'Total Lyrics',
            stack: 'Total Lyrics',
            data: data
        }

        mapChart.setDatasets([dataset]);
    }

    applyURLParameters() {
        let parameters = URLParameters.getInstance();
        let showLabels = parameters.getBoolean('map-show-labels', true);
        this.mapChartCard.mapChart.isShowLabels = showLabels;
        this.mapChartCard.mapChart.update();
    }
}
