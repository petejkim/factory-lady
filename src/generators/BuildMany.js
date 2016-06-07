/**
 * Created by chetanv on 01/06/16.
 */

import ModelGenerator from './ModelGenerator';

class BuildMany extends ModelGenerator {
  constructor(factoryGirl, name, num, key = null, attrs = {}, buildOptions = {}) {
    super(factoryGirl, name, key, attrs, buildOptions);

    if (typeof num !== 'number' || num < 1) {
      throw new Error('Invalid number of items requested.');
    }

    this.num = num;
  }

  async generate() {
    const models = await this.factoryGirl.buildMany(this.name, this.num, this.attrs, this.buildOptions);
    return this.key ? models.map(model => model[this.key]) : models;
  }
}

export default BuildMany;