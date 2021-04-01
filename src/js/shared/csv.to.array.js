/*
Following code from:
https://gist.github.com/Jezternz/c8e9fafc2c114e079829974e3764db75

We use this function to save parse a CSV file.
 */

export const csvStringToArray = strData => {
  const objPattern = new RegExp(("(\\,|\\r?\\n|\\r|^)(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^\\,\\r\\n]*))"), "gi");
  let arrMatches = null, arrData = [[]];
  while (arrMatches = objPattern.exec(strData)) {
    if (arrMatches[1].length && arrMatches[1] !== ",") arrData.push([]);
    arrData[arrData.length - 1].push(arrMatches[2] ?
      arrMatches[2].replace(new RegExp("\"\"", "g"), "\"") :
      arrMatches[3]);
  }
  return arrData;
};
