import {Popup} from '../components/popup';
import {RadioGroup} from "../components/radio-group";
import {Option} from "../components/option";
import {SearchPage} from "./search-page";
import {URLParameters} from "../shared/url-parameters";
import {Language} from "../../../../frc-visualization/src/language/language";
import {Checkbox} from "../components/checkbox";

/**
 *
 * @class SearchPageSettingsPopup
 * @extends Popup
 */
export class SearchPageSettingsPopup extends Popup {

  preferredSize() {
    return {width: 320, height: 300};
  }

  /**
   * Override `Popup` component.
   */
  render() {
    // this.card.header.style('display', 'none');
    this.renderViewRadioGroup();
    this.renderShowChartCheckbox();
    this.renderShowMapCheckbox();
    this.renderShowWordAboutCheckbox();
  }

  /**
   *
   */
  renderCard() {
    super.renderCard();
    this.row = this.card.body
      .append('div')
      .classed('row margin-top', true);
  }

  /**
   *
   */
  renderViewRadioGroup() {
    // this.card.body.append('p');

    this.viewRadioGroupLabel = this.row
      .append('div')
      .classed('col-4 text-end', true)
      .text(Language.translate('View Mode') + ':');

    this.viewRadioGroupContainer = this.row
      .append('div')
      .classed('col-8', true);

    this.viewRadioGroup = new RadioGroup(this.viewRadioGroupContainer);
    this.viewRadioGroup.setOptions([
      new Option('half', 'Half'),
      new Option('full', 'Full')
    ]);

    this.viewRadioGroup.onChange = function (value) {
      if (!this.searchPage) return;
      this.searchPage.setViewMode(value, true);
      URLParameters.getInstance().set(URLParameters.searchViewMode, value);
    }.bind(this);
  }

  /**
   *
   */
  renderShowChartCheckbox() {
    this.showChartCheckboxLabel = this.row.append('div').classed('col-4 text-end', true);
    this.showChartCheckboxContainer = this.row.append('div').classed('col-8', true);
    this.showChartCheckbox = new Checkbox(this.showChartCheckboxContainer);
    this.showChartCheckbox.setText(Language.translate('Show Chart'));
    this.showChartCheckbox.onClick = function (value) {
      value ? this.searchPage.showChart() : this.searchPage.hideChart();
      URLParameters.getInstance().setWithoutDeleting('show-chart', value);
    }.bind(this);
  }

  /**
   *
   */
  renderShowMapCheckbox() {
    this.showMapCheckboxLabel = this.row.append('div').classed('col-4 text-end', true);
    this.showMapCheckboxContainer = this.row.append('div').classed('col-8', true);
    this.showMapCheckbox = new Checkbox(this.showMapCheckboxContainer);
    this.showMapCheckbox.setText(Language.translate('Show Map'));
    this.showMapCheckbox.onClick = function (value) {
      value ? this.searchPage.showMap() : this.searchPage.hideMap();
      URLParameters.getInstance().setWithoutDeleting('show-map', value);
    }.bind(this);
  }

  /**
   *
   */
  renderShowWordAboutCheckbox() {
    this.showWordAboutCheckboxLabel = this.row.append('div').classed('col-4 text-end', true);
    this.showWordAboutCheckboxContainer = this.row.append('div').classed('col-8', true);
    this.showWordAboutCheckbox = new Checkbox(this.showWordAboutCheckboxContainer);
    this.showWordAboutCheckbox.setText(Language.translate('Show Word About'));
    this.showWordAboutCheckbox.onClick = function (value) {
      value ? this.searchPage.showWordAbout() : this.searchPage.hideWordAbout();
      URLParameters.getInstance().setWithoutDeleting('show-word-about', value);
    }.bind(this);
  }

  /**
   *
   */
  willShow() {
    super.willShow();
    this.card.headerRow.append('h3').text(Language.translate('Settings'));
    this.loadValues();
  }

  loadValues() {
    let searchPage = this.searchPage;
    this.viewRadioGroup.setSelectedOption(searchPage.viewMode);
    this.showChartCheckbox.setChecked(searchPage.diachronicChartCard.isVisible);
    this.showMapCheckbox.setChecked(searchPage.mapChartCard.isVisible);
    this.showWordAboutCheckbox.setChecked(searchPage.wordAboutCard.isVisible);
  }
}

/**
 * Enumeration of available view modes.
 * @enum
 */
SearchPageSettingsPopup.ViewMode = {
  Half: 'Half',
  Full: 'Full'
};
