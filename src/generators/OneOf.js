/**
 * Created by chetanv on 24/06/16.
 */

import Generator from './Generator';

class OneOf extends Generator {
  valueSet = [];

  constructor(factoryGirl, possibleValues) {
    super(factoryGirl);

    if (!Array.isArray(possibleValues)) {
      throw new Error('Expected an array of possible values');
    }

    if (possibleValues.length < 1) {
      throw new Error('Empty array passed for possible values');
    }

    this.valueSet = possibleValues;
  }

  generate() {
    const size = this.valueSet.length;
    const randomIndex = Math.floor(Math.random() * size);
    const value = this.valueSet[randomIndex];
    if (typeof value === 'function') {
      return Promise.resolve(value());
    }
    return Promise.resolve(value);
  }
}

export default OneOf;
