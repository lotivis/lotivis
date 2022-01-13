const assert = require("assert");
const samples = require("./sample.data");
const lotivis = require("../dist/lotivis.test");

describe("parse flat data", function () {
  let json = samples.readJSON("sample.flat.json");
  let data = lotivis.Data(json);

  it("should have the right length", function () {
    assert.strictEqual(data.length, 9);
  });

  it("has the right labels", function () {
    let labels = data.labels();
    assert.ok(labels.includes("label_1"));
    assert.ok(labels.includes("label_2"));
    assert.ok(labels.includes("label_3"));
  });

  it("has the right dates", function () {
    let dates = data.dates();
    assert.ok(dates.includes(2001));
    assert.ok(dates.includes(2002));
    assert.ok(dates.includes(2003));
  });
});
