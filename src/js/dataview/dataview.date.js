import {DatasetsController} from "../datasets.controller/datasets.controller";
import {dateToItemsRelation} from "../data.juggle/data.relations";
import {createStackModel} from "../data.juggle/data.stacks";
import {copy} from "../shared/copy";
import {combineDatasetsByRatio} from "../data.juggle/data.combine.ratio";
import {extractDatesFromDatasets} from "../data.juggle/data.extract";
import "../datasets.controller/datasets.controller.cache";
import {lotivis_log} from "../shared/debug";

/**
 * Returns a new generated DateDataview for the current enabled samples of dataset of this controller.
 */
DatasetsController.prototype.getDateDataview = function (groupSize) {

  let cachedDataView = this.getCached('date');
  if (cachedDataView) {
    lotivis_log('using cached');
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
  dataView.dateToItemsRelationPresented = dateToItemsRelation(enabledDatasets, dateAccess);
  dataView.datasetStacks = createStackModel(this, datasets, dataView.dateToItemsRelation);
  dataView.datasetStacksPresented = createStackModel(this, enabledDatasets, dataView.dateToItemsRelationPresented);

  dataView.max = d3.max(dataView.datasetStacksPresented, function (stack) {
    return d3.max(stack, function (series) {
      return d3.max(series.map(item => item['1']));
    });
  });

  dataView.dates = extractDatesFromDatasets(enabledDatasets);
  dataView.enabledStacks = this.snapshot.stacks;

  this.setCached(dataView, 'date');

  return dataView;
};
