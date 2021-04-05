import {TextareaCard} from "../components/textarea.card";
import {lotivis_log} from "../shared/debug";
import {LotivisUnimplementedMethodError} from "../data.juggle/data.validate.error";

/**
 *
 * @class UpdatableDataviewCard
 * @extends TextareaCard
 */
export class UpdatableDataviewCard extends TextareaCard {

  /**
   * Creates a new instance of UpdatableDataviewCard.
   * @param parent The parental element or a selector (id).
   */
  constructor(parent = {}) {
    parent.title = parent.title || 'UpdatableDataviewCard';
    super(parent);
    this.updateSensible = true;
    this.downloadButton.hide();
  }

  /**
   * Sets the dataset controller.
   * @param newDatasetController
   */
  setDatasetsController(newDatasetController) {
    this.datasetsController = newDatasetController;
    this.datasetsController.addListener(this);
  }

  /**
   * Tells thi dataset card that the datasets of the datasets controller has changed.
   * @param datasetsController The datasets controller.
   * @param reason The reason of the update.
   */
  update(datasetsController, reason) {
    if (!this.updateSensible) {
      lotivis_log(`[lotivis]  NOT sensible ${this}. Reason '${reason}'.`);
      return;
    } else if (this.config.updateSensible === false) {
      lotivis_log(`[lotivis]  NOT sensible (Config) ${this}. Reason '${reason}'.`);
      return;
    }

    this.updateContentsOfTextarea();

    lotivis_log(`[lotivis]  Update ${this}. Reason '${reason}'.`);
  }

  /**
   * Tells this datasets card to update the content of the textarea by rendering the datasets to text.
   */
  updateContentsOfTextarea() {
    if (!this.datasetsController || !this.datasetsController.datasets) return;
    let datasets = this.datasetsController.datasets;
    let content = this.datasetsToText(datasets, this.datasetsController);
    this.setTextareaContent(content);
    this.cachedDatasets = datasets;
  }

  /**
   * Sets the content of the textarea by rendering the given datasets to text.  Subclasses should override.
   * @param datasets The datasets to render.
   * @return {*}
   */
  datasetsToText(datasets) {
    throw new LotivisUnimplementedMethodError(`Subclasses should override.`);
  }
}
