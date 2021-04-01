const assert = require('assert');
const datasets = require('./data/sample.datasets.1.json');
const lotivis = require('../dist/lotivis');

describe('dataset sum', function() {

  it('calcs the correct sum for datasets', function() {
    let flatData = lotivis.flatDatasets(datasets);
    let sumOfDataset1 = lotivis.sumOfDataset(flatData, 'dataset_1');
    let sumOfDataset2 = lotivis.sumOfDataset(flatData, 'dataset_2');
    let sumOfDataset3 = lotivis.sumOfDataset(flatData, 'dataset_3');
    assert.strictEqual(sumOfDataset1, 30);
    assert.strictEqual(sumOfDataset2, 55);
    assert.strictEqual(sumOfDataset3, 50);
  });

  it('calcs the correct sum for stacks', function() {
    let flatData = lotivis.flatDatasets(datasets);
    let sumOfDataset1 = lotivis.sumOfStack(flatData, 'dataset_1');
    let sumOfDataset2 = lotivis.sumOfStack(flatData, 'dataset_2, dataset_3');
    let sumOfDataset3 = lotivis.sumOfStack(flatData, 'dataset_xxx');
    assert.strictEqual(sumOfDataset1, 30);
    assert.strictEqual(sumOfDataset2, 50 + 55);
    assert.strictEqual(sumOfDataset3, 0);
  });

});
