import assert from "assert";
import { prefix, postfix } from "../src/js/common/helpers.js";

describe("prefix", function () {
    it("appends prefix if neccessarry", function () {
        let result = prefix("source", "prefix-");
        assert.strictEqual(result, "prefix-source");
    });

    it("does not add prefix if already existing", function () {
        let result = prefix("prefix-source", "prefix-");
        assert.strictEqual(result, "prefix-source");
    });

    it("does nothing with an empty prefix", function () {
        let result = prefix("source");
        assert.strictEqual(result, "source");
    });
});

describe("postfix", function () {
    it("appends extension if neccessarry", function () {
        let result = postfix("source", ".extension");
        assert.strictEqual(result, "source.extension");
    });

    it("does not append extension if already existing", function () {
        let result = postfix("source.extension", ".extension");
        assert.strictEqual(result, "source.extension");
    });

    it("does nothing with an empty appendix", function () {
        let result = postfix("source");
        assert.strictEqual(result, "source");
    });
});
