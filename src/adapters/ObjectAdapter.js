/**
 * Created by chetanv on 01/06/16.
 */

export default class ObjectAdapter {
  async build(Model, props) {
    const model = new Model;
    Object.assign(model, props);
    return model;
  }

  async save(Model, model) {
    return model;
  }

  async destroy(Model, model) {
    return model;
  }
}
