/**
 * Created by chetanv on 01/06/16.
 */


class DefaultAdapter {
  async build(Model, props) {
    return new Model(props);
  }

  async save(Model, model) {
    model.save();
    return model;
  }
  
  async destroy(Model, model) {
    model.destroy();
    return model;
  }
}

export default DefaultAdapter;
