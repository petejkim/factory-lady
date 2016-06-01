/**
 * Created by chetanv on 01/06/16.
 */

import Generator from './Generator';

class Assoc extends Generator {
  constructor(factoryGirl, name, key = null, attrs = {}, buildOptions = {}) {
    this.factoryGirl = factoryGirl;
    this.name = name;
    this.key = key;
    this.attrs = attrs;
    this.buildOptions = buildOptions;
  }

  generate() {
    const model = this.factoryGirl.create(this.name, this.attrs, this.buildOptions);
    return key ? model[key] : model;
  }
}

export default Assoc;
