import {Page} from './page';
import {DiachronicChartCard} from "../diachronic-chart/diachronic-chart-card";
import {RadioGroup} from "../components/radio-group";
import {Language} from "../language/language";
import {URLParameters} from "../shared/url-parameters";

/**
 * An application page which presents information about the diachronic data of the corpus.
 *
 * @class DiachronicAboutPage
 * @extends Page
 */
export class DiachronicAboutPage extends Page {

    /**
     * Creates a new instance.
     *
     * @param application The main application.
     */
    constructor(application) {
        super(application, Language.translate('Diachronic About'));
        this.contentType = 'tracks';
        this.buildSubpage();
        this.renderDiachronicChart();
        this.renderContentRadioGroup();
        this.applyURLParameters();
        this.loadCorpusIfNeeded();
    }

    /**
     * Appends a chart wrapper and a chart cart containing the chart to the main row.
     */
    renderDiachronicChart() {
        this.chartWrapper = this
            .addContainer(this.row, 'col-12')
            .append('div');

        this.chartCard = new DiachronicChartCard(this.chartWrapper, 'Chart');
        this.chart = this.chartCard.chart;
        this.chartCard.chart.margin = {
            top: 60, left: 50, bottom: 70, right: 50
        };
    }

    /**
     * Appends a radio group to specify the presentet content type.
     */
    renderContentRadioGroup() {
        this.radioGroup = new RadioGroup(this.chartCard.headerCenterComponent);
        this.radioGroup.setOptions([
            ['tracks', Language.translate('Tracks')],
            ['words', Language.translate('Words')],
            ['words-relative', Language.translate('Words (Relative)')],
            ['types', Language.translate('Types')],
            ['types-relative', Language.translate('Types (Relative)')],
        ]);

        this.radioGroup.onChange = function (value) {
            this.contentType = value;
            this.update();
        }.bind(this);
    }

    // MARK: - Override Page

    willLoadCorpus() {
        super.willLoadCorpus();
        this.showLoadingView();
    }

    didLoadCorpus() {
        super.didLoadCorpus();
        this.hideLoadingView();
        this.update();
    }

    applyURLParameters() {
        this.contentType = URLParameters.getInstance().getString(
            URLParameters.contentType, 'tracks');
        this.radioGroup.setSelectedOption(this.contentType);
    }

    // MARK: - Funtions

    update() {
        let corpus = this.application.corpus;
        if (!corpus) return;
        this.setCorpus(corpus);
    }

    contentTypeDidChange() {

    }

    setCorpus(corpus) {
        let yearCollection;
        switch (this.contentType) {
            case 'tracks':
                yearCollection = corpus.getLyricsPerYear();
                break;
            case 'words':
                yearCollection = corpus.getWordsPerYear();
                break;
            case 'words-relative':
                yearCollection = corpus.getWordsPerYearRelative();
                break;
            case 'types':
                yearCollection = corpus.getTypesPerYear();
                break;
            case 'types-relative':
                yearCollection = corpus.getTypesPerYearRelative();
                break;
            case 'non-standard':
                yearCollection = corpus.getTotalNonStandardPerYearCount();
                break;
            default:
                yearCollection = [];
                break;
        }

        URLParameters.getInstance().set(URLParameters.contentType, this.contentType);

        let title = this.contentType.capitalize();
        let dataset = {
            label: title,
            stack: title,
            data: []
        };

        let firstYear = d3.min(Object.keys(yearCollection));
        let lastYear = d3.max(Object.keys(yearCollection));

        for (let year = firstYear; year <= lastYear; year++) {
            dataset.data.push({
                year: year,
                value: yearCollection[year] || 0,
                yearTotal: yearCollection[year] || 0
            });
        }

        this.chart.datasets = [dataset];
        this.chart.update();
    }
}

// MARK: - Extension of String

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
