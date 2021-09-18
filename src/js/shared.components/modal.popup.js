import {Popup} from "./popup";

/**
 *
 * @class ModalPopup
 * @extends Popup
 */
export class ModalPopup extends Popup {

  /**
   *
   * @param parent
   */
  constructor(parent) {
    super(parent);
    this.modalBackground
      .classed('popup-underground', false)
      .classed('modal-underground', true);
  }

  /**
   *
   */
  inject() {
    super.inject();
    this.renderRow();
  }

  /**
   *
   */
  renderRow() {
    this.row = this.card.body
      .append('div')
      .classed('row', true);
    this.content = this.row
      .append('div')
      .classed('col-12 info-box-margin', true);
  }

  /**
   *
   */
  loadContent(url) {
    if (!url) return;
    let content = this.content;

    d3.text(url)
      .then(function (text) {
        console.log(text);
        content.html(text);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  /**
   * Returns the preferred size. The default is 800, 600.
   * @returns {{width: number, height: number}} The preferred size.
   */
  preferredSize() {
    return {
      width: 800,
      height: 600
    };
  }
}
