import {Checkbox} from "../shared.components/checkbox";
import {UrlParameters} from "../shared/url.parameters";
import {SettingsPopup} from "../shared.components/settings.popup";

/**
 * A popup presenting a settings panel for a map.chart chart.
 *
 * @class MapChartSettingsPopup
 * @extends SettingsPopup
 */
export class MapChartSettingsPopup extends SettingsPopup {

  /**
   * Injects the elements of the settings panel.
   * @override
   */
  inject() {
    super.inject();
    let container = this.row.append('div').classed('col-12', true);
    this.showLabelsCheckbox = new Checkbox(container);
    this.showLabelsCheckbox.setText('Labels');
    this.showLabelsCheckbox.onClick = function (checked) {
      this.mapChart.config.showLabels = checked;
      this.mapChart.update();
      UrlParameters.getInstance().setWithoutDeleting('map.chart-show-labels', checked);
    }.bind(this);
  }

  /**
   * Tells the popup that it is about to be presented.
   * @override
   */
  willShow() {
    this.showLabelsCheckbox.setChecked(this.mapChart.config.showLabels);
  }
}
