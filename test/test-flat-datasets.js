const assert = require('assert');
const dataset = require('./test-data/test-dataset-location-time.json');
const datasets = require('./test-data/test-datasets-location-time.json');
const lotivis = require('../dist/lotivis');

describe('dataset', function() {

  describe('#validate dataset', function() {

    it('should have label \"dataset_1\"', function() {
      assert.strictEqual(dataset.label, 'dataset_1');
    });

    it('should have stack \"dataset_1\"', function() {
      assert.strictEqual(dataset.stack, 'dataset_1');
    });

    it('should have ten data entries', function () {
      assert.strictEqual(dataset.data.length, 10);
    });

  });

  describe('#flat dataset', function() {
    let flat = lotivis.flatDataset(dataset);

    it('should have the right length', function() {
      assert.strictEqual(flat.length, dataset.data.length);
    });

    it('all items have the correct dataset property', function() {
      flat.forEach(function (item) {
        assert.strictEqual(item.dataset, 'dataset_1');
      });
    });
  });

  describe('#flat datasets', function() {
    let flat = lotivis.flatDatasets(datasets);

    it('should have the right length', function() {
      assert.strictEqual(flat.length, 30);
    });

    it('contains the correct items', function() {
      let datasetItems_1 = flat.filter(item => item.dataset === 'dataset_1');
      let datasetItems_2 = flat.filter(item => item.dataset === 'dataset_2');
      let datasetItems_3 = flat.filter(item => item.dataset === 'dataset_3');
      assert.strictEqual(datasetItems_1.length, 10);
      assert.strictEqual(datasetItems_2.length, 10);
      assert.strictEqual(datasetItems_3.length, 10);
    });
  });

});
