import {Popup} from "../components/popup";
import {Checkbox} from "../components/checkbox";
import {UrlParameters} from "../shared/url.parameters";
import {verbose_log} from "../shared/debug";
import {Dropdown} from "../components/dropdown";
import {Option} from "../components/option";
import {PlotChartSort} from "./plot.chart.sort";

/**
 *
 * @class PlotChartSettingsPopup
 * @extends Popup
 */
export class PlotChartSettingsPopup extends Popup {

  /**
   * Appends the headline and the content row of the popup.
   */
  render() {
    this.card.headerRow.append('h3').text('Settings');
    this.row = this.card.body
      .append('div')
      .classed('lotivis-row margin-left margin-right margin-top', true);
    this.renderShowLabelsCheckbox();
  }

  /**
   * Appends the checkboxes the popups content.
   */
  renderShowLabelsCheckbox() {
    let container = this.row.append('div').classed('lotivis-margin-top', true);

    this.showLabelsCheckbox = new Checkbox(container);
    this.showLabelsCheckbox.setText('Labels');
    this.showLabelsCheckbox.onClick = function (checked) {
      this.chart.config.isShowLabels = checked;
      this.chart.update();
      UrlParameters.getInstance().set(UrlParameters.chartShowLabels, checked);
    }.bind(this);

    let dropdownContainer = this.row.append('div').classed('lotivis-col-12', true);
    this.sortDropdown = new Dropdown(dropdownContainer);
    this.sortDropdown.setLabelText('Sort');
    this.sortDropdown.setOptions([
      new Option(PlotChartSort.alphabetically),
      new Option(PlotChartSort.duration),
      new Option(PlotChartSort.intensity),
      new Option(PlotChartSort.firstDate)
    ]);
    this.sortDropdown.setOnChange(function (value) {
      this.chart.sort = value;
      this.chart.update();
    }.bind(this));
  }

  /**
   * Returns the preferred size of the popup.
   * @returns {{width: number, height: number}}
   */
  preferredSize() {
    return {width: 240, height: 600};
  }

  /**
   * Tells this popup that it is about to be displayed.
   */
  willShow() {
    this.showLabelsCheckbox.setChecked(this.chart.config.isShowLabels);
    this.sortDropdown.setSelectedOption(this.chart.sort);
  }
}
