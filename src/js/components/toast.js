import {Component} from "./component";

/**
 * A toast in the top of the page.
 *
 * @class Toast
 * @extends Component
 */
export class Toast extends Component {

  /**
   * Creates an instance of Toast.
   *
   * @constructor
   * @param {Component} parent The parental component.
   */
  constructor(parent) {
    super(parent);
    this.element = this
      .parent
      .append('div')
      .style('opacity', 0)
      .style('display', `none`)
      .attr('class', 'lotivis-data-card-status-tooltip');
  }

  /**
   * Sets the text of the Toast.
   * @param text The text of the Toast.
   */
  setText(text) {
    this.element.text(text);
  }

  show() {
    super.show();
    this.element.style('opacity', 1);
  }

  hide() {
    super.hide();
    this.element.style('opacity', 0);
  }

  /**
   * Sets the text of the status label.  If text is empty the status label will be hide.
   * @param newStatusMessage The new status message.
   */
  setStatusMessage(newStatusMessage) {
    this.element.text(newStatusMessage);
    if (newStatusMessage === "") {
      this.hide();
    } else {
      this.show();
    }
  }
}
