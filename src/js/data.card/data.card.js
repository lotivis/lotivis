import {Card} from "../components/card";
import {createID} from "../shared/selector";
import {validateDatasets} from "../data.juggle/data.validate";
import {lotivis_log} from "../shared/debug";
import {objectsEqual} from "../shared/equal";
import {Button} from "../components/button";
import {Toast} from "../components/toast";

/**
 *
 * @class DataCard
 * @extends Card
 */
export class DataCard extends Card {

  /**
   * Creates a new instance of DatasetCard.
   * @param parent The parental element or a selector (id).
   */
  constructor(parent) {
    super(parent);
    this.updateSensible = true;
    this.body.style('overflow', 'scroll');
    this.render();
    this.toast = new Toast(this.parent);
    this.setCardTitle('Dataset');
  }

  /**
   * Appends the component to this card.
   */
  render() {
    // this.element.classed('lotivis-data-card', true);
    this.textareaID = createID();
    this.textarea = this.body
      .append('textarea')
      .attr('id', this.textareaID)
      .attr('name', this.textareaID)
      .attr('class', 'lotivis-data-textarea');

    this.textarea.on('keyup', this.onKeyup.bind(this));

    this.downloadButton = new Button(this.headerRightComponent);
    this.downloadButton.setText('Download');
    this.downloadButton.onClick = function (event) {
      let content = this.getTextareaContent();
      this.download(content);
    }.bind(this);
  }

  /**
   * Returns the text of the textarea.
   * @returns {*} The text of the textarea.
   */
  getTextareaContent() {
    return document.getElementById(this.textareaID).value || "";
  }

  /**
   * Sets the text of the textarea.
   * @param newContent The text for the textarea.
   */
  setTextareaContent(newContent) {
    let textarea = document.getElementById(this.textareaID);
    if (!textarea) return;
    textarea.value = newContent;

    if (typeof newContent !== 'string') return;
    // let numberOfRows = newContent.split(`\n`).length;
    // this.textarea.attr('rows', numberOfRows);
    this.textarea.attr('rows', 30);
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
    if (!this.updateSensible) return lotivis_log(`[lotivis]  Skipping update due to not update sensible (Reason: ${reason}).`);
    this.updateContentsOfTextarea();
  }

  /**
   * Tells
   * @param notifyController A boolean value indicating whether the datasets controller should be notified about the
   * update.
   */
  updateDatasetsOfController(notifyController = false) {

    let content = this.getTextareaContent();
    this.toast.setStatusMessage('', true);

    try {

      // will throw an error if parsing is not possible
      let parsedDatasets = this.textToDatasets(content);

      // will throw an error if parsed datasets aren't valid.
      validateDatasets(parsedDatasets);

      if (notifyController === true) {

        if (!this.datasetController) {
          return lotivis_log(`[lotivis]  No datasets controller.`);
        }

        if (objectsEqual(this.cachedDatasets, parsedDatasets)) {
          return lotivis_log(`[lotivis]  No changes in datasets.`);
        }

        this.cachedDatasets = parsedDatasets;
        this.updateSensible = false;
        this.datasetController.setDatasets(parsedDatasets);
        this.updateSensible = true;
      }

    } catch (error) {
      lotivis_log(`[lotivis]  ERROR: ${error}`);
      this.toast.setStatusMessage(error, false);
    }
  }

  /**
   * Tells this datasets card to update the content of the textarea by rendering the datasets to text.
   */
  updateContentsOfTextarea() {
    if (!this.datasetController || !this.datasetController.datasets) return;
    let datasets = this.datasetController.datasets;
    let content = this.datasetsToText(datasets);
    this.setTextareaContent(content);
    this.cachedDatasets = datasets;
  }

  /**
   * Initiates a download of the content of the textarea.
   */
  download(content) {
    throw new Error(`Subclasses should override.`);
  }

  /**
   * Returns the parsed datasets from the content of the textarea.  Will throw an exception if parsing is not possible.
   * Subclasses should override.
   * @param text The text to samples.parse to datasets.
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
