import {DatasetsController} from "./datasets.controller";

DatasetsController.prototype.getCached = function (type) {
  return this.cache.getDataView(
    type,
    this.filters.locations,
    this.filters.dates,
    this.filters.labels
  );
};

DatasetsController.prototype.setCached = function (dataview, type) {
  return this.cache.setDataView(
    dataview,
    type,
    this.filters.locations,
    this.filters.dates,
    this.filters.labels
  );
};
