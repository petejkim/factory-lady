/**
 * Created by chetanv on 06/06/16.
 */

class DummyModel {
  constructor(props = {}) {
    this.name = props.name || 'George';
    this.age = props.age || 27;
    this.constructorCalled = true;
  }

  save() {
    this.saveCalled = true;
  }

  destroy() {
    this.destroyCalled = true;
  }

  remove() {
    this.removeCalled = true;
  }
}

export default DummyModel;
