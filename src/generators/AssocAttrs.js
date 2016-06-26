/**
 * Created by chetanv on 08/06/16.
 */

import ModelGenerator from './ModelGenerator';

export default class AssocAttrs extends ModelGenerator {
  async generate() {
    const model = await this.factoryGirl.attrs(this.name, this.attrs, this.buildOptions);
    return this.key ? model[this.key] : model;
  }
}
