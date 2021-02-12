/**
 *
 * @class Item
 */
export class Item {

    constructor(rawJSON) {
        if (!rawJSON.label) {
            throw `Invalid item format. Missing 'value' property.`
        }
        this.label = rawJSON.label;
        if (!rawJSON.value) {
            throw `Invalid item format. Missing 'label' property.`
        }
        this.value = rawJSON.value;

        if (rawJSON.datum) {
            this.datum = rawJSON.datum;
        }
        if (rawJSON.datumTotal) {
            this.datum = rawJSON.datumTotal;
        }
        if (rawJSON.location) {
            this.datum = rawJSON.location;
        }
        if (rawJSON.locationTotal) {
            this.datum = rawJSON.locationTotal;
        }
    }
}
