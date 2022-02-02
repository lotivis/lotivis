// http://bl.ocks.org/Rokotyan/0556f8facbaf344507cdc45dc3622177
import * as d3 from "d3";
import { postfix } from "./affix";
import { downloadURL, element } from "./download.js";
import { ltv_debug, runsInBrowser } from "./debug";

/**
 * Parses a String from the given (D3.js) SVG node.
 *
 * @param svgNode The node of the SVG.
 * @returns {string} The parsed String.
 */
function svgString(svgNode) {
  console.log("svgNode", svgNode);
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

function svgString2Image(svgString, width, height, callback) {
  // Convert SVG string to samples URL
  let imageSource =
    "data:image/svg+xml;base64," +
    btoa(unescape(encodeURIComponent(svgString)));

  let canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  let ctx = canvas.getContext("2d");
  let image = new Image();
  image.onload = function () {
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);
    if (callback) callback(canvas.toDataURL("image/png"));
  };

  image.src = imageSource;
}

/**
 * Returns the size of the viewBox or the normal size of the given svg element.
 *
 * @param svgElement The svg element.
 * @returns {number[]} The size [width, height].
 */
function svgOriginalSize(svgElement) {
  if (!svgElement || !svgElement.viewBox)
    return console.log("missing viewBox: " + svgElement);
  let vBBV = svgElement.viewBox.baseVal;
  if (vBBV.width !== 0 && vBBV.height !== 0) {
    return [vBBV.width, vBBV.height];
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
export function svgDownload(selector, filename, callback) {
  let el = element(selector);
  let size = svgOriginalSize(el);
  let svgRaw = svgString(el);

  svgString2Image(svgRaw, 2 * size[0], 2 * size[1], function (dataURL) {
    downloadURL(dataURL, postfix(filename || "image", ".png"));
    if (callback) callback();
    // fetch(dataURL)
    //   .then((res) => res.blob())
    //   .then(function (dataBlob) {
    //     download(dataBlob, filename);
    //   });
  });
}
