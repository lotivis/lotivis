const assert = require("assert");
const lotivis = require("../dist/lotivis.test");

describe("postfix", function () {
  it("appends extension if neccessarry", function () {
    let result = lotivis.postfix("source", ".extension");
    assert.strictEqual(result, "source.extension");
  });

  it("does not append extension if already existing", function () {
    let result = lotivis.postfix("source.extension", ".extension");
    assert.strictEqual(result, "source.extension");
  });

  it("does nothing with an empty appendix", function () {
    let result = lotivis.postfix("source");
    assert.strictEqual(result, "source");
  });
});

describe("prefix", function () {
  it("appends prefix if neccessarry", function () {
    let result = lotivis.prefix("source", "prefix-");
    assert.strictEqual(result, "prefix-source");
  });

  it("does not add prefix if already existing", function () {
    let result = lotivis.prefix("prefix-source", "prefix-");
    assert.strictEqual(result, "prefix-source");
  });

  it("does nothing with an empty prefix", function () {
    let result = lotivis.prefix("source");
    assert.strictEqual(result, "source");
  });
});
