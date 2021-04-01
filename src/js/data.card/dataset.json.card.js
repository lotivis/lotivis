import {validateDatasets} from "../data-juggle/dataset.validate";
import {objectsEqual} from "../shared/equal";
import {DatasetCard} from "./dataset.card";

/**
 * A card containing a textarea which contains the JSON text of a dataset collection.
 *
 * @class DatasetJsonCard
 * @extends DatasetCard
 */
export class DatasetJsonCard extends DatasetCard {

  /**
   * Creates a new instance of DatasetJsonCard.
   * @param parent The parental element or a selector (id).
   */
  constructor(parent) {
    super(parent);
    this.setHeaderText('Dataset JSON Card');
    this.cachedDatasets = "";
  }

  /**
   *
   * @override
   * @param updateController
   * @returns {*}
   */
  updateContent(updateController=true) {
    let datasets = this.datasetController.datasets;
    let content = JSON.stringify(datasets, null, 2);
    this.textarea.text(content);
    this.parseContent(updateController);
  }

  /**
   *
   * @param update
   */
  parseContent(update=true) {
    let content = this.getTextareaContent();
    let numberOfRows = content.split("\n").length;
    this.textarea.style('height', null);
    this.textarea.attr('rows', numberOfRows);
    this.setStatusMessage('', true);

    try {

      let parsedDatasets = JSON.parse(content.trim());
      let equal = objectsEqual(this.cachedDatasets, parsedDatasets);
      if (equal) return;
      this.cachedDatasets = parsedDatasets;
      validateDatasets(parsedDatasets);

      if (!update) return;
      if (!this.datasetController) return;
      this.updateSensible = false;
      this.datasetController.setDatasets(parsedDatasets);
      this.updateSensible = true;

    } catch (error) {
      this.setStatusMessage(error, false);
    }
  }
}
