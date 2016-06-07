/**
 * Created by chetanv on 06/06/16.
 */

import '../test-helper/testUtils';
import ObjectAdapter from '../../src/adapters/ObjectAdapter';
import {expect} from 'chai';
import Debug from 'debug';
import DummyModel from '../test-helper/DummyModel';
import asyncFunction from '../test-helper/asyncFunction';

const debug = Debug('ObjectAdapterSpec');

describe('ObjectAdapter', function () {
  it('can be created', function () {
    const adapter = new ObjectAdapter;
    expect(adapter).to.be.an.instanceof(ObjectAdapter);
  });

  const adapter = new ObjectAdapter;

  describe('#build', function () {
    it('builds the model', asyncFunction(async function () {
      const model = await adapter.build(DummyModel, {a: 1, b: 2});
      expect(model).to.be.an.instanceof(DummyModel);
      expect(model.a).to.be.equal(1);
      expect(model.b).to.be.equal(2);
    }));

    it('returns a promise', function () {
      const modelP = adapter.build(DummyModel, {a: 1, b: 2});
      expect(modelP.then).to.be.a('function');
      return expect(modelP).to.be.eventually.fulfilled;
    });
  });

  describe('#save', function () {
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