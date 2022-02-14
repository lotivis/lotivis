import assert from "assert";
import * as samples from "./sample.data.js";
import * as lotivis from "./lotivis.test.js";

// https://stackoverflow.com/questions/70579/what-are-valid-values-for-the-id-attribute-in-html
// ids must not contain whitespaces
// ids should avoid ".", ":" and "/"

describe("safe id", function () {
    let safeId = lotivis.safeId;

    it("must not contain whitespaces", function () {
        assert.strictEqual(safeId("my safe id"), "my-safe-id");
    });

    it("must not contain .", function () {
        assert.strictEqual(safeId("my.safe.id"), "my-safe-id");
    });

    it("must not contain :", function () {
        assert.strictEqual(safeId("my:safe:id"), "my-safe-id");
    });

    it("must not contain /", function () {
        assert.strictEqual(safeId("my/safe/id"), "my-safe-id");
    });

    it("does nothing with an already safe id", function () {
        assert.strictEqual(safeId("my-safe-id"), "my-safe-id");
    });
});
