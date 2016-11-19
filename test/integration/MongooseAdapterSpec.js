import '../test-helper/testUtils';
import MongooseAdapter from '../../src/adapters/MongooseAdapter';
import { factory } from '../../src/index';
import mongoose from 'mongoose';
import { expect } from 'chai';

mongoose.Promise = Promise;

/* eslint-disable new-cap */
const kittySchema = mongoose.Schema({
  name: String,
});
/* eslint-enable new-cap */

const Kitten = mongoose.model('Kitten', kittySchema);

describe('MongooseAdapterIntegration', function () {
  let mongoUnavailable = false;
  const adapter = new MongooseAdapter;

  before(function (done) {
    mongoose.connect('mongodb://localhost/factory_girl_test_db');
    const db = mongoose.connection;

    db.on('error', () => {
      mongoUnavailable = true;
      done();
    });

    db.once('open', () => {
      const Email = mongoose.model('Email', new mongoose.Schema({
        subject: String,
        thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread' },
      }));

      factory.define('email', Email, {
        subject: 'ttt',
        thread: factory.assoc('thread', '_id'),
      });

      const Thread = mongoose.model('Thread', new mongoose.Schema({}));
      factory.define('thread', Thread, {});

      done();
    });
  });

  it('builds models and access attributes correctly', function (done) {
    mongoUnavailable && this.skip();

    const kitten = adapter.build(Kitten, { name: 'fluffy' });
    expect(kitten).to.be.instanceof(Kitten);
    expect(kitten.name).to.be.equal('fluffy');

    adapter.set({ name: 'fluffy2' }, kitten, Kitten);
    const name = adapter.get(kitten, 'name', Kitten);

    expect(name).to.be.equal('fluffy2');

    done();
  });

  it('saves models correctly', function () {
    mongoUnavailable && this.skip();

    const kitten = adapter.build(Kitten, { name: 'fluffy' });
    return adapter.save(kitten, Kitten)
      .then(k => expect(k).to.have.property('_id'))
      .then(() => Kitten.remove({}));
  });

  it('destroys models correctly', function () {
    mongoUnavailable && this.skip();

    const kitten = adapter.build(Kitten, { name: 'smellyCat' });
    return adapter.save(kitten, Kitten)
      .then(() => Kitten.count())
      .then(count => expect(count).to.be.equal(1))
      .then(() => adapter.destroy(kitten, Kitten))
      .then(() => Kitten.count())
      .then(count => expect(count).to.be.equal(0));
  });

  /* eslint-disable no-underscore-dangle */
  it('allows to pass mongo ObjectId as a default attribute', function () {
    mongoUnavailable && this.skip();

    let thread;
    return factory.create('thread')
      .then(created => (thread = created))
      .then(() => factory.create('email', { thread: thread._id }))
      .then(email => expect(email.thread).to.be.equal(thread._id));
  });
  /* eslint-enable no-underscore-dangle */
});
