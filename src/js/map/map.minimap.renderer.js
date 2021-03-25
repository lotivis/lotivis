/**
 *
 * @class MapMinimapRenderer
 */
import {verbose_log} from "../shared/debug";

export class MapMinimapRenderer {

  /**
   * Creates a new instance of MapMinimapRenderer.
   *
   * @param mapChart The parental map chart.
   */
  constructor(mapChart) {

    this.render = function () {
      let miniMapFeatures = mapChart.minimapFeatureCodes;
      // log_debug('miniMapFeatures', miniMapFeatures);
    };
  }
}
