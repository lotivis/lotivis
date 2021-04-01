import {csvStringToArray} from "../shared/csv.to.array";
import {createDatasets} from "../data.juggle/dataset.create";
import {trimByChar} from "../shared/trim";

export function parseCSV2(text) {
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

  // let lines = text.split('\n');
  // let headline = lines.shift();
  // let headlines = headline.split(',');
  // headlines.shift(); // drop first column

  // for (let index = 0; index < headlines.length; index++) {
  //   datasets.push({
  //     label: trimByChar(headlines[index], "\""),
  //     stack: trimByChar(headlines[index], "\""),
  //     data: []
  //   });
  // }

  // for (let index = 0; index < lines.length; index++) {
  //   let line = String(lines[index]);
  //   let components = line.split(',');
  //   if (components.length < 2) continue;
  //   let date = components.shift();
  //
  //   for (let componentIndex = 0; componentIndex < components.length; componentIndex++) {
  //     let dataset = datasets[componentIndex];
  //     let data = dataset.data;
  //     data.push({
  //       date: trimByChar(date, "\""),
  //       value: Number(trimByChar(components[componentIndex], "\""))
  //     });
  //     dataset.data = data;
  //     datasets[componentIndex] = dataset;
  //   }
  // }

  return datasets;
}

/**
 *
 * @param url
 * @param extractItemBlock
 * @returns {Promise<[]>}
 */
export function fetchCSV(
  url,
  extractItemBlock = function (components) {
    return {date: components[0], value: components[1]};
  }) {

  return fetch(url)
    .then(response => response.text())
    .then(parseCSV2);
}
