/* eslint-disable no-unused-vars */
export default class DefaultAdapter {
  build(Model, props) {
    return new Model(props);
  }
  async save(model, Model) {
    return Promise.resolve(model.save()).then(() => model);
  }
  async destroy(model, Model) {
    return Promise.resolve(model.destroy()).then(() => model);
  }
  get(model, attr, Model) {
    return model.get(attr);
  }
  set(props, model, Model) {
    return model.set(props);
  }
}
