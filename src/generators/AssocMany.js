
import Generator from './Generator';

export default class AssocMany extends Generator {
  async generate(name, num, key = null, attrs = {}, buildOptions = {}) {
    const models = await this.factoryGirl.createMany(name, num, attrs, buildOptions);
    return key ? models.map(model => this.getAttribute(name, model, key)) : models;
  }
}
