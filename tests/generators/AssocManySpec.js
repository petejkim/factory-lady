/**
 * Created by chetanv on 06/06/16.
 */


import '../test-helper/testUtils';
import AssocMany from '../../src/generators/AssocMany'
import {expect} from 'chai';
import Debug from 'debug';
import DummyFactoryGirl from '../test-helper/DummyFactoryGirl';
import asyncFunction from '../test-helper/asyncFunction';
import sinon from 'sinon';

const debug = Debug('AssocManySpec');

describe('AssocMany', function () {
  const factoryGirl = new DummyFactoryGirl;

  describe('#generate', function () {
    it('calls createMany on factoryGirl', asyncFunction(async function () {
      sinon.spy(factoryGirl, 'createMany');
      const assocMany = new AssocMany(factoryGirl, 'model', 10);
      await assocMany.generate();
      expect(factoryGirl.createMany).to.have.been.calledOnce;
      factoryGirl.createMany.restore();
    }));

    it('passes arguments to createMany correctly', asyncFunction(async function () {
      sinon.spy(factoryGirl, 'createMany');
      const dummyAttrs = {};
      const dummyBuildOptions = {};
      const assocMany = new AssocMany(factoryGirl, 'model', 10, dummyAttrs, dummyBuildOptions);
      await assocMany.generate();
      expect(factoryGirl.createMany).to.have.been.calledWith('model', 10, dummyAttrs, dummyBuildOptions);
      factoryGirl.createMany.restore();
    }));

    it('returns a promise', function () {
      const assocMany = new AssocMany(factoryGirl, 'model', 10);
      const modelsP = assocMany.generate();
      expect(modelsP.then).to.be.a('function');
      return expect(modelsP).to.be.eventually.fulfilled;
    });

    it('resolves to array returned by createMany', asyncFunction(async function () {
      const assocMany = new AssocMany(factoryGirl, 'model', 10);
      const models = await assocMany.generate();
      expect(models).to.be.an('array');
      expect(models).to.have.lengthOf(2);
      expect(models[0].name).to.be.equal('Wayne');
      expect(models[1].age).to.be.equal(21);
    }));

    it('resolves to array of keys if key is set', asyncFunction(async function () {
      const assocMany = new AssocMany(factoryGirl, 'model', 10, 'name');
      const models = await assocMany.generate();
      expect(models).to.have.lengthOf(2);
      expect(models[0]).to.be.equal('Wayne');
      expect(models[1]).to.be.equal('Jane');
    }));
  });
});

