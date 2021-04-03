import {DatasetsController} from "../data/datasets.controller";
import {dateToItemsRelation} from "../data.juggle/dataset.relations";
import {createStackModel} from "../data.juggle/dataset.stacks";
import {copy} from "../shared/copy";
import {combineDatasetsByRatio} from "../data.juggle/dataset.combine.ratio";
import {extractDatesFromDatasets} from "../data.juggle/dataset.extract";
import {combine} from "../data.juggle/dataset.combine";
import {flatDatasets} from "../data.juggle/dataset.flat";
import {createDatasets} from "../data.juggle/dataset.create";

/**
 * Returns a new generated DateDataview for the current enabled samples of dataset of this controller.
 */
DatasetsController.prototype.getDateDataviewCombinedStacks = function (groupSize) {
  let dateAccess = this.dateAccess;
  let workingDatasets = copy(this.workingDatasets);
  let enabledDatasets = copy(this.enabledDatasets() || workingDatasets);
  let dataview = {};
  let saveGroupSize = groupSize || 1;

  workingDatasets.forEach(function (dataset) {
    dataset.label = dataset.stack || dataset.label;
  });

  enabledDatasets.forEach(function (dataset) {
    dataset.label = dataset.stack || dataset.label;
  });

  workingDatasets = createDatasets(combine(flatDatasets(workingDatasets)));
  enabledDatasets = createDatasets(combine(flatDatasets(enabledDatasets)));

  dataview.groupSize = saveGroupSize;
  if (saveGroupSize <= 1) {
    dataview.datasets = workingDatasets;
    dataview.enabledDatasets = enabledDatasets;
  } else {
    workingDatasets = combineDatasetsByRatio(workingDatasets, saveGroupSize);
    enabledDatasets = combineDatasetsByRatio(enabledDatasets, saveGroupSize);
    dataview.datasets = workingDatasets;
  }

  dataview.dateToItemsRelation = dateToItemsRelation(workingDatasets, dateAccess);
  dataview.dateToItemsRelationPresented = dateToItemsRelation(enabledDatasets, dateAccess);
  dataview.datasetStacks = createStackModel(this, workingDatasets, dataview.dateToItemsRelation);
  dataview.datasetStacksPresented = createStackModel(this, enabledDatasets, dataview.dateToItemsRelationPresented);

  dataview.max = d3.max(dataview.datasetStacksPresented, function (stack) {
    return d3.max(stack, function (series) {
      return d3.max(series.map(item => item['1']));
    });
  });

  dataview.dates = extractDatesFromDatasets(enabledDatasets);
  dataview.enabledStacks = this.enabledStacks();

  return dataview;
};
