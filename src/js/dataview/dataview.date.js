import { DatasetsController } from "../datasets.controller/datasets.controller";
import { dateToItemsRelation } from "../data.juggle/data.relations";
import { createBarStackModel } from "../data.juggle/data.stacks";
import { copy } from "../shared/copy";
import { combineDatasetsByRatio } from "../data.juggle/data.combine.ratio";
import { extractDatesFromDatasets } from "../data.juggle/data.extract";
import "../datasets.controller/datasets.controller.cache";
import * as d3 from "d3";

/**
 * Returns a new generated DateDataview for the current enabled samples of dataset of this controller.
 */
DatasetsController.prototype.getDateDataview = function (groupSize) {
  let cachedDataView = this.getCached("date");
  if (cachedDataView) {
    return cachedDataView;
  }

  let dateAccess = this.dateAccess;
  let datasets = copy(this.datasets);
  let enabledDatasets = copy(this.filteredDatasets() || datasets);
  let dataView = {};
  let saveGroupSize = groupSize || 1;

  dataView.groupSize = saveGroupSize;
  if (saveGroupSize <= 1) {
    dataView.datasets = datasets;
    dataView.enabledDatasets = enabledDatasets;
  } else {
    datasets = combineDatasetsByRatio(datasets, saveGroupSize);
    enabledDatasets = combineDatasetsByRatio(enabledDatasets, saveGroupSize);
    dataView.datasets = datasets;
  }

  dataView.dateToItemsRelation = dateToItemsRelation(datasets, dateAccess);
  dataView.dateToItemsRelationPresented = dateToItemsRelation(
    enabledDatasets,
    dateAccess
  );
  dataView.datasetStacks = createBarStackModel(
    this,
    datasets,
    dataView.dateToItemsRelation
  );
  dataView.datasetStacksPresented = createBarStackModel(
    this,
    enabledDatasets,
    dataView.dateToItemsRelationPresented
  );

  dataView.max = d3.max(dataView.datasetStacksPresented, function (stack) {
    return d3.max(stack.series, function (serie) {
      return d3.max(
        serie.map((item) => {
          // console.log("item", item.data);
          return item["1"];
        })
      );
    });
  });

  dataView.dates = extractDatesFromDatasets(enabledDatasets);
  dataView.enabledStacks = this.snapshot.stacks;

  this.setCached(dataView, "date");

  return dataView;
};
