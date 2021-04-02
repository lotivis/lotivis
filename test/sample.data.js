const fs = require('fs');

function read(name) {
  return fs.readFileSync('./test/samples/' + name, {encoding: 'utf8'});
}

function readJSON(name) {
  return JSON.parse(read(name) || "");
}

module.exports.read = read;
module.exports.readJSON = readJSON;
