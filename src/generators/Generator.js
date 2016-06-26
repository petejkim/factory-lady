/**
 * Created by chetanv on 01/06/16.
 */

export default class Generator {
  constructor(factoryGirl) {
    if (!factoryGirl) {
      throw new Error('No FactoryGirl instance provided');
    }
    this.factoryGirl = factoryGirl;
  }

  generate() {
    throw new Error('Override this method to generate a value');
  }
}
