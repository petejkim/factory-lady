import { attr, Model } from 'redux-orm';

export default class DummyReduxORMModel extends Model {
  static get fields() {
    return {
      id: attr(),
      type: attr(),
      name: attr(),
      country: attr(),
    };
  }

  static get modelName() {
    return 'DummyReduxORMModel';
  }
}
