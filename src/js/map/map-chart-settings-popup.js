import {Popup} from "../components/popup";
import {Language} from "../../../../frc-visualization/src/language/language";
import {Checkbox} from "../components/checkbox";
import {URLParameters} from "../shared/url-parameters";

/**
 *
 * @class MapChartSettingsPopup
 * @extends Popup
 */
export class MapChartSettingsPopup extends Popup {

  /**
   *
   */
  render() {
    this.card
      .headerRow
      .append('h3')
      .text(Language.translate('Settings'));

    this.row = this.card.body
      .append('div')
      .classed('row', true);

    this.renderShowLabelsCheckbox();
  }

  /**
   *
   */
  renderShowLabelsCheckbox() {
    let container = this.row.append('div').classed('col-12 margin-top', true);
    this.showLabelsCheckbox = new Checkbox(container);
    this.showLabelsCheckbox.setText(Language.translate('Labels'));
    this.showLabelsCheckbox.onClick = function (checked) {
      this.mapChart.isShowLabels = checked;
      this.mapChart.update();
      URLParameters.getInstance().setWithoutDeleting('map-show-labels', checked);
    }.bind(this);
  }

  /**
   *
   * @returns {{width: number, height: number}}
   */
  preferredSize() {
    return {
      width: 240,
      height: 600
    };
  }

  /**
   *
   */
  willShow() {
    super.willShow();
    this.loadValues();
  }

  /**
   *
   */
  loadValues() {
    this.showLabelsCheckbox.setChecked(this.mapChart.isShowLabels);
    console.log('this.mapChart.showLabels: ' + this.mapChart.isShowLabels);
  }
}
