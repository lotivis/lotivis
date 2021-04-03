import {appendExtensionIfNeeded} from "./filname";
import {getOriginalSizeOfSVG, getSVGString, svgString2Image} from "./screenshot";

/**
 * Creates and appends an anchor linked to the given samples which is then immediately clicked.
 *
 * @param blob The samples to be downloaded.
 * @param filename The name of the file.
 */
export function downloadBlob(blob, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    let anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
}

/**
 * Initiates a download of a JSON file with the given content and the given filename.
 * @param jsonString The JSON content.
 * @param filename The filename of the file to be downloaded. Will append '.json' extension
 * if needed.
 */
export function downloadJSON(jsonString, filename) {
  let blob = new Blob([jsonString], {type: 'text/json'});
  let saveFilename = appendExtensionIfNeeded(filename, 'json');
  downloadBlob(blob, saveFilename);
}

export function downloadCSV(jsonString, filename) {
  let blob = new Blob([jsonString], {type: 'text/csv'});
  let saveFilename = appendExtensionIfNeeded(filename, 'csv');
  downloadBlob(blob, saveFilename);
}

/**
 * Initiates a download of the PNG image of the SVG with the given selector (id).
 *
 * @param selector The id of the SVG element to create the image of.
 * @param filename The name of the file which is been downloaded.
 */
export function downloadImage(selector, filename) {
  let svgElement = d3.select('#' + selector);
  let node = svgElement.node();
  let size = getOriginalSizeOfSVG(node);
  let svgString = getSVGString(node);
  svgString2Image(svgString, 2 * size[0], 2 * size[1], function (dataURL) {
    fetch(dataURL)
      .then(res => res.blob())
      .then(function (dataBlob) {
        let saveFilename = appendExtensionIfNeeded(filename, 'png');
        downloadBlob(dataBlob, saveFilename);
      });
  });
}
