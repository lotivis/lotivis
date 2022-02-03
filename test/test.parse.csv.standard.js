const assert = require("assert");
const samples = require("./sample.data");
const lotivis = require("./lotivis.test.js");

// describe("parseCSVDate", function () {
//   it("parses a csv file", function () {
//     let csvString = samples.read("sample.csv.dataset.date.1.csv");
//     let parsedDatasets = lotivis.parseCSVDate(csvString);
//     assert.strictEqual(parsedDatasets.length, 3);
//     assert.strictEqual(parsedDatasets[0].label, "dataset_1");
//     assert.strictEqual(parsedDatasets[1].label, "dataset_2");
//     assert.strictEqual(parsedDatasets[2].label, "dataset_3");
//     assert.strictEqual(parsedDatasets[0].data.length, 4);
//     assert.strictEqual(parsedDatasets[1].data.length, 4);
//     assert.strictEqual(parsedDatasets[2].data.length, 4);
//     let flatData = lotivis.flatDatasets(parsedDatasets);
//     assert.strictEqual(lotivis.sumOfDataset(flatData, "dataset_1"), 0);
//     assert.strictEqual(lotivis.sumOfDataset(flatData, "dataset_2"), 10);
//     assert.strictEqual(lotivis.sumOfDataset(flatData, "dataset_3"), 8);
//   });
// });
