/**
 * Created by chetanv on 08/06/16.
 */

import ModelGenerator from './ModelGenerator';

class ManyModelGenerator extends ModelGenerator {
  constructor(factoryGirl, name, num, key = null, attrs = {}, buildOptions = {}) {
    super(factoryGirl, name, key, attrs, buildOptions);

    if (typeof num !== 'number' || num < 1) {
      throw new Error('Invalid number of items requested.');
    }

    this.num = num;
  }
}

export default ManyModelGenerator;