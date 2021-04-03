import {Component} from './component';
import {createID} from '../shared/selector';
import {Card} from './card';
import {Button} from './button';

/**
 *
 *
 * @class Popup
 * @extends Component
 */
export class Popup extends Component {

  /**
   * Creates a new instance of Popup.
   *
   * @param parent The parental component.
   */
  constructor(parent) {
    super(parent);
    this.injectUnderground(parent);
    this.injectContainer();
    this.injectCard();
    this.inject();
    this.injectCloseButton();
    this.addCloseActionListeners();
  }

  // MARK: - Render

  /**
   * Appends components to this popup.
   *
   * Should be overridden by subclasses.
   */
  inject() {
    // empty
  }

  /**
   * Appends the 'dim' background to the given parent.
   *
   * @param parent The parental element.
   */
  injectUnderground(parent) {
    this.modalBackgroundId = createID();
    this.modalBackground = parent
      .append('div')
      .classed('lotivis-popup-underground lotivis-fade-in', true)
      .attr('id', this.modalBackgroundId);
  }

  /**
   *
   */
  injectContainer() {
    this.elementId = createID();
    this.element = this.modalBackground
      .append('div')
      .classed('lotivis-popup', true)
      .attr('id', this.elementId);
  }

  /**
   *
   */
  injectCard() {
    this.card = new Card(this.element);
    this.card.element.classed('lotivis-popup lotivis-arrow lotivis-arrow-right', true);
  }

  /**
   * Appends a close button to the right header component.
   */
  injectCloseButton() {
    this.closeButton = new Button(this.card.headerRightComponent);
    this.closeButton.element.classed('lotivis-button-small', true);
    this.closeButton.setText('Close');
  }

  /**
   * Appends an on click listener to the button.
   */
  addCloseActionListeners() {
    let validIDs = [
      this.closeButton.selector,
      this.modalBackgroundId
    ];
    let popup = this;
    this.modalBackground.on('click', function (event) {
      if (!event || !event.target) return;
      if (!validIDs.includes(event.target.id)) return;
      popup.dismiss();
    });
  }

  // MARK: - Life Cycle

  /**
   * Tells the receiving popup that it is about to be presented.
   *
   * Subclasses may override.
   */
  willShow() {
    // empty
  }

  /**
   * Tells the receiving popup that it is now presented.
   *
   * Subclasses may override.
   */
  didShow() {
    // empty
  }

  /**
   * Presents the popup.
   */
  show() {
    if (this.willShow) this.willShow();
    this.getUnderground().style.display = 'block';
    if (this.didShow) this.didShow();
  }

  /**
   * Tells the receiving popup that it is about to be dismissed.
   *
   * Subclasses may override.
   */
  willDismiss() {
    // empty
  }

  /**
   * Tells the receiving popup that the DOM element will be removed.
   *
   * Subclasses may override.
   */
  willRemoveDOMElement() {
    // empty
  }

  /**
   * Dismisses the popup.
   */
  dismiss() {
    if (this.willDismiss) this.willDismiss();
    this.getUnderground().style.display = 'none';
    if (this.willRemoveDOMElement) this.willRemoveDOMElement();
    this.getUnderground().remove();
  }

  getUnderground() {
    return document.getElementById(this.modalBackgroundId);
  }

  showUnder(sourceElement, position = 'center') {
    if (!sourceElement) return;

    let preferredSize = this.preferredSize();
    let origin = this.calculateBottomCenter(sourceElement);

    if (position === 'left') {
      origin.x -= origin.width / 2;
    } else if (position === 'right') {
      origin.x -= preferredSize.width - origin.width / 2;
    } else { // assume center
      origin.x -= (preferredSize.width / 2);
    }

    let id = this.elementId;
    let popup = document.getElementById(id);

    popup.style.position = 'absolute';
    popup.style.width = preferredSize.width + 'px';
    // popup.style.height = preferredSize.height + 'px';
    popup.style.left = origin.x + 'px';
    popup.style.top = origin.y + 'px';

    this.show();
  }

  showBigModal() {
    let id = this.elementId;
    let popup = document.getElementById(id);
    let preferredSize = this.preferredSize();

    popup.style.position = 'relative';
    popup.style.margin = '50px auto';
    popup.style.width = preferredSize.width + 'px';

    this.show();
  }

  /**
   * Returns the preferred size of the popup.  Subclasses may override in order to
   * change the size of the popup.
   *
   * @returns {{width: number, height: number}}
   */
  preferredSize() {
    return {
      width: 300,
      height: 300
    };
  }

  /**
   * Returns the bottom middle point of the passed element.
   *
   * @param element
   * @param respectWindowScroll
   * @returns {{x: number, width: number, y: number, height: number}}
   */
  calculateBottomCenter(element, respectWindowScroll = false) {
    let rect = element.getBoundingClientRect();
    let x = rect.x + (rect.width / 2);
    let y = rect.y + rect.height;

    if (respectWindowScroll) {
      x += window.scrollX;
      y += window.scrollY;
    }

    return {
      x: x,
      y: y,
      width: rect.width,
      height: rect.height
    };
  }
}
