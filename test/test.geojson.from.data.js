import assert from "assert";
import * as samples from "./sample.data.js";
import { DataController } from "../src/js/controller.js";
import { generate } from "../src/js/geojson/generate.js";

describe("create geojson from data", function () {
    let json = samples.readJSON("data.flat.json");
    let data = new DataController(json);
    let geoJSON = generate(data.locations());

    it("loads the data", function () {
        assert.ok(data);
    });

    it("creates a geojson", function () {
        assert.ok(geoJSON);
    });

    it("creates features of a geojson", function () {
        assert.ok(geoJSON.features);
    });

    it("has the right amount of features", function () {
        assert.equal(geoJSON.features.length, 3);
    });
});
