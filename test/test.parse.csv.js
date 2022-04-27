import assert from "assert";
import * as samples from "./sample.data.js";
import { csvParse, csvFormat } from "../src/js/parse/parse.csv.js";

describe("parse csv custom", function () {
    let content = samples.read("data.csv.custom.csv");
    let dataController = csvParse(content);

    it("parses the data", function () {
        assert.ok(dataController);
    });

    it("data has correct length", function () {
        assert.strictEqual(dataController.data().length, 10);
    });

    it("data has correct amount of dates", function () {
        assert.strictEqual(dataController.dates().length, 5);
    });
});
