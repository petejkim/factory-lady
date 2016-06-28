/**
 * Created by chetanv on 01/06/16.
 */


class DefaultAdapter {
  build(Model, props) {
    return Promise.resolve(new Model(props));
  }

  save(Model, model) {
    return Promise.resolve(model.save()).then(() => model);
  }

  destroy(Model, model) {
    return Promise.resolve(model.destroy()).then(() => model);
  }
}

export default DefaultAdapter;
