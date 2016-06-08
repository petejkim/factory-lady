/**
 * Created by chetanv on 08/06/16.
 */


import ManyModelGenerator from './ManyModelGenerator';

class AssocAttrsMany extends ManyModelGenerator {
  async generate() {
    const models = await this.factoryGirl.attrsMany(
      this.name, this.num, this.attrs, this.buildOptions
    );
    return this.key ? models.map(model => model[this.key]) : models;
  }
}

export default AssocAttrsMany;
