const assert = require("assert");
const arrayExtension = require("../src/js/shared/extension.array");

describe("arrays", function() {
  it("have a known `first` function", function() {
    [].first();
  });

  it("have a known `last` function", function() {
    [].last();
  });

  it("the `first` function returns the first value", function() {
    assert.strictEqual([1, 2, 3].first(), 1);
  });

  it("the `last` function returns the last value", function() {
    assert.strictEqual([1, 2, 3].last(), 3);
  });
});
