const assert = require("assert");
const lotivis = require("../dist/lotivis.test");

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
    assert.strictEqual(GERMAN_DATE_ORDINATOR("1.1.2022"), 1640991600000);
    assert.strictEqual(GERMAN_DATE_ORDINATOR("01.01.2022"), 1640991600000);
  });
});

describe("ISO_DATE_ORDINATOR", function () {
  it("returns the correct numeric value", function () {
    let ISO_DATE_ORDINATOR = lotivis.DateOrdinator.ISO_DATE_ORDINATOR;
    assert.strictEqual(ISO_DATE_ORDINATOR("2022-1-1"), 1640991600000);
    assert.strictEqual(ISO_DATE_ORDINATOR("2022-01-01"), 1640991600000);
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
