import {Popup} from "../components/popup";
import {Checkbox} from "../components/checkbox";
import {UrlParameters} from "../shared/url.parameters";

/**
 * A popup presenting a settings panel for a map chart.
 *
 * @class MapChartSettingsPopup
 * @extends Popup
 */
export class MapChartSettingsPopup extends Popup {

  /**
   * Injects the elements of the settings panel.
   * @override
   */
  inject() {
    this.card.setCardTitle('Settings');
    this.card.content.classed('lotivis-card-body-settings', true);
    this.row = this
      .card
      .content
      .append('div')
      .classed('lotivis-row', true);

    this.renderShowLabelsCheckbox();
  }

  /**
   * Injects a checkbox to toggle the visibility of the labels of the map chart.
   */
  renderShowLabelsCheckbox() {
    let container = this.row.append('div').classed('lotivis-col-12', true);
    this.showLabelsCheckbox = new Checkbox(container);
    this.showLabelsCheckbox.setText('Labels');
    this.showLabelsCheckbox.onClick = function (checked) {
      this.mapChart.config.showLabels = checked;
      this.mapChart.update();
      UrlParameters.getInstance().setWithoutDeleting('map-show-labels', checked);
    }.bind(this);
  }

  /**
   * Returns the preferred size for this popup.
   * @override
   * @returns {{width: number, height: number}}
   */
  preferredSize() {
    return {width: 240, height: 600};
  }

  /**
   * Tells the popup that it is about to be presented.
   * @override
   */
  willShow() {
    this.showLabelsCheckbox.setChecked(this.mapChart.config.showLabels);
  }
}
