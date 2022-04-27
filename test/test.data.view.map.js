import assert from "assert";
import * as samples from "./sample.data.js";
import { map } from "../src/js/map.js";
import { parseDatasets } from "../src/js/parse/parse.json.js";

describe("dataView plot chart", function () {
    let json = samples.readJSON("data.json");
    let dc = parseDatasets(json);
    let chart = map();
    let dataView = chart.dataController(dc).dataView();

    it("has the correct labels", function () {
        assert.deepStrictEqual(dataView.labels, [
            "label_1",
            "label_2",
            "label_3",
        ]);
    });

    it("has the correct groups", function () {
        assert.deepStrictEqual(dataView.groups, [
            "label_1",
            "label_2",
            "label_3",
        ]);
    });

    it("has the correct locations", function () {
        assert.deepStrictEqual(dataView.locations, ["loc_1", "loc_2", "loc_3"]);
    });

    it("has the correct max value", function () {
        assert.strictEqual(dataView.maxLocation, 3);
    });

    it("dataset has the correct first date", function () {
        assert.strictEqual(dataView.maxLabel, 3);
    });

    it("dataset has the correct last date", function () {
        assert.strictEqual(dataView.maxGroup, 3);
    });
});
