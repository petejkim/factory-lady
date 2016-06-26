/**
 * Created by chetanv on 01/06/16.
 */

export default class DefaultAdapter {
  async build(Model, props) {
    return Promise.resolve(new Model(props));
  }

  async save(Model, model) {
    return Promise.resolve(model.save()).then(() => model);
  }

  async destroy(Model, model) {
    return Promise.resolve(model.destroy()).then(() => model);
  }
}
