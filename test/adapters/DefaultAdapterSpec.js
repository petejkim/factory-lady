
import '../test-helper/testUtils';
import DefaultAdapter from '../../src/adapters/DefaultAdapter';
import { expect } from 'chai';
import DummyModel from '../test-helper/DummyModel';
import asyncFunction from '../test-helper/asyncFunction';

describe('DefaultAdapter', function () {
  it('can be created', function () {
    const adapter = new DefaultAdapter;
    expect(adapter).to.be.an.instanceof(DefaultAdapter);
  });

  const adapter = new DefaultAdapter;

  describe('#build', function () {
    it('builds the model', asyncFunction(async function () {
      const model = adapter.build(DummyModel, {
        name: 'Bruce',
        age: 204,
      });
      expect(model).to.be.an.instanceof(DummyModel);
      expect(model.attrs.name).to.be.equal('Bruce');
      expect(model.attrs.age).to.be.equal(204);
      expect(model.constructorCalled).to.be.equal(true);
    }));

  });

  describe('#save', function () {
    it('calls save on the model', asyncFunction(async function () {
      const model = new DummyModel;
      const savedModel = await adapter.save(model, DummyModel);
      expect(savedModel.saveCalled).to.be.equal(true);
    }));

    it('returns a promise', function () {
      const model = new DummyModel;
      const savedModelP = adapter.save(model, DummyModel);
      expect(savedModelP.then).to.be.a('function');
      return expect(savedModelP).to.be.eventually.fulfilled;
    });

    it('resolves to the object itself', asyncFunction(async function () {
      const model = new DummyModel;
      const savedModel = await adapter.save(model, DummyModel);
      expect(savedModel).to.be.equal(model);
    }));
  });

  describe('#destroy', function () {
    it('calls destroy on the model', asyncFunction(async function () {
      const model = new DummyModel;
      const destroyedModel = await adapter.destroy(model, DummyModel);
      expect(destroyedModel.destroyCalled).to.be.equal(true);
    }));

    it('returns a promise', function () {
      const model = new DummyModel;
      const destroyedModelP = adapter.destroy(model, DummyModel);
      expect(destroyedModelP.then).to.be.a('function');
      return expect(destroyedModelP).to.be.eventually.fulfilled;
    });

    it('resolves to the object itself', asyncFunction(async function () {
      const model = new DummyModel;
      const destroyedModel = await adapter.destroy(model, DummyModel);
      expect(destroyedModel).to.be.equal(model);
    }));
  });
});
