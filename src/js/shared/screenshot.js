import {log_debug} from "./debug";

// Heavily inspired by:
// https://stackoverflow.com/questions/5433806/convert-embedded-svg-to-png-in-place
// https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an

/**
 * Creates an PNG image from the given svg element and initiates a download of the PNG image.
 *
 * @param selector The id of the svg element.
 * @param filename The name of file which is downloaded.
 * @param size The original size of the svg.
 */
export function downloadImage(selector, filename) {
  let correctFilename = appendPNGIfNeeded(filename);
  let svgElement = document.getElementById(selector);
  let size = getOriginalSizeOfSVG(svgElement);
  let data = svgToPNGData(svgElement, size);
  downloadData(data, correctFilename);
}

/**
 * Creates an PNG image from the given svg.
 *
 * @param target The target svg element.
 * @param size The preferred size of the element.
 * @returns {string} Returns the PNG data.
 */
function svgToPNGData(target, size) {
  let width = size[0];
  let height = size[1];

  // Flatten CSS styles into the SVG
  for (let i = 0; i < target.childNodes.length; i++) {
    let child = target.childNodes[i];
    let cssStyle = window.getComputedStyle(child);
    if (cssStyle) child.style.cssText = cssStyle.cssText;
  }

  // construct an SVG image
  let svgData = '<svg xmlns="http://www.w3.org/2000/svg" width="' + width +
    '" height="' + height + '">' + target.innerHTML + '</svg>';
  let img = new Image();
  img.src = "data:image/svg+xml," + encodeURIComponent(svgData);

  // draw the SVG image to a canvas
  let canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  // draw canvas on contex
  let context = canvas.getContext("2d");
  context.drawImage(img, 0, 0);

  // return the canvas's data
  return canvas.toDataURL("image/png");
}

/**
 * Creates and appends an anchor linked to the given data which is then immediately clicked.
 *
 * @param data The data to be downloaded.
 * @param filename The name of the file.
 */
function downloadData(data, filename) {
  let anchor = document.createElement("a");
  anchor.href = data;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

/**
 * Returns the size of the viewBox or the normal size.
 *
 * @param svgElement The svg element.
 * @returns {number[]} The size [width, height].
 */
function getOriginalSizeOfSVG(svgElement) {
  let viewBoxBaseValue = svgElement.viewBox.baseVal;
  if (viewBoxBaseValue.width !== 0 && viewBoxBaseValue.height !== 0) {
    return [
      viewBoxBaseValue.width,
      viewBoxBaseValue.height
    ];
  } else {
    return [
      svgElement.width.baseVal.value,
      svgElement.height.baseVal.value,
    ];
  }
}

/**
 * Appends '.png' to the given string if the given string not already has this extension.
 *
 * @param filename The filename with or without the '.png' extension.
 * @returns {*|string} The filename with a '.png' extension.
 */
function appendPNGIfNeeded(filename) {
  return filename.endsWith('.png') ? filename : `${filename}.png`;
}
