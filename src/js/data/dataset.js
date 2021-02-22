import {Item} from "./item";

/**
 *
 * @class Dataset
 */
export class Dataset {

  constructor(rawJSON) {
    this.label = rawJSON.label;
    this.stack = rawJSON.stack;
    this.data = [];

    if (!rawJSON.data || rawJSON.data.length) {
      throw `Invalid dataset format. Missing 'data' property.`;
    }

    for (let index = 0; index < rawJSON.data.length; index++) {
      this.data.push(new Item(rawJSON.data[index]));
    }
  }
}
