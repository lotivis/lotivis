import assert from "assert";
import * as samples from "./sample.data.js";
import * as lotivis from "./lotivis.test.js";

describe("parse csv", function () {
    let content = samples.read("sample.csv");
    let dataController = lotivis.csvParse(content);

    it("parses the data", function () {
        assert.ok(dataController);
    });

    it("data has correct length", function () {
        assert.strictEqual(dataController.data().length, 9);
    });
});

describe("render csv", function () {
    let content = samples.read("sample.csv");
    let dataController = lotivis.csvParse(content);
    let rendered = lotivis.csvRender(dataController);

    it("renders correct csv", function () {
        assert.equal(content, rendered);
    });
});
