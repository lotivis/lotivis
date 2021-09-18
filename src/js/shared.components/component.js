import {camel2title, createID} from "../shared/selector";
import {LotivisError, LotivisElementNotFoundError} from "../data.juggle/data.validate.error";

/**
 * A lotivis component.
 * @class Component
 */
export class Component {

  /**
   * Creates a new instance of Component.
   * @param {Component|string|{}} parent The parental component or selector.
   */
  constructor(parent) {
    if (!parent) throw new LotivisError('No parent or selector specified.');
    if (Object.getPrototypeOf(parent) === String.prototype) {
      this.initializeFromSelector(parent);
    } else if (Object.getPrototypeOf(parent) === Object.prototype) {
      this.initializeFromConfig(parent);
    } else {
      this.initializeFromParent(parent);
    }
    this.element = undefined;
  }

  /**
   * Initializes this component from the given selector string.
   * @param selector The selector of the parental
   */
  initializeFromSelector(selector) {
    this.selector = selector;
    this.parent = d3.select('#' + selector);
    if (this.parent.empty()) throw new LotivisElementNotFoundError(selector);
  }

  initializeFromConfig(config) {
    this.config = config;
    if (config.selector) {
      this.initializeFromSelector(config.selector);
    } else {
      let selector = camel2title(this.constructor.name)
        .toLowerCase()
        .trim()
        .split(` `).join(`-`);

      this.initializeFromSelector(selector);
    }
  }

  initializeFromParent(parent) {
    this.selector = createID();
    this.parent = parent;
  }

  // MARK: - Functions

  show() {
    if (!this.element) return;
    this.element.style('display', '');
    return this;
  }

  hide() {
    if (!this.element) return;
    this.element.style('display', 'none');
    return this;
  }

  get isVisible() {
    if (!this.element) return false;
    return this.element.style('display') !== 'none';
  }

  getElementEffectiveSize() {
    if (!this.element) return [0, 0];
    let width = this.element.style('width').replace('px', '');
    let height = this.element.style('height').replace('px', '');
    return [Number(width), Number(height)];
  }

  getElementPosition() {
    let element = document.getElementById(this.selector);
    if (!element) return [0, 0];
    let rect = element.getBoundingClientRect();
    let xPosition = rect.x + window.scrollX;
    let yPosition = rect.y + window.scrollY;
    return [xPosition, yPosition];
  }

  /**
   * Returns a string representation of this Component.
   * @returns {string} A string representing this Component.
   */
  toString() {
    let components = [this.constructor.name];
    if (this.selector) components.push(`'${this.selector}'`);
    return `[${components.join(' ')}]`;
  }

  /**
   * Returns the name of the constructor of this component if present. Will return the result of `typeof` else.
   * @returns {*|"undefined"|"object"|"boolean"|"number"|"string"|"function"|"symbol"|"bigint"}
   */
  getClassname() {
    if (!this.constructor || !this.constructor.name) return (typeof this);
    return this.constructor.name;
  }
}
