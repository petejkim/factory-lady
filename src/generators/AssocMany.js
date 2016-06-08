/**
 * Created by chetanv on 01/06/16.
 */

import ManyModelGenerator from './ManyModelGenerator';

class AssocMany extends ManyModelGenerator {
  async generate() {
    const models = await this.factoryGirl.createMany(
      this.name, this.num, this.attrs, this.buildOptions
    );
    return this.key ? models.map(model => model[this.key]) : models;
  }
}

export default AssocMany;
