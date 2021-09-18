import {Popup} from './popup';

/**
 * @class SettingsPopup
 * @extends Popup
 */
export class SettingsPopup extends Popup {

  /**
   * Creates a new instance of SettingsPopup.
   */
  constructor(parent) {
    super(parent);
  }

  /**
   * Appends the content of the settings popup.
   * @override
   */
  inject() {
    super.inject();
    this.card.setTitle('Settings');
    this.card.content.classed('lotivis-card-body-settings', true);
    this.row = this.card.content.append('div').classed('lotivis-row', true);
  }

  /**
   * Returns the preferred size of the popup.
   * @returns {{width: number, height: number}}
   * @override
   */
  preferredSize() {
    return {width: 240, height: 600};
  }
}
