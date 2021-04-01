import {DatasetsController} from "./datasets.controller";
import {copy} from "../shared/copy";
import {flatDatasets} from "../data-juggle/dataset.flat";
import {renderCSV} from "../parse/renderCSV";

/**
 * Returns a new generated CSV Dataview for the current enabled data of dataset of this controller.
 */
DatasetsController.prototype.getCSVDataview = function () {
  let datasets = copy(this.datasets);
  let dataview = {};
  dataview.flatData = flatDatasets(datasets);
  dataview.csv = renderCSV(datasets);
  return dataview;
};
