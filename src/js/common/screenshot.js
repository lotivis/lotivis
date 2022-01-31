// http://bl.ocks.org/Rokotyan/0556f8facbaf344507cdc45dc3622177
import * as d3 from "d3";
import { download } from "./config";

/**
 * Parses a String from the given (D3.js) SVG node.
 *
 * @param svgNode The node of the SVG.
 * @returns {string} The parsed String.
 */
export function getSVGString(svgNode) {
  svgNode.setAttribute("xlink", "http://www.w3.org/1999/xlink");
  let cssStyleText = getCSSStyles(svgNode);
  appendCSS(cssStyleText, svgNode);

  let serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(svgNode);

  // Fix root xlink without namespace
  svgString = svgString.replace(/(\w+)?:?xlink=/g, "xmlns:xlink=");

  // Safari NS namespace fix
  svgString = svgString.replace(/NS\d+:href/g, "xlink:href");

  return svgString;

  function getCSSStyles(parentElement) {
    let selectorTextArr = [];

    // Add Parent element Id and Classes to the list
    selectorTextArr.push("#" + parentElement.id);
    for (let c = 0; c < parentElement.classList.length; c++) {
      if (!contains("." + parentElement.classList[c], selectorTextArr)) {
        selectorTextArr.push("." + parentElement.classList[c]);
      }
    }

    // Add Children element Ids and Classes to the list
    let nodes = parentElement.getElementsByTagName("*");
    for (let i = 0; i < nodes.length; i++) {
      let id = nodes[i].id;
      if (!contains("#" + id, selectorTextArr)) {
        selectorTextArr.push("#" + id);
      }

      let classes = nodes[i].classList;
      for (let c = 0; c < classes.length; c++) {
        if (!contains("." + classes[c], selectorTextArr)) {
          selectorTextArr.push("." + classes[c]);
        }
      }
    }

    // Extract CSS Rules
    let extractedCSSText = "";
    for (let i = 0; i < document.styleSheets.length; i++) {
      let s = document.styleSheets[i];

      try {
        if (!s.cssRules) continue;
      } catch (e) {
        if (e.name !== "SecurityError") throw e; // for Firefox
        continue;
      }

      let cssRules = s.cssRules;
      for (let r = 0; r < cssRules.length; r++) {
        if (contains(cssRules[r].selectorText, selectorTextArr)) {
          extractedCSSText += cssRules[r].cssText;
        }
      }
    }

    return extractedCSSText;

    function contains(str, arr) {
      return arr.indexOf(str) !== -1;
    }
  }

  function appendCSS(cssText, element) {
    let styleElement = document.createElement("style");
    styleElement.setAttribute("type", "text/css");
    styleElement.innerHTML = cssText;
    let refNode = element.hasChildNodes() ? element.children[0] : null;
    element.insertBefore(styleElement, refNode);
  }
}

/**
 *
 * @param svgString
 * @param width
 * @param height
 * @param callback
 */
export function svgString2Image(svgString, width, height, callback) {
  // Convert SVG string to samples URL
  let imageSource =
    "data:image/svg+xml;base64," +
    btoa(unescape(encodeURIComponent(svgString)));

  let canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  let context = canvas.getContext("2d");
  let image = new Image();
  image.onload = function () {
    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    let data = canvas.toDataURL("image/png");
    if (callback) callback(data);
  };

  image.src = imageSource;
}

/**
 * Returns the size of the viewBox or the normal size of the given svg element.
 *
 * @param svgElement The svg element.
 * @returns {number[]} The size [width, height].
 */
export function getOriginalSizeOfSVG(svgElement) {
  if (!svgElement || !svgElement.viewBox)
    return console.log("missing viewBox: " + svgElement);
  let viewBoxBaseValue = svgElement.viewBox.baseVal;
  if (viewBoxBaseValue.width !== 0 && viewBoxBaseValue.height !== 0) {
    return [viewBoxBaseValue.width, viewBoxBaseValue.height];
  } else {
    return [svgElement.width.baseVal.value, svgElement.height.baseVal.value];
  }
}

/**
 * Initiates a download of the PNG image of the SVG with the given selector (id).
 *
 * @param selector The id of the SVG element to create the image of.
 * @param filename The name of the file which is been downloaded.
 */
export function svgExport(selector, filename) {
  // console.log('selector:' + selector);
  // console.log('filename:' + filename);
  let svgElement = d3.select("#" + selector);
  if (svgElement.size() === 0)
    return console.info("no element for selector: " + selector);

  let node = svgElement.node();
  let size = getOriginalSizeOfSVG(node);
  let svgString = getSVGString(node);
  let _filename = filename || "image";

  svgString2Image(svgString, 2 * size[0], 2 * size[1], function (dataURL) {
    // console.log('dataURL:' + dataURL);
    fetch(dataURL)
      .then((res) => res.blob())
      .then(function (dataBlob) {
        let saveFilename = append(_filename, ".png");

        // console.log('saveFilename:' + saveFilename);

        download(dataBlob, saveFilename);
      });
  });
}
