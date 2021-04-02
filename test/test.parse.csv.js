const assert = require('assert');
const samples = require('./sample.data');
const lotivis = require('../dist/lotivis.tests');

describe('samples.parse csv', function () {

  it('parses a csv file', function () {
    let csvContent = samples.read('sample.csv.dataset.1.csv');
    let parsedDatasets = lotivis.parseCSV(csvContent);
    assert.strictEqual(parsedDatasets.length, 1);
    assert.strictEqual(parsedDatasets[0].label, 'dataset_1');
    assert.strictEqual(parsedDatasets[0].data.length, 10);
  });
});
