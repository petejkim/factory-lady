/**
 * Created by chetanv on 01/06/16.
 */

class ObjectAdapter {
  async build(Model, props) {
    const model = new Model;
    for(let key in props) {
      if(props.hasOwnProperty(key)) {
        model[key] = props[key];
      }
    }
    return model;
  }

  async save(Model, model) {
    return model;
  }

  async destroy(Model, model) {
    return model;
  }
}

export default ObjectAdapter;