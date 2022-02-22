import assert from "assert";
import { isValue } from "../src/js/common/values.js";

describe("isValue", function () {
    it("evaluates a number greater 0", function () {
        assert.strictEqual(isValue(1), true);
    });

    it("evaluates 0", function () {
        assert.strictEqual(isValue(0), true);
    });

    it("NOT evaluates an empty String", function () {
        assert.strictEqual(isValue(""), false);
    });

    it("NOT evaluates null", function () {
        assert.strictEqual(isValue(null), false);
    });

    it("NOT evaluates undefined", function () {
        assert.strictEqual(isValue(undefined), false);
    });

    it("NOT evaluates undefined", function () {
        assert.strictEqual(isValue(), false);
    });
});
