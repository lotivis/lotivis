import {createUUID} from "../shared/uuid";

/**
 *
 * @class Component
 */
export class Component {

  /**
   *
   * @param parent
   */
  constructor(parent) {
    if (!parent) throw 'No parent or selector specified.';
    if (typeof parent === 'string') {
      this.initializeFromSelector(parent);
    } else {
      this.initializeFromParent(parent);
    }
  }

  initializeFromSelector(selector) {
    this.selector = selector;
    this.parent = d3.select('#' + selector);
  }

  initializeFromParent(parent) {
    this.selector = createUUID();
    this.parent = parent;
  }

  // MARK: - Functions

  show() {
    if (!this.element) return;
    this.element.style('display', '');
  }

  hide() {
    if (!this.element) return;
    this.element.style('display', 'none');
  }

  get isVisible() {
    if (!this.element) return false;
    return this.element.style('display') !== 'none';
  }
}
