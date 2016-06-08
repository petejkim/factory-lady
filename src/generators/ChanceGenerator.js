/**
 * Created by chetanv on 08/06/16.
 */

import Generator from './Generator';
import Chance from 'chance';
import Debug from 'debug';

const debug = Debug('Chance');
const chance = new Chance();

class ChanceGenerator extends Generator {
  method = null;
  params = null;

  constructor(factoryGirl, chanceMethod, options) {
    super(factoryGirl);

    if(typeof chance[chanceMethod] !== 'function') {
      throw new Error('Invalid chance method requested');
    }

    this.method = chanceMethod;
    this.params = options;
  }

  generate() {
    return Promise.resolve(chance[this.method](this.params));
  }
}

export default ChanceGenerator;