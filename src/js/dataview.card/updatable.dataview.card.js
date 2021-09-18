import {TextareaCard} from "../shared.components/textarea.card";
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
    // parent.title = parent.title || 'UpdatableDataviewCard';
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
    } else if (this.config && this.config.updateSensible === false) {
      lotivis_log(`[lotivis]  NOT sensible (Config) ${this}. Reason '${reason}'.`);
      return;
    } else if (!datasetsController) {
      lotivis_log(`[lotivis]  NO controller ${this}. Reason '${reason}'.`);
      return;
    }

    let datasets = datasetsController.datasets;
    let content = this.datasetsToText(datasetsController, datasets);

    this.setTextareaContent(content);
    this.cachedDatasets = datasets;

    lotivis_log(`[lotivis]  Update ${this}. Reason '${reason}'.`);
  }

  /**
   * Sets the content of the textarea by rendering the given datasets to text.  Subclasses should override.
   * @param controller The datasets controller.
   * @param datasets The datasets to render.
   * @return {*}
   */
  datasetsToText(controller, datasets) {
    throw new LotivisUnimplementedMethodError(`Subclasses should override.`);
  }
}
