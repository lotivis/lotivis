import assert from "assert";
import * as samples from "./sample.data.js";
import { plot } from "../src/js/plot.js";
import { parseDatasets } from "../src/js/parse/parse.json.js";

describe("dataView plot chart", function () {
    let json = samples.readJSON("data.json");
    let dc = parseDatasets(json);
    let chart = plot();

    let dataView = chart.dataController(dc).dataView();

    it("has the correct amout of dataset", function () {
        assert.strictEqual(dataView.datasets.length, 3);
    });

    it("has the correct labels", function () {
        assert.deepStrictEqual(dataView.labels, [
            "label_1",
            "label_2",
            "label_3",
        ]);
    });

    it("has the correct dates", function () {
        assert.deepStrictEqual(dataView.dates, [2001, 2002, 2003]);
    });

    it("has the correct max value", function () {
        assert.strictEqual(dataView.max, 3);
    });

    it("dataset has the correct first date", function () {
        assert.strictEqual(dataView.firstDate, 2001);
    });

    it("dataset has the correct last date", function () {
        assert.strictEqual(dataView.lastDate, 2003);
    });
});
