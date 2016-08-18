import '../test-helper/testUtils';
import SequelizeAdapter from '../../src/adapters/SequelizeAdapter';
import Sequelize from 'sequelize';
import { expect } from 'chai';

const sequelize = new Sequelize(undefined, undefined, undefined, {
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false,
});

const Kitten = sequelize.define('kitten', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: Sequelize.STRING,
});

describe('SequelizeAdapterIntegration', function () {
  const adapter = new SequelizeAdapter;

  before(function (done) {
    Kitten.sync({ force: true }).then(() => done());
  });

  it('builds models and access attributes correctly', function (done) {
    const kitten = adapter.build(Kitten, { name: 'fluffy' });

    expect(kitten).to.be.instanceof(Kitten.Instance);
    let name = adapter.get(kitten, 'name', Kitten);
    expect(name).to.be.equal('fluffy');

    adapter.set({ name: 'fluffy2' }, kitten, Kitten);
    name = adapter.get(kitten, 'name', Kitten);

    expect(name).to.be.equal('fluffy2');

    done();
  });

  it('saves models correctly', function (done) {
    const kitten = adapter.build(Kitten, { name: 'fluffy' });
    adapter.save(kitten, Kitten)
      .then(k => {
        expect(k).to.have.property('id');
        return k;
      })
      .then(k => k.destroy())
      .then(() => done())
      .catch(err => done(err))
    ;
  });

  it('destroys models correctly', function (done) {
    const kitten = adapter.build(Kitten, { name: 'smellyCat' });
    adapter.save(kitten, Kitten)
      .then(() => Kitten.count())
      .then(count => expect(count).to.be.equal(1))
      .then(() => adapter.destroy(kitten, Kitten))
      .then(() => Kitten.count())
      .then(count => expect(count).to.be.equal(0))
      .then(() => done())
      .catch(err => done(err))
    ;
  });
});
