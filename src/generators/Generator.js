/**
 * Created by chetanv on 01/06/16.
 */

class Generator {
  constructor(factoryGirl) {
    if (!factoryGirl) {
      throw new Error('No FactoryGirl instance passed.');
    }
    this.factoryGirl = factoryGirl;
  }

  generate() {
    throw new Error('Override this method to generate a value');
  }
}

export default Generator;