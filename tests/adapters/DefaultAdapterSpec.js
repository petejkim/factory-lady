/**
 * Created by chetanv on 06/06/16.
 */

import '../test-helper/testUtils';
import DefaultAdapter from '../../src/adapters/DefaultAdapter';
import { expect } from 'chai';
import DummyModel from '../test-helper/DummyModel';
import asyncFunction from '../test-helper/asyncFunction';
// import _debug from 'debug';

// const debug = _debug('DefaultAdapterSpec');

describe('DefaultAdapter', function () {
  it('can be created', function () {
    const adapter = new DefaultAdapter;
    expect(adapter).to.be.an.instanceof(DefaultAdapter);
  });

  const adapter = new DefaultAdapter;

  describe('#build', function () {
    it('builds the model', asyncFunction(async function () {
      const model = await adapter.build(DummyModel, {
        name: 'Bruce',
        age: 204,
      });
      expect(model).to.be.an.instanceof(DummyModel);
      expect(model.name).to.be.equal('Bruce');
      expect(model.age).to.be.equal(204);
      expect(model.constructorCalled).to.be.equal(true);
    }));

    it('returns a promise', function () {
      const modelP = adapter.build(DummyModel, {});
      expect(modelP.then).to.be.a('function');
      return expect(modelP).to.be.eventually.fulfilled;
    });
  });

  describe('#save', function () {
    it('calls save on the model', asyncFunction(async function () {
      const model = new DummyModel;
      const savedModel = await adapter.save(DummyModel, model);
      expect(savedModel.saveCalled).to.be.equal(true);
    }));

    it('returns a promise', function () {
      const model = new DummyModel;
      const savedModelP = adapter.save(DummyModel, model);
      expect(savedModelP.then).to.be.a('function');
      return expect(savedModelP).to.be.eventually.fulfilled;
    });

    it('resolves to the object itself', asyncFunction(async function () {
      const model = new DummyModel;
      const savedModel = await adapter.save(DummyModel, model);
      expect(savedModel).to.be.equal(model);
    }));
  });

  describe('#destroy', function () {
    it('calls destroy on the model', asyncFunction(async function () {
      const model = new DummyModel;
      const destroyedModel = await adapter.destroy(DummyModel, model);
      expect(destroyedModel.destroyCalled).to.be.equal(true);
    }));

    it('returns a promise', function () {
      const model = new DummyModel;
      const destroyedModelP = adapter.destroy(DummyModel, model);
      expect(destroyedModelP.then).to.be.a('function');
      return expect(destroyedModelP).to.be.eventually.fulfilled;
    });

    it('resolves to the object itself', asyncFunction(async function () {
      const model = new DummyModel;
      const destroyedModel = await adapter.destroy(DummyModel, model);
      expect(destroyedModel).to.be.equal(model);
    }));
  });
});
