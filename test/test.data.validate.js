const assert = require("assert");
const samples = require("./sample.data");
const lotivis = require("../dist/lotivis.tests");

describe("validate", function () {
  describe("validateDataItem", function () {
    it("validates a correct item", function () {
      lotivis.validateDataItem({ date: "some", location: "some", value: 1 });
    });

    it("validates an item without a value", function () {
      lotivis.validateDataItem({ date: "some", location: "some" });
    });

    it("throws an error for an empty item", function () {
      assert.throws(() => {
        lotivis.validateDataItem({});
      }, lotivis.DataValidateError);
    });

    it("throws an error for an item without a `date` property", function () {
      assert.throws(() => {
        lotivis.validateDataItem({ location: "some", value: 0 });
      }, lotivis.MissingPropertyError);
    });

    it("throws an error for an item without a `location` property", function () {
      assert.throws(() => {
        lotivis.validateDataItem({ date: "some", value: 0 });
      }, lotivis.DataValidateError);
    });
  });

  describe("validateDataset", function () {
    it("validates a correct dataset", function () {
      lotivis.validateDataset({ label: "dataset_1", data: [] });
    });

    it("throws an error for missing `label` property", function () {
      assert.throws(() => {
        lotivis.validateDataset({ data: [] });
      }, lotivis.MissingPropertyError);
    });

    it("throws an error for missing `datasets.controller` property", function () {
      assert.throws(() => {
        lotivis.validateDataset({ label: "dataset_1" });
      }, lotivis.MissingPropertyError);
    });

    it("throws an error for invalid `datasets.controller` property", function () {
      assert.throws(() => {
        lotivis.validateDataset({
          label: "dataset_1",
          data: "my datasets.controller",
        });
      }, lotivis.InvalidFormatError);
    });
  });

  describe("validates the sample datasets.controller", function () {
    it("validates sample.dataset.1.json", function () {
      let dataset1 = samples.readJSON("sample.dataset.1.json");
      lotivis.validateDataset(dataset1);
    });

    it("validates sample.datasets.1.json", function () {
      let datasets1 = samples.readJSON("sample.datasets.1.json");
      lotivis.validateDatasets(datasets1);
    });
  });
});
