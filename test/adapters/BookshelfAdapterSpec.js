import '../test-helper/testUtils';
import BookshelfAdapter from '../../src/adapters/BookshelfAdapter';
import { expect } from 'chai';
import DummyModel from '../test-helper/DummyModel';
import asyncFunction from '../test-helper/asyncFunction';

describe('BookshelfAdapter', function () {
  it('can be created', function () {
    const adapter = new BookshelfAdapter;
    expect(adapter).to.be.an.instanceof(BookshelfAdapter);
  });

  const adapter = new BookshelfAdapter;

  describe('#build', function () {
    it('builds the model', asyncFunction(async function () {
      const model = adapter.build(DummyModel, {});
      expect(model).to.be.an.instanceof(DummyModel);
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
