const assert = require("assert");
const lotivis = require("../dist/lotivis.tests");

describe("appendExtensionIfNeeded", function() {
  it("appends an extension", function() {
    const filename = lotivis.appendExtensionIfNeeded("myFile", "ext");
    assert.strictEqual(filename, "myFile.ext");
  });

  it("appends not an extension if not necessary", function() {
    const filename = lotivis.appendExtensionIfNeeded("myFile.ext", "ext");
    assert.strictEqual(filename, "myFile.ext");
  });

  it("appends nothing if extension is empty", function() {
    const filename = lotivis.appendExtensionIfNeeded("myFile", "");
    assert.strictEqual(filename, "myFile");
  });

  it("appends nothing if extension is a dot", function() {
    const filename = lotivis.appendExtensionIfNeeded("myFile", ".");
    assert.strictEqual(filename, "myFile");
  });
});
