
import '../test-helper/testUtils';
import ObjectAdapter from '../../src/adapters/ObjectAdapter';
import { expect } from 'chai';
import DummyModel from '../test-helper/DummyModel';
import asyncFunction from '../test-helper/asyncFunction';

describe('ObjectAdapter', function () {
  it('can be created', function () {
    const adapter = new ObjectAdapter;
    expect(adapter).to.be.an.instanceof(ObjectAdapter);
  });

  const adapter = new ObjectAdapter;

  describe('#build', function () {
    it('builds the model', asyncFunction(async function () {
      const model = adapter.build(DummyModel, { a: 1, b: 2 });
      expect(model).to.be.an.instanceof(DummyModel);
      expect(model.a).to.be.equal(1);
      expect(model.b).to.be.equal(2);
    }));

  });

  describe('#save', function () {
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
