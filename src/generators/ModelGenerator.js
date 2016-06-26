/**
 * Created by chetanv on 06/06/16.
 */

import Generator from './Generator';

export default class ModelGenerator extends Generator {
  constructor(factoryGirl, name, key = null, attrs = {}, buildOptions = {}) {
    if (typeof name !== 'string' || !name) {
      throw new Error('Invalid model name passed');
    }
    super(factoryGirl);
    this.name = name;
    this.key = key;
    this.attrs = attrs;
    this.buildOptions = buildOptions;
  }
}
