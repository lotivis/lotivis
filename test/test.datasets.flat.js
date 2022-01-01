const assert = require("assert");
const samples = require("./sample.data");
const lotivis = require("../dist/lotivis.tests");

describe("dataset", function () {
  describe("#flat dataset", function () {
    let dataset = samples.readJSON("sample.dataset.1.json");
    let flat = lotivis.flatDataset(dataset);

    it("should have the right length", function () {
      assert.strictEqual(flat.length, dataset.data.length);
    });

    it("all items have the correct dataset property", function () {
      flat.forEach(function (item) {
        assert.strictEqual(item.dataset, "dataset_1");
      });
    });
  });

  describe("#flat datasets", function () {
    let datasets = samples.readJSON("sample.datasets.1.json");
    let flat = lotivis.flatDatasets(datasets);

    it("should have the right length", function () {
      assert.strictEqual(flat.length, 30);
    });

    it("contains the correct items", function () {
      let datasetItems_1 = flat.filter((item) => item.dataset === "dataset_1");
      let datasetItems_2 = flat.filter((item) => item.dataset === "dataset_2");
      let datasetItems_3 = flat.filter((item) => item.dataset === "dataset_3");
      assert.strictEqual(datasetItems_1.length, 10);
      assert.strictEqual(datasetItems_2.length, 10);
      assert.strictEqual(datasetItems_3.length, 10);
    });
  });
});
