import {toSaveID} from "../shared/selector";

/**
 * Represents an option of a dropdown or radio group.
 * @class Option
 */
export class Option {

  /**
   * Creates a new instance of Option.
   * @param title The title of the option.
   */
  constructor(title) {
    this.title = title;
    this.id = toSaveID(title);
  }
}
