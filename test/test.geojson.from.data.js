import assert from "assert";
import * as samples from "./sample.data.js";
import * as lotivis from "./lotivis.test.js";

describe("create geojson from data", function () {
    let json = samples.readJSON("sample.flat.json");
    let data = new lotivis.DataController(json);
    let geoJSON = lotivis.createGeoJSON(data.locations());

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
