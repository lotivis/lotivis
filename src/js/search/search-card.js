import {Card} from "../components/card";
import {SearchField} from "../components/search-field";
import {Dropdown} from "../components/dropdown";
import {RadioGroup} from "../components/radio-group";
import {Button} from "../components/button";
import {Language} from "../../../../frc-visualization/src/language/language";
import {URLParameters} from "../shared/url-parameters";
import {Option} from "../components/option";
import {InnovationListPopup} from "../../../../frc-visualization/src/innovation-list-popup";
import {Application} from "../application";

/**
 *
 * @class SearchCard
 * @extends Card
 */
export class SearchCard extends Card {

  /**
   *
   * @param parent
   */
  constructor(parent) {
    super(parent);

    this.header.style('display', 'none');
    // this.footer.style('display', 'none');
    this.row = this.body
      .append('div')
      .classed('row margin-top', true);

    this.renderSearchField();
    this.renderCaseSensitiveDropdown();
    this.renderRangeDropdown();
    this.renderRelativeAbsolute();
    this.renderFooterRow();
    this.renderPresentInnovationListPopupButton();
    this.renderSearchButton();
  }

  /**
   *
   */
  renderSearchField() {
    this.searchFieldContainer = this.row
      .append('div')
      .classed('col-4', true);
    this.searchField = new SearchField(this.searchFieldContainer);
    this.searchField.onEnter = function () {
      this.startSearching();
    }.bind(this);
  }

  /**
   *
   */
  renderCaseSensitiveDropdown() {
    this.caseSensetiveGroupContainer = this.row
      .append('div')
      .classed('col-2', true);
    this.sensitivityDropdown = new Dropdown(this.caseSensetiveGroupContainer)
      .setOptions([
        new Option('case-sensitive', 'Case Sensitive'),
        new Option('case-insensitive', 'Case Insensitive'),
        // new Option('regex', 'Reg. Expression')
      ]);
    this.sensitivityDropdown.label.text('Sensitivity');
    this.sensitivityDropdown.onChange = function (value) {
      URLParameters.getInstance().set(URLParameters.searchSensitivity, value);
      this.startSearching();
    }.bind(this);
  }

  /**
   *
   */
  renderRangeDropdown() {
    let startYear = 1995;
    let endYear = 2020;
    let defaultStartYear = 2000;
    let options = [];
    for (let year = startYear; year <= endYear; year++) {
      options.push([year, year]);
    }

    this.yearStartContainer = this.row.append('div').classed('col-2', true);
    this.yearStartDropdown = new Dropdown(this.yearStartContainer)
      .setLabelText(Language.translate('from'))
      .setOptions(options)
      .setSelectedOption(defaultStartYear)
      .setOnChange(function (startYear) {
        URLParameters.getInstance().set(URLParameters.startYear, startYear);
        this.startSearching();
      }.bind(this));

    this.yearEndContainer = this.row.append('div').classed('col-2', true);
    this.yearEndDropdown = new Dropdown(this.yearEndContainer)
      .setLabelText(Language.translate('till'))
      .setOptions(options)
      .setSelectedOption(endYear)
      .setOnChange(function (endYear) {
        URLParameters.getInstance().set(URLParameters.endYear, endYear);
        this.startSearching();
      }.bind(this));
  }

  /**
   *
   */
  renderRelativeAbsolute() {
    let container2 = this.row
      .append('div')
      .classed('col-2', true);
    this.valueRadioGroup = new RadioGroup(container2);
    this.valueRadioGroup.setOptions([
      new Option('relative', 'Relative'),
      new Option('absolute', 'Absolute')
    ]);
    this.valueRadioGroup.onChange = function (value) {
      this.diachronicChart.valueType = value;
      this.diachronicChart.update();
      this.valueType = value;
      URLParameters.getInstance().set(URLParameters.valueType, value);
      this.startSearching();
    }.bind(this);
  }

  /**
   *
   */
  renderFooterRow() {
    this.footer = this.row
      .append('div')
      .classed('col-12 button-group margin-top text-end', true);
  }

  /**
   *
   */
  renderPresentInnovationListPopupButton() {
    this.presentInnovationListPopupButton = new Button(this.footer);
    this.presentInnovationListPopupButton.element.classed('button-down', true);
    this.presentInnovationListPopupButton.setText(Language.translate('Innovation List'));
    this.presentInnovationListPopupButton.onClick = function (event) {
      if (!event || !event.target) return;
      let application = Application.default;
      let popup = new InnovationListPopup(application.element);
      popup.searchCard = this;
      popup.showUnder(event.target, 'center');
    }.bind(this);
  }

  /**
   *
   */
  renderSearchButton() {
    this.searchButton = new Button(this.footer);
    this.searchButton.element.classed('button round-button', true);
    this.searchButton.setText(Language.translate('Search'));
    this.searchButton.onClick = function () {
      this.startSearching();
    }.bind(this);
  }

  /**
   *
   * @returns {string}
   */
  getSearchText() {
    return this.searchField.getText();
  }

  /**
   *
   */
  startSearching() {
    // empty
  }

  /**
   *
   */
  createFooter() {
    // do not call super
  }

  // MARK: - Getter

  get searchText() {
    return this.searchField.getText();
  }

  get sensitivity() {
    return this.sensitivityDropdown.value;
  }

  get firstYear() {
    return this.yearStartDropdown.value;
  }

  get lastYear() {
    return this.yearEndDropdown.value;
  }
}
