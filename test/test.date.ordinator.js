import assert from "assert";
import * as samples from "./sample.data.js";
import * as lotivis from "./lotivis.test.js";

describe("DATE_TO_NUMBER_ORDINATOR", function () {
    it("returns the correct numeric value", function () {
        let DATE_TO_NUMBER_ORDINATOR =
            lotivis.DateOrdinator.DATE_TO_NUMBER_ORDINATOR;
        assert.strictEqual(DATE_TO_NUMBER_ORDINATOR(2022), 2022);
        assert.strictEqual(DATE_TO_NUMBER_ORDINATOR("2022"), 2022);
    });
});

describe("GERMAN_DATE_ORDINATOR", function () {
    it("returns the correct numeric value", function () {
        let GERMAN_DATE_ORDINATOR = lotivis.DateOrdinator.GERMAN_DATE_ORDINATOR;
        let correctDates = [1640991600000, 1640995200000];
        assert.ok(correctDates.includes(GERMAN_DATE_ORDINATOR("1.1.2022")));
        assert.ok(correctDates.includes(GERMAN_DATE_ORDINATOR("01.01.2022")));
    });
});

describe("ISO_DATE_ORDINATOR", function () {
    it("returns the correct numeric value", function () {
        let ISO_DATE_ORDINATOR = lotivis.DateOrdinator.ISO_DATE_ORDINATOR;
        let correctDates = [1640991600000, 1640995200000];
        assert.ok(correctDates.includes(ISO_DATE_ORDINATOR("2022-1-1")));
        assert.ok(correctDates.includes(ISO_DATE_ORDINATOR("2022-01-01")));
    });
});

describe("WEEKDAY_ORDINATOR", function () {
    let WEEKDAY_ORDINATOR = lotivis.DateOrdinator.WEEKDAY_ORDINATOR;
    it("returns the correct numeric value", function () {
        assert.strictEqual(WEEKDAY_ORDINATOR("sunday"), 0);
        assert.strictEqual(WEEKDAY_ORDINATOR("monday"), 1);
        assert.strictEqual(WEEKDAY_ORDINATOR("tuesday"), 2);
        assert.strictEqual(WEEKDAY_ORDINATOR("wednesday"), 3);
        assert.strictEqual(WEEKDAY_ORDINATOR("thursday"), 4);
        assert.strictEqual(WEEKDAY_ORDINATOR("friday"), 5);
        assert.strictEqual(WEEKDAY_ORDINATOR("saturday"), 6);
    });
});
