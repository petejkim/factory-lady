import DefaultAdapter from './DefaultAdapter';

/* eslint-disable no-unused-vars */
export default class BookshelfAdapter extends DefaultAdapter {
  save(doc, Model) {
    return doc.save(null, { method: 'insert' });
  }
}

