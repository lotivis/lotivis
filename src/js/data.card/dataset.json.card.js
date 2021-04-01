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
  }

  textToDatasets(text) {
    if (text === "") return [];
    return JSON.parse(text.trim());
  }

  datasetsToText(datasets) {
    return JSON.stringify(datasets, null, 2);
  }
}
