/**
 * @class DataViewCache
 */
export class DataViewCache {

  /**
   * Creates a new instance of DataViewCache.
   */
  constructor() {
    let content = {};

    /**
     * Creates an identifier for a cached data view with the given parameters.
     * @param type The type of the graph.
     * @param locationFilters The collection of filtered locations.
     * @param dateFilters The collection of filtered dates.
     * @param datasetFilters The collection of filtered datasets.
     * @returns {*}
     */
    function createName(type, locationFilters, dateFilters, datasetFilters) {
      return type + locationFilters + dateFilters + datasetFilters;
    }

    /**
     * Returns the cached data view for the given parameters.
     * @param type The type of the graph.
     * @param locationFilters The collection of filtered locations.
     * @param dateFilters The collection of filtered dates.
     * @param datasetFilters The collection of filtered datasets.
     * @returns {*}
     */
    this.getDataView = function (type, locationFilters, dateFilters, datasetFilters) {
      let name = createName(type, locationFilters, dateFilters, datasetFilters);
      return content[name];
    };

    /**
     * Inserts the given data view into the cache for the given parameters.
     * @param dataView The data view to cache.
     * @param type The type of the graph.
     * @param locationFilters The collection of filtered locations.
     * @param dateFilters The collection of filtered dates.
     * @param datasetFilters The collection of filtered datasets.
     */
    this.setDataView = function (dataView, type, locationFilters, dateFilters, datasetFilters) {
      let name = createName(type, locationFilters, dateFilters, datasetFilters);
      content[name] = dataView;
    };

    /**
     * Invalidates the cache.
     */
    this.invalidate = function () {
      content = {};
    };
  }
}
