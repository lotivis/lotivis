import {Component} from "./component";
import {Button} from "./button";

/**
 * A toast in the top of the page.
 *
 * @class Toast
 * @extends Component
 */
export class Toast extends Component {

  /**
   * Creates a new instance of Toast.
   * @constructor
   * @param {Component} parent The parental component.
   */
  constructor(parent) {
    super(parent);
    this.element = this
      .parent
      .append('div')
      .attr('class', 'lotivis-data-card-status-tooltip')
      .style('opacity', 0)
      .style('display', `none`);
    this.row = this.element
      .append('div')
      .attr('class', 'lotivis-row');
    this.leftComponnt = this.row
      .append('div')
      .attr('class', 'lotivis-col-6');
    this.rightComponent = this.row
      .append('div')
      .attr('class', 'lotivis-col-6');
    this.hideButton = new Button(this.rightComponent)
      .setText(`Hello`);
  }

  /**
   * Shows the toast.
   * @override
   */
  show() {
    super.show();
    this.element.style('opacity', 1);
    return this;
  }

  /**
   * Hides the toast.
   * @override
   */
  hide() {
    super.hide();
    this.element.style('opacity', 0);
  }

  /**
   * Sets the text of the Toast.
   * @param text The text of the Toast.
   */
  setText(text) {
    this.element.text(text);
  }

  /**
   * Sets the text of the status label.  If text is empty the status label will be hide.
   * @param newStatusMessage The new status message.
   */
  setStatusMessage(newStatusMessage) {
    let saveString = String(newStatusMessage || "").trim();
    this.element.text(saveString);
    if (saveString) {
      this.show();
    } else {
      this.hide();
    }
  }
}
