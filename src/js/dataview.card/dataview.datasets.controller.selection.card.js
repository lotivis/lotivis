import {DataViewCard} from "./dataview.card";

/**
 * @class DataviewDatasetsControllerSelectionCard
 * @extends DataviewCard
 */
export class DataviewDatasetsControllerSelectionCard extends DataViewCard {

  /**
   * Creates a new instance of DataviewDatasetsControllerSelectionCard.
   */
  constructor(parent) {
    super(parent);
  }

  datasetsToText(datasets) {
    return JSON.stringify(this.datasetsController.getSelection(), null, 2);
  }
}
