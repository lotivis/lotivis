const assert = require('assert');
const samples = require('./sample.data');
const lotivis = require('../dist/lotivis.tests');

describe('dataview.map', function () {

  describe('sample.dataset.1.json', function () {
    let dataset = samples.readJSON('sample.dataset.1.json');
    let controller = new lotivis.DatasetController([dataset]);
    let mapDataview = controller.getMapDataview();

    it('does something', function () {
      assert.strictEqual(true, true);
    });

  });

});
