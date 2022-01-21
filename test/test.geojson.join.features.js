const assert = require("assert");
const samples = require("./sample.data");
const lotivis = require("../dist/lotivis.test");

describe("join features of geojson", function () {
  let goeJSONBerlin = samples.readJSON("berlin.geojson");

  it("loads the geojson", function () {
    assert.ok(goeJSONBerlin);
  });

  it("the geojson has features", function () {
    assert.ok(goeJSONBerlin.features);
  });

  it("joins the features to one", function () {
    let joined = lotivis.joinFeatures(goeJSONBerlin);
    assert.ok(joined.features);
    assert.equal(joined.features.length, 1);
  });
});
