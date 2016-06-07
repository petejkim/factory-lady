/**
 * Created by chetanv on 06/06/16.
 */

import Generator from './Generator';

class ModelGenerator extends Generator {
  constructor(factoryGirl, name, key = null, attrs = {}, buildOptions = {}) {
    super(factoryGirl);

    if (typeof name !== 'string' || name.length < 1) {
      throw new Error('Invalid model name passed');
    }

    this.name = name;
    this.key = key;
    this.attrs = attrs;
    this.buildOptions = buildOptions;
  }
}

export default ModelGenerator;
