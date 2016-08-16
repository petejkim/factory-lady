import '../test-helper/testUtils';
import SequelizeAdapter from '../../src/adapters/SequelizeAdapter';
import { expect } from 'chai';
import DummySequelizeModel from '../test-helper/DummySequelizeModel';
import asyncFunction from '../test-helper/asyncFunction';

describe('SequelizeAdapter', function () {
  it('can be created', function () {
    const adapter = new SequelizeAdapter;
    expect(adapter).to.be.an.instanceof(SequelizeAdapter);
  });

  const adapter = new SequelizeAdapter;

  describe('#build', function () {
    it('builds the model', asyncFunction(async function () {
      const model = adapter.build(DummySequelizeModel, {});
      expect(model).to.be.an.instanceof(DummySequelizeModel);
      expect(model.constructorCalled).to.be.equal(true);
    }));
  });

  describe('#save', function () {
    it('calls save on the model', asyncFunction(async function () {
      const model = new DummySequelizeModel;
      const savedModel = await adapter.save(model, DummySequelizeModel);
      expect(savedModel.saveCalled).to.be.equal(true);
    }));

    it('returns a promise', function () {
      const model = new DummySequelizeModel;
      const savedModelP = adapter.save(model, DummySequelizeModel);
      expect(savedModelP.then).to.be.a('function');
      return expect(savedModelP).to.be.eventually.fulfilled;
    });

    it('resolves to the object itself', asyncFunction(async function () {
      const model = new DummySequelizeModel;
      const savedModel = await adapter.save(model, DummySequelizeModel);
      expect(savedModel).to.be.equal(model);
    }));
  });

  describe('#destroy', function () {
    it('calls destroy on the model', asyncFunction(async function () {
      const model = new DummySequelizeModel;
      const destroyedModel = await adapter.destroy(model, DummySequelizeModel);
      expect(destroyedModel.destroyCalled).to.be.equal(true);
    }));

    it('returns a promise', function () {
      const model = new DummySequelizeModel;
      const destroyedModelP = adapter.destroy(model, DummySequelizeModel);
      expect(destroyedModelP.then).to.be.a('function');
      return expect(destroyedModelP).to.be.eventually.fulfilled;
    });

    it('resolves to the object itself', asyncFunction(async function () {
      const model = new DummySequelizeModel;
      const destroyedModel = await adapter.destroy(model, DummySequelizeModel);
      expect(destroyedModel).to.be.equal(model);
    }));
  });
});
