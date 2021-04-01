import {Card} from "../components/card";
import {createID} from "../shared/selector";
import {validateDatasets} from "../data.juggle/dataset.validate";
import {debug_log} from "../shared/debug";
import {objectsEqual} from "../shared/equal";

/**
 *
 * @class DatasetCard
 * @extends Card
 */
export class DatasetCard extends Card {

  /**
   * Creates a new instance of DatasetCard.
   * @param parent The parental element or a selector (id).
   */
  constructor(parent) {
    super(parent);
    this.updateSensible = true;
    this.body.style('overflow', 'scroll');
    this.footer.style('display', 'block');
    this.render();
    this.setHeaderText('Dataset Card');
  }

  /**
   * Appends the component to this card.
   */
  render() {
    this.element.classed('lotivis-data-card', true);

    this.header.text('');
    this.headline = this.header.append('div');

    this.textareaID = createID();
    this.textarea = this.body
      .append('textarea')
      .attr('id', this.textareaID)
      .attr('name', this.textareaID)
      .attr('class', 'lotivis-data-textarea');

    this.statusText = this.header
      .append('div')
      .style(`display`, `none`)
      .classed('lotivis-data-status-text', true)
      .classed('lotivis-data-status-failure', true);

    this.textarea.on('keyup', this.onKeyup.bind(this));
  }

  /**
   * Returns the text of the textarea.
   * @returns {*} The text of the textarea.
   */
  getTextareaContent() {
    return document.getElementById(this.textareaID).value || "";
  }

  setTextareaContent(newContent) {
    let textarea = document.getElementById(this.textareaID);
    if (!textarea) return;
    textarea.value = newContent;
  }

  /**
   * Sets the text of the headline.
   * @param newHeaderText The new headline text.
   */
  setHeaderText(newHeaderText) {
    this.headline.text(newHeaderText);
  }

  /**
   * Sets the text of the status label.  If text is empty the status label will be hide.
   * @param newStatusMessage The new status message.
   */
  setStatusMessage(newStatusMessage) {
    this.statusText
      .text(newStatusMessage)
      .style(`display`, newStatusMessage === "" ? `none` : `block`);
  }

  /**
   * Sets the dataset controller.
   * @param newDatasetController
   */
  setDatasetController(newDatasetController) {
    this.datasetController = newDatasetController;
    this.datasetController.addListener(this);
    this.updateContentsOfTextarea();
  }

  /**
   * Tells this dataset card that a 'keyup'-event occurred in the textarea.
   */
  onKeyup() {
    this.updateDatasetsOfController.bind(this)(true);
  }

  /**
   * Tells thi dataset card that the datasets of the datasets controller has changed.
   * @param datasetsController The datasets controller.
   * @param reason The reason of the update.
   */
  update(datasetsController, reason) {
    if (!this.updateSensible) return debug_log(`Skipping update due to not update sensible (Reason: ${reason}).`);
    this.updateContentsOfTextarea();
  }

  /**
   * Tells
   * @param notifyController A boolean value indicating whether the datasets controller should be notified about the
   * update.
   */
  updateDatasetsOfController(notifyController = false) {

    let content = this.getTextareaContent();
    this.setStatusMessage('', true);

    try {

      // will throw an error if parsing is not possible
      let parsedDatasets = this.textToDatasets(content);

      // will throw an error if parsed datasets aren't valid.
      validateDatasets(parsedDatasets);

      if (notifyController === true) {

        if (!this.datasetController) {
          return debug_log(`No datasets controller.`);
        }

        if (objectsEqual(this.cachedDatasets, parsedDatasets)) {
          return debug_log(`No changes in datasets.`);
        }

        this.cachedDatasets = parsedDatasets;
        this.updateSensible = false;
        this.datasetController.setDatasets(parsedDatasets);
        this.updateSensible = true;
      }

    } catch (error) {
      debug_log(`error ${error}`);
      this.setStatusMessage(error, false);
    }
  }

  /**
   * Tells this datasets card to update the content of the textarea by rendering the datasets to text.
   */
  updateContentsOfTextarea() {
    if (!this.datasetController || !this.datasetController.datasets) return;
    let datasets = this.datasetController.datasets;
    let content = this.datasetsToText(datasets);
    let numberOfRows = content.split(`\n`).length;
    this.textarea.attr('rows', numberOfRows);
    this.setTextareaContent(content);
    this.cachedDatasets = datasets;
  }

  /**
   * Returns the parsed datasets from the content of the textarea.  Will throw an exception if parsing is not possible.
   * Subclasses should override.
   * @param text The text to parse to datasets.
   * @return {*}
   */
  textToDatasets(text) {
    throw new Error(`Subclasses should override.`);
  }

  /**
   * Sets the content of the textarea by rendering the given datasets to text.  Subclasses should override.
   * @param datasets The datasets to render.
   * @return {*}
   */
  datasetsToText(datasets) {
    throw new Error(`Subclasses should override.`);
  }
}
