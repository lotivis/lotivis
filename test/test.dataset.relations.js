const assert = require('assert');
const samples = require('./sample.data');
const lotivis = require('../dist/lotivis.tests');

describe('dataset relations', function () {

  it('calcs the correct date to items relation', function () {
    let datasets = samples.readJSON('sample.datasets.1.json');
    let flatData = lotivis.flatDatasets(datasets);
    let dateToItemsRelation = lotivis.dateToItemsRelations(datasets, flatData);
    let sumOfDataset1 = lotivis.sumOfDataset(flatData, 'dataset_1');
    let sumOfDataset2 = lotivis.sumOfDataset(flatData, 'dataset_2');
    let sumOfDataset3 = lotivis.sumOfDataset(flatData, 'dataset_3');
    assert.strictEqual(sumOfDataset1, 30);
    assert.strictEqual(sumOfDataset2, 55);
    assert.strictEqual(sumOfDataset3, 50);
  });

});
