const assert = require("assert");
const samples = require("./sample.data");
const lotivis = require("../dist/lotivis.test");

describe("create geojson from data", function () {
  let json = samples.readJSON("sample.flat.json");
  let data = lotivis.Data(json);
  let geoJSON = lotivis.createGeoJSON(data);

  it("loads the data", function () {
    assert.ok(data);
  });

  it("creates a geojson", function () {
    assert.ok(geoJSON);
  });

  it("creates features of a geojson", function () {
    assert.ok(geoJSON.features);
  });

  it("has the right amount of features", function () {
    assert.equal(geoJSON.features.length, 3);
  });
});
