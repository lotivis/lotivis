import {getFilename} from "../shared/filname";
import {trimByChar} from "../shared/trim";

/**
 *
 * @param url
 * @param extractItemBlock
 * @returns {Promise<[]>}
 */
export function parseCsv(
  url,
  extractItemBlock = function (components) {
    return {date: components[0], value: components[1]};
  }) {

  let name = getFilename(url);
  let datasets = [];

  return fetch(url)
    .then(function (response) {
      return response.text();
    })
    .then(function (text) {
      datasets.csv = text;
      let lines = text.split('\n');
      let headline = lines.shift();
      let headlines = headline.split(',');
      headlines.shift(); // drop first column

      for (let index = 0; index < headlines.length; index++) {
        datasets.push({
          label: trimByChar(headlines[index], "\""),
          stack: trimByChar(headlines[index], "\""),
          data: []
        });
      }

      for (let index = 0; index < lines.length; index++) {
        let line = String(lines[index]);
        let components = line.split(',');
        if (components.length < 2) continue;
        let date = components.shift();

        for (let componentIndex = 0; componentIndex < components.length; componentIndex++) {
          let dataset = datasets[componentIndex];
          let data = dataset.data;
          data.push({
            date: trimByChar(date, "\""),
            value: Number(trimByChar(components[componentIndex], "\""))
          });
          dataset.data = data;
          datasets[componentIndex] = dataset;
        }
      }

      return datasets;
    });
}
