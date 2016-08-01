import DefaultAdapter from './DefaultAdapter';

/* eslint-disable no-unused-vars */
export default class MongooseAdapter extends DefaultAdapter {
  async destroy(model, Model) {
    return model.remove();
  }
}
