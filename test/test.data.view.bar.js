import assert from "assert";
import * as samples from "./sample.data.js";
import { bar } from "../src/js/bar.js";
import { parseDatasets } from "../src/js/parse/parse.json.js";

describe("dataView plot chart", function () {
    let json = samples.readJSON("data.json");
    let dc = parseDatasets(json);
    let chart = bar();
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

    it("has the correct dates", function () {
        assert.deepStrictEqual(dataView.dates, [2001, 2002, 2003]);
    });
});
