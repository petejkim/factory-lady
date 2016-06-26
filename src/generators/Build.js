/**
 * Created by chetanv on 01/06/16.
 */

import ModelGenerator from './ModelGenerator';

export default class Build extends ModelGenerator {
  async generate() {
    const model = await this.factoryGirl.build(this.name, this.attrs, this.buildOptions);
    return this.key ? model[this.key] : model;
  }
}
