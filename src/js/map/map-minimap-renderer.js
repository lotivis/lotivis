/**
 *
 * @class MapMinimapRenderer
 */
import {log_debug} from "../shared/debug";

export class MapMinimapRenderer {

  /**
   * Creates a new instance of MapMinimapRenderer.
   *
   * @param mapChart The parental map chart.
   */
  constructor(mapChart) {

    this.render = function () {
      let miniMapFeatures = mapChart.minimapFeatureCodes;
      log_debug('miniMapFeatures', miniMapFeatures);
    };
  }
}
