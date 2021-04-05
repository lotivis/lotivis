import {DataviewCard} from "./dataview.card";

/**
 * @class DataviewDatasetsControllerSelectionCard
 * @extends DataviewCard
 */
export class DataviewDatasetsControllerSelectionCard extends DataviewCard {

  /**
   * Creates a new instance of DataviewDatasetsControllerSelectionCard.
   */
  constructor(parent) {
    parent.title = parent.title || `DataviewDatasetsControllerSelectionCard`;
    super(parent);
  }

  datasetsToText(datasets) {
    return JSON.stringify(this.datasetsController.getSelection(), null, 2);
  }
}
