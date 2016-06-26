/**
 * Created by chetanv on 08/06/16.
 */

import Generator from './Generator';
import Chance from 'chance';
// import _debug from 'debug';

// const debug = _debug('Chance');
const chance = new Chance();

export default class ChanceGenerator extends Generator {
  method = null;
  options = null;

  constructor(factoryGirl, chanceMethod, options) {
    if (typeof chance[chanceMethod] !== 'function') {
      throw new Error('Invalid chance method requested');
    }
    super(factoryGirl);
    this.method = chanceMethod;
    this.options = options;
  }

  generate() {
    return Promise.resolve(chance[this.method](this.options));
  }
}
