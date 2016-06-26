/**
 * Created by chetanv on 01/06/16.
 */

export default class MongooseAdapter {
  async build(Model, props) {
    return new Model(props);
  }

  async save(Model, model) {
    return model.save();
  }

  async destroy(Model, model) {
    return model.remove();
  }
}
