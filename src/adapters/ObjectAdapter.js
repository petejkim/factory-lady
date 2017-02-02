import DefaultAdapter from './DefaultAdapter';

/* eslint-disable no-unused-vars */
export default class ObjectAdapter extends DefaultAdapter {
  build(Model, props) {
    const model = new Model;
    this.set(props, model, Model);
    return model;
  }
  async save(model, Model) {
    return model;
  }
  async destroy(model, Model) {
    return model;
  }
  get(model, attr, Model) {
    return model[attr];
  }
  set(props, model, Model) {
    return Object.assign(model, props);
  }
}
