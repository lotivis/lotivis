const assert = require('assert');
const dataset = require('./test-data/test-dataset-location-time.json');
const datasets = require('./test-data/test-datasets-location-time.json');
const lotivis = require('../dist/lotivis');

describe('dataset extract', function() {

  it('extracts the correct stacks', function() {
    let stacks = lotivis.extractStacks(datasets);
    assert.strictEqual(stacks.length, 2);
    assert.strictEqual(stacks[0], 'dataset_1');
    assert.strictEqual(stacks[1], 'dataset_2, dataset_3');
  });

  it('extracts the correct dates', function() {
    let dates = lotivis.extractDates(datasets);
    assert.strictEqual(dates.length, 5);
    assert.strictEqual(dates[0], 2000);
    assert.strictEqual(dates[1], 2001);
    assert.strictEqual(dates[2], 2002);
    assert.strictEqual(dates[3], 2003);
    assert.strictEqual(dates[4], 2004);
  });

  it('extracts the correct locations', function() {
    let locations = lotivis.extractLocations(datasets);
    console.log(locations);
    assert.strictEqual(locations.length, 2);
    assert.strictEqual(locations[0], 1);
    assert.strictEqual(locations[1], 2);
  });
});
