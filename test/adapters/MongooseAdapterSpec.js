import '../test-helper/testUtils';
import MongooseAdapter from '../../src/adapters/MongooseAdapter';
import { expect } from 'chai';
import DummyMongooseModel from '../test-helper/DummyMongooseModel';
import asyncFunction from '../test-helper/asyncFunction';

describe('MongooseAdapter', function () {
  it('can be created', function () {
    const adapter = new MongooseAdapter;
    expect(adapter).to.be.an.instanceof(MongooseAdapter);
  });

  const adapter = new MongooseAdapter;

  describe('#build', function () {
    it('builds the model', asyncFunction(async function () {
      const model = adapter.build(DummyMongooseModel, {});
      expect(model).to.be.an.instanceof(DummyMongooseModel);
      expect(model.constructorCalled).to.be.equal(true);
    }));
  });

  describe('#save', function () {
    it('calls save on the model', asyncFunction(async function () {
      const model = new DummyMongooseModel;
      const savedModel = await adapter.save(model, DummyMongooseModel);
      expect(savedModel.saveCalled).to.be.equal(true);
    }));

    it('returns a promise', function () {
      const model = new DummyMongooseModel;
      const savedModelP = adapter.save(model, DummyMongooseModel);
      expect(savedModelP.then).to.be.a('function');
      return expect(savedModelP).to.be.eventually.fulfilled;
    });

    it('resolves to the object itself', asyncFunction(async function () {
      const model = new DummyMongooseModel;
      const savedModel = await adapter.save(model, DummyMongooseModel);
      expect(savedModel).to.be.equal(model);
    }));
  });

  describe('#destroy', function () {
    it('calls remove on the model', asyncFunction(async function () {
      const model = new DummyMongooseModel;
      const destroyedModel = await adapter.destroy(model, DummyMongooseModel);
      expect(destroyedModel.removeCalled).to.be.equal(true);
    }));

    it('returns a promise', function () {
      const model = new DummyMongooseModel;
      const destroyedModelP = adapter.destroy(model, DummyMongooseModel);
      expect(destroyedModelP.then).to.be.a('function');
      return expect(destroyedModelP).to.be.eventually.fulfilled;
    });

    it('resolves to the object itself', asyncFunction(async function () {
      const model = new DummyMongooseModel;
      const destroyedModel = await adapter.destroy(model, DummyMongooseModel);
      expect(destroyedModel).to.be.equal(model);
    }));
  });
});
