import {UpdatableDataviewCard} from "./updatable.dataview.card";

/**
 * A card containing a textarea which contains the JSON text of a dataset collection.
 * @class DataviewCard
 * @extends UpdatableDataviewCard
 */
export class DataviewCard extends UpdatableDataviewCard {

  /**
   * Creates a new instance of DataviewCard.
   * @param parent The parental element or a selector (id).
   */
  constructor(parent) {
    super(parent);
    if (!this.config) this.config = {};
    this.config.updatesHeight = this.config.updatesHeight || true;
    this.disableTextarea();
  }

  datasetsToText(datasets) {
    if (!this.datasetsController) return "No datasets controller.";
    let dataview = this.getDataview();
    return JSON.stringify(dataview, null, 2);
  }

  getDataview() {
    // empty
  }
}

export class DataviewDateCard extends DataviewCard {
  getTitle() {
    return 'Dataview Date';
  }

  getDataview() {
    return this.datasetsController.getDateDataview();
  }
}

export class DataViewPlotCard extends DataviewCard {
  getTitle() {
    return 'Dataview Plot';
  }

  getDataview() {
    return this.datasetsController.getPlotDataview();
  }
}

export class DataViewMapCard extends DataviewCard {
  getTitle() {
    return 'Dataview Map';
  }

  getDataview() {
    return this.datasetsController.getLocationDataview();
  }
}

export class DataviewFlatCard extends DataviewCard {
  getTitle() {
    return 'Flat Data';
  }

  getDataview() {
    return this.datasetsController.flatData;
  }
}
