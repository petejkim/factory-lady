import DefaultAdapter from './DefaultAdapter';

/* eslint-disable no-unused-vars */
export default class SequelizeAdapter extends DefaultAdapter {
  build(Model, props) {
    return Model.build(props);
  }
}
