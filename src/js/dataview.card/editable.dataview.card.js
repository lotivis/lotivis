import {Toast} from "../components/toast";
import {validateDatasets} from "../data.juggle/data.validate";
import {lotivis_log} from "../shared/debug";
import {objectsEqual} from "../shared/equal";
import {UpdatableDataviewCard} from "./updatable.dataview.card";
import {LotivisUnimplementedMethodError} from "../data.juggle/data.validate.error";

/**
 *
 * @class EditableDataviewCard
 * @extends UpdatableDataviewCard
 */
export class EditableDataviewCard extends UpdatableDataviewCard {

  /**
   * Creates a new instance of DatasetCard.
   * @param parent The parental element or a selector (id).
   */
  constructor(parent) {
    super(parent);
    this.toast = new Toast(this.parent);
    this.downloadButton.show();
  }

  /**
   * Tells this dataset card that a 'keyup'-event occurred in the textarea.
   */
  onKeyup() {
    this.updateDatasetsOfController.bind(this)(true);
  }

  /**
   * Tells
   * @param notifyController A boolean value indicating whether the datasets controller should be notified about the
   * update.
   */
  updateDatasetsOfController(notifyController = false) {

    let content = this.getTextareaContent();
    this.toast.setStatusMessage(null);

    try {

      // will throw an error if parsing is not possible
      let parsedDatasets = this.textToDatasets(content);
      if (!parsedDatasets) return;

      // will throw an error if parsed datasets aren't valid.
      validateDatasets(parsedDatasets);

      if (notifyController === true) {

        if (!this.datasetsController) {
          return lotivis_log(`[lotivis]  No datasets controller.`);
        }

        if (objectsEqual(this.cachedDatasets, parsedDatasets)) {
          return lotivis_log(`[lotivis]  No changes in datasets.`);
        }

        this.cachedDatasets = parsedDatasets;
        this.updateSensible = false;
        this.datasetsController.setDatasets(parsedDatasets);
        this.updateSensible = true;
      }

    } catch (error) {
      lotivis_log(`[lotivis]  ERROR: ${error}`);
      this.toast.setStatusMessage(error);
    }
  }

  datasetsToText(datasets) {
    return new LotivisUnimplementedMethodError('datasetsToText(datasets)');
  }
}
