/**
 * Created by chetanv on 01/06/16.
 */

import Generator from './Generator';

export default class Assoc extends Generator {
  async generate(name, key = null, attrs = {}, buildOptions = {}) {
    const model = await this.factoryGirl.create(name, attrs, buildOptions);
    return key ? this.getAttribute(name, model, key) : model;
  }
}
