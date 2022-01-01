const assert = require("assert");
const samples = require("./sample.data");
const lotivis = require("../dist/lotivis.tests");

describe("renderCSV", function () {
  it("returns true comparing empty objects", function () {
    const dataset1 = samples.readJSON("sample.dataset.1.json");
    const csv = lotivis.renderCSV([dataset1]);
    const lines = csv.split("\n");
    assert.strictEqual(lines[0], "label,stack,value,date,location");
    assert.strictEqual(lines.length, 12);
  });
});
