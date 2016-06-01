/**
 * Created by chetanv on 01/06/16.
 */

import Generator from './Generator';

class BuildMany extends Generator {
  constructor(factoryGirl, name, num, key = null, attrs = {}, buildOptions = {}) {
    this.factoryGirl = factoryGirl;
    this.name = name;
    this.num = num;
    this.key = key;
    this.attrs = attrs;
    this.buildOptions = buildOptions;
  }

  generate() {
    const models = this.factoryGirl.buildMany(this.name, this.num, this.attrs, this.buildOptions);
    return this.key ? models.map(model => model[this.key]) : models;
  }
}

export default BuildMany;