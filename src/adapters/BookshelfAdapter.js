import DefaultAdapter from './DefaultAdapter';
import factory from '../index';

/* eslint-disable no-unused-vars */
export default class BookshelfAdapter extends DefaultAdapter {
  save(doc, Model) {
    return doc.save();
  }
}

BookshelfAdapter.init = function init(factoryNames) {
  return factory.setAdapter(new BookshelfAdapter(), factoryNames);
};
