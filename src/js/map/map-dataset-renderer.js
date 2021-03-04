import {Color} from "../shared/colors";
import {combineByLocation} from "../data-juggle/dataset-combine";
import {log_debug} from "../shared/debug";

export class MapDatasetRenderer {

  constructor(mapChart) {

    /**
     * Iterates the datasets per stack and draws them on svg.
     */
    this.renderDatasets = function () {
      if (!mapChart.geoJSON) return;
      if (!mapChart.datasetController) return;

      let stackNames = mapChart.datasetController.stacks;
      let combinedData = mapChart.combinedData;

      // reset colors
      mapChart.svg
        .selectAll('path')
        .attr('fill', 'white')
        .attr('fill-opacity', '.5');

      for (let index = 0; index < stackNames.length; index++) {

        let stackName = stackNames[index];
        let dataForStack = combinedData.filter(data => data.stack === stackName);
        let max = d3.max(dataForStack, item => item.value);
        let color = Color.colorsForStack(index)[0];

        for (let index = 0; index < dataForStack.length; index++) {
          let datasetEntry = dataForStack[index];
          let id = datasetEntry.location;

          mapChart.svg
            .selectAll('path')
            .filter(item => String(item.properties.code) === String(id))
            .attr('fill', color.rgbString())
            .attr('fill-opacity', datasetEntry.value / max);

        }
      }
    };
  }
}
