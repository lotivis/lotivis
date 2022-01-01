const fs = require("fs");

function read(name) {
  return fs.readFileSync("./test/samples/" + name, { encoding: "utf8" });
}

function readJSON(name) {
  return JSON.parse(read(name) || "");
}

// export default read;

exports.read = read;
exports.readJSON = readJSON;
