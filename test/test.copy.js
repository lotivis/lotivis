const assert = require('assert');
const samples = require('./sample.data');
const lotivis = require('../dist/lotivis.tests');

describe('copy', function () {

  it('copies an empty object', function () {
    let original = {};
    assert.deepStrictEqual(lotivis.copy(original), original);
  });

  it('copies an array', function () {
    let original = ['Test'];
    assert.deepStrictEqual(lotivis.copy(original), original);
  });

  it('sample.dataset.1.json', function () {
    let dataset1 = samples.readJSON('sample.dataset.1.json');
    assert.deepStrictEqual(lotivis.copy(dataset1), dataset1);
  });

  it('sample.datasets.1.json', function () {
    let datasets1 = samples.readJSON('sample.datasets.1.json');
    assert.deepStrictEqual(lotivis.copy(datasets1), datasets1);
  });

});
