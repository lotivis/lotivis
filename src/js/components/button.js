import {Component} from "./component";

/**
 * A button
 *
 * @class Button
 * @extends Component
 */
export class Button extends Component {

  /**
   * Creates an instance of Button.
   *
   * @constructor
   * @param {Component} parent The parental component.
   * @param style The style of the button.  One of default|back|forward
   */
  constructor(parent, style = 'default') {
    super(parent);

    this.element = parent
      .append('button')
      .attr('id', this.selector)
      .attr('class', 'lotivis-button')
      .on('click', function (event) {
        if (!this.onClick) return;
        this.onClick(event);
      }.bind(this));

    switch (style) {
      case 'round':
        this.element.classed('lotivis-button-round', true);
        break;
      default:
        break;
    }
  }

  /**
   * Sets the text of the button.
   * @param text The text of the button.
   */
  setText(text) {
    this.element.text(text);
  }

  onClick(event) {
    // empty
  }
}
