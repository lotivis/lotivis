import {DataViewCard} from "./dataview.card";

/**
 * @class DatasetsControllerCard
 *
 * @extends DataviewCard
 */
export class DatasetsControllerCard extends DataViewCard {

  /**
   * Creates a new instance of DatasetsControllerCard.
   */
  constructor(parent) {
    super(parent);
  }

  datasetsToText(datasets) {
    return JSON.stringify({
      labels: this.datasetsController.labels,
      stacks: this.datasetsController.stacks,
      dates: this.datasetsController.dates,
      locations: this.datasetsController.locations,
      filters: {
        locations: this.datasetsController.locationFilters,
        dates: this.datasetsController.dateFilters,
        datasets: this.datasetsController.datasetFilters,
      },
      selection: {},
      datasets: this.datasetsController.datasets,
      flatData: this.datasetsController.flatData,
      originalDatasets: this.datasetsController.originalDatasets,
      snapshot: this.datasetsController.snapshot
    }, null, 2);
  }
}
