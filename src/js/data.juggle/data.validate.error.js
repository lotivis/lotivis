export class LotivisError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ElementNotFoundError extends LotivisError {
  constructor(selector) {
    super(`Can't find an element with ID '${selector}'.`);
  }
}

export class DataValidateError extends LotivisError {
  // constructor(message) {
  //   super(message);
  // }
}

export class MissingPropertyError extends DataValidateError {
  // constructor(message, propertyName) {
  //   super(message);
  //   this.propertyName = propertyName;
  // }
}

export class InvalidFormatError extends DataValidateError {
  // constructor(message) {
  //   super(message);
  // }
}

export class GeoJSONValidateError extends LotivisError {
  // constructor(message) {
  //   super(message);
  // }
}

exports.LotivisError = LotivisError;
exports.DataValidateError = DataValidateError;
exports.MissingPropertyError = MissingPropertyError;
exports.InvalidFormatError = InvalidFormatError;
exports.GeoJSONValidateError = GeoJSONValidateError;
