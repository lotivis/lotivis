import * as d3 from "d3";
import * as events from "events";

export class Component extends events.EventEmitter {
  constructor(selector) {
    if (!selector) throw new Error("no selector specified");
    super();
    this.selector = selector;
    this.element = d3.select("#" + selector);
    if (this.element.empty())
      throw new Error('invalid selector "' + selector + '"');
    this.element.attr("id", this.selector);
  }

  // MARK: - Functions

  show() {
    if (this.element) this.element.style("display", "");
  }

  hide() {
    if (this.element) this.element.style("display", "none");
  }

  get isVisible() {
    return !this.element ? this.element.style("display") !== "none" : false;
  }

  getElementEffectiveSize() {
    if (!this.element) return [0, 0];
    let width = this.element.style("width").replace("px", "");
    let height = this.element.style("height").replace("px", "");
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

  toString() {
    return "[" + getClassname() + ", id: " + this.selector + "]";
  }

  getClassname() {
    return !this.constructor || !this.constructor.name
      ? typeof this
      : this.constructor.name;
  }
}
