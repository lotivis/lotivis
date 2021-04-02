import {DatasetsController} from "../data/datasets.controller";
import {dateToItemsRelation} from "../data.juggle/dataset.relations";
import {createStackModel} from "../data.juggle/dataset.stacks";
import {copy} from "../shared/copy";
import {combineDatasetsByRatio} from "../data.juggle/dataset.combine.ratio";

/**
 * Returns a new generated DateDataview for the current enabled data of dataset of this controller.
 */
DatasetsController.prototype.getDateDataview = function () {
  let dateAccess = this.dateAccess;
  let workingDatasets = copy(this.workingDatasets);
  let enabledDatasets = copy(this.enabledDatasets() || workingDatasets);
  let dateGroupRatio = 2;
  let dataview = {};

  dataview.dateGroupRatio = dateGroupRatio;
  dataview.datasets = combineDatasetsByRatio(workingDatasets, dateGroupRatio);
  dataview.dateToItemsRelation = dateToItemsRelation(workingDatasets, dateAccess);
  dataview.dateToItemsRelationPresented = dateToItemsRelation(enabledDatasets, dateAccess);
  dataview.datasetStacks = createStackModel(this, workingDatasets, dataview.dateToItemsRelation);
  dataview.datasetStacksPresented = createStackModel(this, enabledDatasets, dataview.dateToItemsRelationPresented);
  dataview.max = d3.max(dataview.datasetStacksPresented, function (stack) {
    return d3.max(stack, function (series) {
      return d3.max(series.map(item => item['1']));
    });
  });
  return dataview;
};
