import * as d3 from "d3";
import { appendExtensionIfNeeded } from "./filename";
import {
  getOriginalSizeOfSVG,
  getSVGString,
  svgString2Image,
} from "./screenshot";

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
    anchor.click();
  }
}

/**
 * Initiates a download of the PNG image of the SVG with the given selector (id).
 *
 * @param selector The id of the SVG element to create the image of.
 * @param filename The name of the file which is been downloaded.
 */
export function downloadImage(selector, filename) {
  // console.log('selector:' + selector);
  // console.log('filename:' + filename);
  let svgElement = d3.select("#" + selector);
  let node = svgElement.node();
  let size = getOriginalSizeOfSVG(node);
  let svgString = getSVGString(node);
  let _filename = filename || "image";

  svgString2Image(svgString, 2 * size[0], 2 * size[1], function (dataURL) {
    // console.log('dataURL:' + dataURL);
    fetch(dataURL)
      .then((res) => res.blob())
      .then(function (dataBlob) {
        let saveFilename = appendExtensionIfNeeded(_filename, "png");

        // console.log('saveFilename:' + saveFilename);

        downloadBlob(dataBlob, saveFilename);
      });
  });
}
