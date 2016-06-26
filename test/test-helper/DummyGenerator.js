/**
 * Created by chetanv on 06/06/16.
 */

class DummyGenerator {
  constructor() {
    this.constructorCalled = true;
  }

  async generate() {
    return 'hello';
  }
}

export default DummyGenerator;
