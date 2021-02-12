const fs = require('fs');
const assert = require('assert');
const Track = require('../source/js/corpus-model/track.js2');

describe('Track', function() {

    let trackJSONString = fs.readFileSync('test/test-data/TestTrack.json');
    let trackJSON = JSON.parse(trackJSONString);
    let track = new Track.Track(trackJSON);

    it('should load proper', function() {
        assert.notStrictEqual(trackJSONString, null);
        assert.notStrictEqual(trackJSON, null);
        assert.notStrictEqual(track, null);
    });

    it('should have the right values', function() {
        assert.strictEqual(track.title, "C'est qui le Gros ?");
        assert.strictEqual(track.releaseDate, "2010-12-06");
        assert.strictEqual(track.releaseYear, 2010);
        assert.strictEqual(track.id, 245991);
        assert.strictEqual(track.fullTitle, "C'est qui le Gros ? by 113");
    });

    it('should have the right components', function() {
        assert.strictEqual(track.components.length, 409);
        assert.strictEqual(track.components[0], "C'est");
    });

    it('should have the right types', function() {
        assert.strictEqual(track.types.length, 196);
        assert.strictEqual(track.types[0], "C'est");
        console.log(track.types);
    });
});
