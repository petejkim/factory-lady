/**
 * Created by chetanv on 01/06/16.
 */

import ManyModelGenerator from './ManyModelGenerator';

class BuildMany extends ManyModelGenerator {
  async generate() {
    const models = await this.factoryGirl.buildMany(
      this.name, this.num, this.attrs, this.buildOptions
    );
    return this.key ? models.map(model => model[this.key]) : models;
  }
}

export default BuildMany;
