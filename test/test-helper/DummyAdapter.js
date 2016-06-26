/**
 * Created by chetanv on 07/06/16.
 */

class DummyAdapter {
  async build(Model, props) {
    const model = new Model(props);
    return model;
  }

  async save(Model, model) {
    return model;
  }

  async destroy(Model, model) {
    return model;
  }
}

export default DummyAdapter;
