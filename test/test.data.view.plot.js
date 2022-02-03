const assert = require("assert");
const samples = require("./sample.data");
const lotivis = require("./lotivis.test.js");

// describe("dataView.map.chart", function () {
//   describe("sample.dataset.1.json", function () {
//     let dataset = samples.readJSON("sample.dataset.1.json");
//     let controller = new lotivis.DatasetsController([dataset]);
//     let plotDataview = controller.getPlotDataview();
//     let firstDataset = plotDataview.datasets[0];

//     it("has exactly one dataset", function () {
//       assert.strictEqual(plotDataview.datasets.length, 1);
//     });

//     it("has the correct labels count", function () {
//       assert.strictEqual(plotDataview.labelsCount, 1);
//     });

//     it("has the correct labels", function () {
//       assert.deepStrictEqual(plotDataview.labels, ["dataset_1"]);
//     });

//     it("has the correct dates", function () {
//       assert.deepStrictEqual(
//         plotDataview.dates,
//         [2000, 2001, 2002, 2003, 2004]
//       );
//     });

//     it("has the correct max value", function () {
//       assert.strictEqual(plotDataview.max, 10);
//     });

//     it("dataset has the correct first date", function () {
//       assert.strictEqual(firstDataset.firstDate, 2000);
//     });

//     it("dataset has the correct last date", function () {
//       assert.strictEqual(firstDataset.lastDate, 2004);
//     });
//   });
// });
