import {log_debug} from "../shared/debug";

export async function parseCSV(
  url,
  extractItemBlock = function (components) {
    return {date: components[0], value: components[1]};
  }) {

  let name = getFilename(url);
  let dataset = {
    label: name,
    stack: name,
    data: []
  };

  return fetch(url)
    .then(function (response) {
      return response.text();
    })
    .then(function (text) {
      let lines = text.split('\n');

      // drop first line
      lines.shift();
      dataset.data = lines
        .map(line => line.split(',').map(word => trimByChar(word, '"')))
        .filter(components => components.length > 0)
        .map(components => extractItemBlock(components))
        .filter(item => item.value && item.date);

      return dataset;
    });
}

function trimByChar(string, character) {
  const first = [...string].findIndex(char => char !== character);
  const last = [...string].reverse().findIndex(char => char !== character);
  return string.substring(first, string.length - last);
}

function getFilename(url) {
  return url.substring(url.lastIndexOf('/') + 1);
}
