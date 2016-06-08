/**
 * Created by chetanv on 01/06/16.
 */


class DefaultAdapter {
  build(Model, props) {
    return Promise.resolve(new Model(props));
  }

  save(Model, model) {
    return Promise.resolve(model.save()).then(function () {
      return model;
    });
  }
  
  destroy(Model, model) {
    return Promise.resolve(model.destroy()).then(function () {
      return model;
    });
  }
}

export default DefaultAdapter;
