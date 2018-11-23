

import Generator from './Generator';

export default class AssocAttrsMany extends Generator {
  async generate(name, num, key = null, attrs = {}, buildOptions = {}) {
    if (typeof num !== 'number' || num < 1) {
      throw new Error('Invalid number of items requested');
    }
    const models = await this.factoryGirl.attrsMany(name, num, attrs, buildOptions);
    return key ? models.map(model => this.getAttribute(name, model, key)) : models;
  }
}
