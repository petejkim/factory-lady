/**
 * Created by chetanv on 06/06/16.
 */

class DummyMongooseModel {
  constructor() {
    this.constructorCalled = true;
  }

  async save() {
    this.saveCalled = true;
    return this;
  }

  async remove() {
    this.removeCalled = true;
    return this;
  }
}

export default DummyMongooseModel;