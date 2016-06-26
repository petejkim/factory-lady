/**
 * Created by chetanv on 08/06/16.
 */

import ModelGenerator from './ModelGenerator';

export default class ManyModelGenerator extends ModelGenerator {
  constructor(factoryGirl, name, num, key = null, attrs = {}, buildOptions = {}) {
    if (typeof num !== 'number' || num < 1) {
      throw new Error('Invalid number of items requested');
    }
    super(factoryGirl, name, key, attrs, buildOptions);
    this.num = num;
  }
}
