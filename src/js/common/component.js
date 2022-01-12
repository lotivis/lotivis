import * as d3 from "d3";

export class Component {
  constructor(selector) {
    if (!selector) throw new Error("no selector specified");
    this.selector = selector;
    this.element = d3.select("#" + selector);
    if (this.element.empty())
      throw new Error('invalid selector "' + selector + '"');
    this.element.attr("id", this.selector);
  }

  // MARK: - Functions

  show() {
    if (this.element) this.element.style("display", "");
    return this;
  }

  hide() {
    if (this.element) this.element.style("display", "none");
    return this;
  }

  get isVisible() {
    if (!this.element) return false;
    return this.element.style("display") !== "none";
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
    return (
      "[" +
      getClassname() +
      "" +
      (this.selector ? " " + this.selector : "") +
      "]"
    );
  }

  getClassname() {
    return !this.constructor || !this.constructor.name
      ? typeof this
      : this.constructor.name;
  }
}
