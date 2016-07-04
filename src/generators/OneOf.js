/**
 * Created by chetanv on 24/06/16.
 */

import Generator from './Generator';

class OneOf extends Generator {
  valueSet = [];

  generate(possibleValues) {
    if (!Array.isArray(possibleValues)) {
      throw new Error('Expected an array of possible values');
    }

    if (possibleValues.length < 1) {
      throw new Error('Empty array passed for possible values');
    }

    const size = possibleValues.length;
    const randomIndex = Math.floor(Math.random() * size);
    const value = possibleValues[randomIndex];
    return (typeof value === 'function') ? value() : value;
  }
}

export default OneOf;
