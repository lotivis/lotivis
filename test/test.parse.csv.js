const assert = require('assert');
const fs = require('fs');
const lotivis = require('../dist/lotivis');
let csvDataset;

describe('parse csv', function () {

  before(function (done) {
    fs.readFile(
      'test/data/sample.csv.dataset.1.csv',
      'utf8',
      function (error, fileContents) {
        if (error) throw error;
        csvDataset = fileContents;
        done();
      }
    );
  });

  it('parses a csv file', function () {
    let parsedDatasets = lotivis.parseCSV2(csvDataset);
    assert.strictEqual(parsedDatasets.length, 1);
    assert.strictEqual(parsedDatasets[0].label, 'dataset_1');
    assert.strictEqual(parsedDatasets[0].data.length, 10);
  });
});
