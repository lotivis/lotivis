const assert = require("assert");
const lotivis = require("../dist/lotivis.test");

describe("isValue", function () {
  it("evaluates a number greater 0", function () {
    assert.strictEqual(lotivis.isValue(1), true);
  });

  it("evaluates 0", function () {
    assert.strictEqual(lotivis.isValue(0), true);
  });

  it("NOT evaluates an empty String", function () {
    assert.strictEqual(lotivis.isValue(""), false);
  });

  it("NOT evaluates null", function () {
    assert.strictEqual(lotivis.isValue(null), false);
  });

  it("NOT evaluates undefined", function () {
    assert.strictEqual(lotivis.isValue(undefined), false);
  });

  it("NOT evaluates undefined", function () {
    assert.strictEqual(lotivis.isValue(), false);
  });
});
