import DefaultAdapter from './DefaultAdapter';
import factory from '../index';

export default class BookshelfAdapter extends DefaultAdapter {
  save(Model, doc) {
    return doc.save(null, { method: 'insert' });
  }
}

BookshelfAdapter.init = function init(factoryNames) {
  return factory.setAdapter(new BookshelfAdapter(), factoryNames);
};
