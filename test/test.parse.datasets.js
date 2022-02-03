const assert = require("assert");
const samples = require("./sample.data");
const lotivis = require("./lotivis.test.js");

// describe("datasets create", function () {
//   it("creates an empty dataset collection for an empty flat samples list", function () {
//     let createdDatasets = lotivis.parseDatasets([]);
//     assert.strictEqual(createdDatasets.length, 0);
//   });

//   describe("sample.dataset.1.json", function () {
//     let dataset1 = samples.readJSON("sample.dataset.1.json");
//     let flatData = lotivis.flatDataset(dataset1);
//     let createdDatasets = lotivis.createDatasets(flatData);

//     it("has a length of 1", function () {
//       assert.strictEqual(createdDatasets.length, 1);
//     });

//     it("samples has a length of 10", function () {
//       assert.strictEqual(createdDatasets[0].data.length, 10);
//     });
//   });

//   describe("sample.datasets.1.json", function () {
//     let datasets = samples.readJSON("sample.datasets.1.json");
//     let datasetsFlat = lotivis.flatDatasets(datasets);
//     let createdDatasets = lotivis.createDatasets(datasetsFlat);

//     it("has a length of 3", function () {
//       assert.strictEqual(createdDatasets.length, 3);
//     });

//     it("samples has a length of 10", function () {
//       assert.strictEqual(createdDatasets[0].data.length, 10);
//       assert.strictEqual(createdDatasets[1].data.length, 10);
//       assert.strictEqual(createdDatasets[2].data.length, 10);
//     });
//   });
// });
