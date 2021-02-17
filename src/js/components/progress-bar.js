import {Component} from "./component";
import {createUUID} from "../shared/uuid";

/**
 * Displays a loading status.
 *
 * @class ProgressBar
 * @extends Component
 */
export class ProgressBar extends Component {

  /**
   * Creates a new instance of ProgressBar.
   * @param parent
   */
  constructor(parent) {
    super(parent);
    this.renderBar();
  }

  /**
   * Adds the bar to the parent.
   */
  renderBar() {
    this.barContainerSelector = createUUID();
    this.barContainer = this.parent
      .append('div')
      .attr('id', this.barContainerSelector)
      .attr('class', 'progress-bar-container');

    this.barSelector = createUUID();
    this.bar = this.barContainer
      .append('div')
      .attr('id', this.barSelector)
      .attr('class', 'progress-bar')
      .html('&nbsp;');
  }

  set value(newValue) {
    let valueAsNumber = Number(newValue);
    let barContainer = document.getElementById(this.barContainerSelector);
    let totalWidth = barContainer.getBoundingClientRect().width;
    let totalWidthAsNumber = Number(totalWidth);
    let width = (totalWidthAsNumber * valueAsNumber);
    document.getElementById(this.barSelector)
      .setAttribute('style', 'width:' + width + 'px');
  }

  get value() {
    let totalWidth = document.getElementById(this.barContainerSelector).style.width;
    let barWidth = document.getElementById(this.barSelector).style.width;
    console.log('totalWidth: ' + totalWidth);
  }
}
