const assert = require('assert');
const samples = require("./sample.data");
const lotivis = require('../dist/lotivis.tests');

describe('dataset', function() {

  describe('#datasetCombine dataset', function() {
    let dataset = samples.readJSON('sample.dataset.1.json');
    let flat = lotivis.flatDataset(dataset);
    let combined = lotivis.combine(flat);

    it('should have the right length', function() {
      assert.strictEqual(combined.length, dataset.data.length);
    });

    it('all items have the correct dataset property', function() {
      combined.forEach(item => assert.strictEqual(item.dataset, 'dataset_1'));
    });
  });

  describe('#datasetCombine datasets', function() {
    let datasets = samples.readJSON('sample.datasets.1.json');
    let flat = lotivis.flatDatasets(datasets);
    let combined = lotivis.combine(flat);

    it('should have the right length', function() {
      assert.strictEqual(combined.length, 30);
    });
  });

  describe('#datasetCombine datasets by stack', function() {
    let datasets = samples.readJSON('sample.datasets.1.json');
    let flat = lotivis.flatDatasets(datasets);
    let combined = lotivis.combineByStacks(flat);

    console.log(flat);
    console.log(combined);

    it('should have the right length', function() {
      assert.strictEqual(combined.length, 20);
    });
  });

  describe('#datasetCombine datasets by date', function() {
    let datasets = samples.readJSON('sample.datasets.1.json');
    let flat = lotivis.flatDatasets(datasets);
    let combined = lotivis.combineByDate(flat);

    it('should have the right length', function() {
      assert.strictEqual(combined.length, 15);
    });
  });

  describe('#datasetCombine datasets by location', function() {
    let datasets = samples.readJSON('sample.datasets.1.json');
    let flat = lotivis.flatDatasets(datasets);
    let combined = lotivis.combineByLocation(flat);

    it('should have the right length', function() {
      assert.strictEqual(combined.length, 6);
    });
  });
});
