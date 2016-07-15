import '../test-helper/testUtils';
import MongooseAdapter from '../../src/adapters/MongooseAdapter';
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
      done();
    });
  });

  it('builds models and access attributes correctly', function (done) {
    mongoUnavailable ? this.skip() : null;

    const kitten = adapter.build(Kitten, { name: 'fluffy' });
    expect(kitten).to.be.instanceof(Kitten);
    expect(kitten.name).to.be.equal('fluffy');

    adapter.set({ name: 'fluffy2' }, kitten, Kitten);
    const name = adapter.get(kitten, 'name', Kitten);

    expect(name).to.be.equal('fluffy2');

    done();
  });

  it('saves models correctly', function (done) {
    mongoUnavailable ? this.skip() : null;

    const kitten = adapter.build(Kitten, { name: 'fluffy' });
    adapter.save(kitten, Kitten)
      .then((k) => expect(k).to.have.property('_id'))
      .then(() => Kitten.remove({}))
      .then(() => done())
      .catch((err) => done(err))
    ;
  });

  it('destroys models correctly', function (done) {
    mongoUnavailable ? this.skip() : null;

    const kitten = adapter.build(Kitten, { name: 'smellyCat' });
    adapter.save(kitten, Kitten)
      .then(() => Kitten.count())
      .then((count) => expect(count).to.be.equal(1))
      .then(() => adapter.destroy(kitten, Kitten))
      .then(() => Kitten.count())
      .then(count => expect(count).to.be.equal(0))
      .then(() => done())
      .catch(err => done(err))
    ;
  });
});
