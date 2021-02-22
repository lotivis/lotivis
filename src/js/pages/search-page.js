import {Page} from './page';
import {Button} from "../components/button";
import {SearchPageSettingsPopup} from "./search-page-settings-popup";
import {TimeChartCard} from "../time-chart/time-chart-card";
import {SearchCard} from "./search-card";
import {RecentSearches} from "../shared/recent-searches";
import {URLParameters} from "../shared/url-parameters";
import {Language} from "../language/language";
import {randomColor} from "../shared/colors";
import {MapChartCard} from "../map-chart/map-chart-card";
import {WordAboutCard} from "./word-about-card";
import {DatasetCollection} from "../data/dataset-collection";

/**
 *
 * @class SearchPage
 * @extends Page
 */
export class SearchPage extends Page {

  /**
   *
   * @param application
   */
  constructor(application) {
    super(application, Language.translate('Search'));
    application.makeContainerFull();

    this.renderSettingsButton();

    this.renderSearchInputCard();
    this.renderDiachronicChart();
    this.renderMapChart();
    this.renderWordAboutCard();

    this.loadCorpusIfNeeded();
    this.applyURLParameters();
  }


  // MARK: - Render

  renderSettingsButton() {
    this.settingsButton = new Button(this.rightHeaderContainer);
    this.settingsButton.setText(Language.translate('Settings'));
    this.settingsButton.element.classed('simple-button button-down', true);
    let thisReference = this;
    this.settingsButton.onClick = function (event) {
      if (!event || !event.target) return;
      let settingsPopup = new SearchPageSettingsPopup(thisReference.application.element);
      settingsPopup.searchPage = thisReference;
      settingsPopup.showUnder(event.target, 'right');
    };
  }

  renderSearchInputCard() {
    this.searchCardContainer = this.addContainer(this.row, 'col-12');
    this.searchCard = new SearchCard(this.searchCardContainer);

    let thisReference = this;
    this.searchCard.startSearching = function () {
      thisReference.startSearching();
    };
  }

  renderDiachronicChart() {
    this.diachronicChartCardContainer = this.addContainer(this.row, 'col-12 col-lg-6');
    this.diachronicChartCard = new TimeChartCard(this.diachronicChartCardContainer, null);
    this.diachronicChartCard.titleLabel.text(Language.translate('Chart'));
    this.diachronicChart = this.diachronicChartCard.chart;
    this.searchCard.diachronicChart = this.diachronicChart;
    this.diachronicChart.margin = {top: 40, left: 40, bottom: 80, right: 40};
    this.diachronicChartCard.footer.style('display', 'none');
  }

  renderMapChart() {
    this.mapCardContainer = this.addContainer(this.row, 'col-12 col-lg-6');
    this.mapChartCard = new MapChartCard(this.mapCardContainer);
    this.mapChartCard.titleLabel.text(Language.translate('Map'));
  }

  renderWordAboutCard() {
    this.wordAboutCardContainer = this.addContainer(this.row, 'col-12 col-lg-6');
    this.wordAboutCard = new WordAboutCard(this.diachronicChartCardContainer);
    this.wordAboutCard.titleLabel.text(Language.translate('Word About'));
  }


  // MARK: - Override Page

  willLoadCorpus() {
    super.willLoadCorpus();
    this.loadingView = this.addLoadingView(this.row);
    this.diachronicChartCardContainer.style('display', 'none');
    this.mapCardContainer.style('display', 'none');
  }

  didLoadCorpus() {
    super.didLoadCorpus();
    this.loadingView.remove();
    this.diachronicChartCardContainer.style('display', 'block');
    this.mapCardContainer.style('display', 'block');
    // this.mapChartCard.mapChart.setCorpus(this.application.corpus);


    if (this.searchCard.getSearchText()) {
      this.startSearching();
    }
  }


  // MARK: - View Mode

  useFullWidthMode() {
    this.diachronicChartCardContainer
      .classed('col-lg-12', true)
      .classed('col-lg-6', false);
    this.mapCardContainer
      .classed('col-lg-12', true)
      .classed('col-lg-6', false);
    this.wordAboutCardContainer
      .classed('col-lg-12', true)
      .classed('col-lg-6', false);
  }

  useHalfWidthMode() {
    this.diachronicChartCardContainer
      .classed('col-lg-12', false)
      .classed('col-lg-6', true);
    this.mapCardContainer
      .classed('col-lg-12', false)
      .classed('col-lg-6', true);
    this.wordAboutCardContainer
      .classed('col-lg-12', false)
      .classed('col-lg-6', true);
  }

  setViewMode(viewMode, save = false) {
    this.viewMode = viewMode;
    switch (viewMode) {
      case 'full':
        this.useFullWidthMode();
        break;
      case 'half':
        this.useHalfWidthMode();
        break;
      default:
        break;
    }
    if (save) {
      localStorage.setItem(SearchPage.viewModeKey, viewMode);
    }
  }

  applyURLParameters() {
    let parameters = URLParameters.getInstance();
    let searchText = parameters.getString(URLParameters.query);
    let searchSensitivity = parameters.getString(URLParameters.searchSensitivity, 'case-insensitive');
    let startYear = parameters.getString(URLParameters.startYear, '2000');
    let endYear = parameters.getString(URLParameters.endYear, '2020');
    let valueType = parameters.getString(URLParameters.valueType, 'relative');

    this.searchCard.searchField.setText(searchText);
    this.searchCard.sensitivityDropdown.setSelectedOption(searchSensitivity);
    this.searchCard.yearStartDropdown.value = startYear;
    this.searchCard.yearEndDropdown.value = endYear;
    this.searchCard.valueType = valueType;
    this.searchCard.valueRadioGroup.setSelectedOption(valueType);

    let viewModeURL = URLParameters.getInstance().getString(URLParameters.searchViewMode);
    let viewModeLocalStorage = localStorage.getItem(SearchPage.viewModeKey);

    if (viewModeURL) {
      this.setViewMode(viewModeURL);
    } else if (viewModeLocalStorage) {
      this.setViewMode(viewModeLocalStorage);
    } else {
      this.setViewMode('half');
    }

    let showChart = parameters.getBoolean('show-chart', true);
    showChart ? this.showChart() : this.hideChart();
    let showMap = parameters.getBoolean('show-map', true);
    showMap ? this.showMap() : this.hideMap();
  }

  showChart() {
    this.diachronicChartCard.element.style('display', 'block');
  }

  hideChart() {
    this.diachronicChartCard.element.style('display', 'none');
  }

  showMap() {
    this.mapChartCard.element.style('display', 'block');
  }

  hideMap() {
    this.mapChartCard.element.style('display', 'none');
  }

  showWordAbout() {
    this.wordAboutCard.element.style('display', 'block');
  }

  hideWordAbout() {
    this.wordAboutCard.element.style('display', 'none');
  }


  // MARK: - Search

  startSearching() {
    if (!this.application.isCorpusLoaded()) return;

    let searchText = this.searchCard.getSearchText();
    let searchField = this.searchCard.searchField;

    if (searchText === undefined) {
      return console.log('search text undefined');
    } else if (searchText.trim().length === 0) {
      return console.log('search text too short');
    }

    RecentSearches.getInstance().append(searchText);
    searchField.updateRecentSearches();

    this.searchFor(searchText);
  }

  searchFor(searchQuery) {

    // clean search query
    let groups = searchQuery.split(';').map(value => value.trim());
    groups = groups.map(group => group.split(',').map(word => word.trim()).join(','));
    groups = groups.map(group => group.trim());
    let searchTextFormatted = groups.join(';');

    let localDatasets = [];
    let mapDatasets = [];
    let trackDatasets = new DatasetCollection();

    for (let i = 0; i < groups.length; i++) {
      let group = groups[i];
      let words = group.split(',').map(value => value.trim());
      let stack = words.join(", ");

      for (let j = 0; j < words.length; j++) {

        let searchWord = words[j];
        let datasetObject = this.datasetFor(searchWord);
        let data = datasetObject.chartData;
        let mapData = datasetObject.mapData;
        let tracks = datasetObject.tracks;

        let newDataset = {
          label: searchWord,
          stack: stack,
          data: data
        };

        if (this.searchCard.valueType === 'relative') {
          data.forEach(item => item.value = (item.value / item.yearTotal));
        }

        let mapDataset = {
          label: searchWord,
          stack: stack,
          data: mapData
        };

        localDatasets.push(newDataset);

        mapDatasets.push(mapDataset);

        trackDatasets.push({
          label: searchWord,
          stack: stack,
          data: tracks
        });
      }
    }

    this.diachronicChart.datasets = localDatasets;
    this.diachronicChart.update();

    this.mapChartCard.chart.datasets = mapDatasets;
    this.mapChartCard.chart.update();

    this.wordAboutCard.datasets = trackDatasets;
    this.wordAboutCard.update();

    URLParameters.getInstance().set(URLParameters.query, searchTextFormatted);
  }

  datasetFor(searchText) {
    let sensitivity = this.searchCard.sensitivity;
    let firstYear = this.searchCard.firstYear;
    let lastYear = this.searchCard.lastYear;

    let corpus = this.application.corpus;
    let tracks = corpus.tracksForWord(searchText, sensitivity);

    tracks = tracks.filter(function (track) {
      return track.releaseYear >= firstYear
        && track.releaseYear <= lastYear;
    });

    let mapData = corpus.getMapDataForTracks(tracks);
    mapData.forEach((item) => item.datasetName = searchText);


    // mapData.forEach((item) => item.stack = searchText);
    // mapData.searchText = searchText;

    let chartData = corpus.getChartDataForTracks(
      tracks,
      firstYear,
      lastYear,
      sensitivity
    );

    return {
      mapData: mapData,
      chartData: chartData,
      searchText: searchText,
      tracks: tracks
    };
  }

  applyMapData(mapData) {
    let color = randomColor();
    for (let i = 0; i < mapData.length; i++) {
      const entry = mapData[i];
      const departementNumber = entry.departementNumber;
      const numberOfLyrics = entry.value;
      if (numberOfLyrics === 0) {
        continue;
      }
      const departement = this.application.getDepartementForNumber(departementNumber);
      this.mapChart.drawDepartement(departement, color, "" + numberOfLyrics);
    }
  }
}

SearchPage.viewModeKey = 'de.beuth.frc-visualization.SearchPageViewMode';
