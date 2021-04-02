import {csvStringToArray} from "../shared/csv.to.array";
import {trimByChar} from "../shared/trim";
import {createDatasets} from "../data.juggle/dataset.create";

export function parseCSV(text) {
  let flatData = [];
  let arrays = csvStringToArray(text);
  let headlines = arrays.shift();

  for (let lineIndex = 0; lineIndex < arrays.length; lineIndex++) {
    let lineArray = arrays[lineIndex].map(element => trimByChar(element, `"`));
    flatData.push({
      label: lineArray[0],
      stack: lineArray[1],
      value: +lineArray[2],
      date: lineArray[3],
      location: lineArray[4]
    });
  }

  let datasets = createDatasets(flatData);
  datasets.csv = {
    content: text,
    headlines: headlines,
    lines: arrays,
  };
  return datasets;
}
