const assert = require("assert");
const samples = require("./sample.data");
const lotivis = require("../dist/lotivis.tests");

describe("dataset extract", function () {
  it("extracts the correct labels", function () {
    let datasets = samples.readJSON("sample.datasets.1.json");
    let stacks = lotivis.extractLabelsFromDatasets(datasets);
    assert.strictEqual(stacks.length, 3);
    assert.strictEqual(stacks[0], "dataset_1");
    assert.strictEqual(stacks[1], "dataset_2");
    assert.strictEqual(stacks[2], "dataset_3");
  });

  it("extracts the correct stacks", function () {
    let datasets = samples.readJSON("sample.datasets.1.json");
    let stacks = lotivis.extractStacksFromDatasets(datasets);
    assert.strictEqual(stacks.length, 2);
    assert.strictEqual(stacks[0], "dataset_1");
    assert.strictEqual(stacks[1], "dataset_2, dataset_3");
  });

  it("extracts the correct dates", function () {
    let datasets = samples.readJSON("sample.datasets.1.json");
    let dates = lotivis.extractDatesFromDatasets(datasets);
    assert.strictEqual(dates.length, 5);
    assert.strictEqual(dates[0], 2000);
    assert.strictEqual(dates[1], 2001);
    assert.strictEqual(dates[2], 2002);
    assert.strictEqual(dates[3], 2003);
    assert.strictEqual(dates[4], 2004);
  });

  it("extracts the correct locations", function () {
    let datasets = samples.readJSON("sample.datasets.1.json");
    let locations = lotivis.extractLocationsFromDatasets(datasets);
    assert.strictEqual(locations.length, 2);
    assert.strictEqual(locations[0], 1);
    assert.strictEqual(locations[1], 2);
  });

  it("extracts the correct earliest date", function () {
    let datasets = samples.readJSON("sample.datasets.1.json");
    let flatData = lotivis.flatDatasets(datasets);
    let earliestDate = lotivis.extractEarliestDate(flatData);
    assert.strictEqual(earliestDate, 2000);
  });

  it("extracts the correct latest date", function () {
    let datasets = samples.readJSON("sample.datasets.1.json");
    let flatData = lotivis.flatDatasets(datasets);
    let earliestDate = lotivis.extractLatestDate(flatData);
    assert.strictEqual(earliestDate, 2004);
  });
});
