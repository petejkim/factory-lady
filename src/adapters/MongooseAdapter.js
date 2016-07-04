/**
 * Created by chetanv on 01/06/16.
 */
import DefaultAdapter from './DefaultAdapter';
import factory from '../index';

/* eslint-disable no-unused-vars */
export default class MongooseAdapter extends DefaultAdapter {
  async destroy(model, Model) {
    return model.remove();
  }
}

MongooseAdapter.init = function init(factoryNames) {
  return factory.setAdapter(new MongooseAdapter(), factoryNames);
};
