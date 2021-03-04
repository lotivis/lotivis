const assert = require('assert');
const dataset = require('./test-data/test-dataset-location-time.json');
const datasets = require('./test-data/test-datasets-location-time.json');
const lotivis = require('../public/dist/lotivis');

describe('dataset', function() {

  describe('#datasetCombine dataset', function() {
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
    let flat = lotivis.flatDatasets(datasets);
    let combined = lotivis.combine(flat);

    it('should have the right length', function() {
      assert.strictEqual(combined.length, 30);
    });
  });

  describe('#datasetCombine datasets by stack', function() {
    let flat = lotivis.flatDatasets(datasets);
    let combined = lotivis.combineByStacks(flat);

    it('should have the right length', function() {
      assert.strictEqual(combined.length, 20);
    });
  });

  describe('#datasetCombine datasets by date', function() {
    let flat = lotivis.flatDatasets(datasets);
    let combined = lotivis.combineByDate(flat);

    it('should have the right length', function() {
      assert.strictEqual(combined.length, 15);
    });
  });

  describe('#datasetCombine datasets by location', function() {
    let flat = lotivis.flatDatasets(datasets);
    let combined = lotivis.combineByLocation(flat);

    it('should have the right length', function() {
      assert.strictEqual(combined.length, 6);
    });
  });
});
