/**
 * @class DataviewCache
 */
import {lotivis_log} from "../shared/debug";


export class DataviewCache {

  /**
   * Creates a new instance of DataviewCache
   */
  constructor() {
    this.content = {};

    this.getDataview = function (type, locationFilters, dateFilters, datasetFilters) {
      let name = createName(type, locationFilters, dateFilters, datasetFilters);
      return this.content[name];
    }

    this.setDataview = function (dataview, type, locationFilters, dateFilters, datasetFilters) {
      let name = createName(type, locationFilters, dateFilters, datasetFilters);
      this.content[name] = dataview;
      lotivis_log(`this.content: `, this.content);
    }

    function createName(type, locationFilters, dateFilters, datasetFilters) {
      return type +
        locationFilters +
        dateFilters +
        datasetFilters;
    }
  }
}
