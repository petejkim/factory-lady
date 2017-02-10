import '../test-helper/testUtils';
import ReduxORMAdapter from '../../src/adapters/ReduxORMAdapter';
import { expect } from 'chai';
import DummyReduxORMModel from '../test-helper/DummyReduxORMModel';
import asyncFunction from '../test-helper/asyncFunction';
import { ORM } from 'redux-orm';

const orm = new ORM();
orm.register(DummyReduxORMModel);
const session = orm.session();

describe('ReduxORMAdapter', function () {
  const adapter = new ReduxORMAdapter(session);
  it('can be created', function () {
    expect(adapter).to.be.an.instanceof(ReduxORMAdapter);
  });

  describe('#build', function () {
    it('builds the model', asyncFunction(async function () {
      const model = adapter.build('DummyReduxORMModel', {
        id: 1,
        type: 'City',
        name: 'Vic',
        country: 'ES',

      });
      expect(model).to.be.an.instanceof(DummyReduxORMModel);
    }));
  });

  describe('#save', function () {
    it('returns a promise', function () {
      const model = adapter.build('DummyReduxORMModel', {
        id: 1,
        type: 'City',
        name: 'Vic',
        country: 'ES',

      });
      const savedModelP = adapter.save(model, DummyReduxORMModel);
      expect(savedModelP.then).to.be.a('function');
      return expect(savedModelP).to.be.eventually.fulfilled;
    });
  });
  //
  describe('#destroy', function () {
    it('calls remove on the model', asyncFunction(async function () {
      const model = adapter.build('DummyReduxORMModel', {
        id: 1,
        type: 'City',
        name: 'Vic',
        country: 'ES',

      });
      const destroyedModel = await adapter.destroy(model, DummyReduxORMModel);
      expect(destroyedModel).to.be.equal(true);
    }));

    it('returns a promise', function () {
      const model = adapter.build('DummyReduxORMModel', {
        id: 1,
        type: 'City',
        name: 'Vic',
        country: 'ES',

      });
      const destroyedModelP = adapter.destroy(model, DummyReduxORMModel);
      expect(destroyedModelP.then).to.be.a('function');
      return expect(destroyedModelP).to.be.eventually.fulfilled;
    });
  });
});
