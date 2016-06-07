/**
 * Created by chetanv on 06/06/16.
 */


import '../../test-helper/testUtils';
import BuildMany from '../../src/generators/BuildMany'
import {expect} from 'chai';
import Debug from 'debug';
import DummyFactoryGirl from '../../test-helper/DummyFactoryGirl';
import asyncFunction from '../../test-helper/asyncFunction';
import sinon from 'sinon';

const debug = Debug('BuildManySpec');

describe('BuildMany', function () {
  const factoryGirl = new DummyFactoryGirl;

  describe('#constructor', function () {
    const buildMany = new BuildMany(factoryGirl, 'model', 10);

    it('can be created', function () {
      expect(buildMany).to.be.instanceof(BuildMany);
    });

    it('stores the number of instances to be buildiated', function () {
      expect(buildMany.num).to.be.equal(10);
    });

    it('throws error if num is not valid', function () {
      function noNum() {
        new BuildMany(factoryGirl, 'model');
      }

      function invalidNum() {
        new BuildMany(factoryGirl, 'model', 'not-a-num');
      }

      function lessThanOne() {
        new BuildMany(factoryGirl, 'model', -1);
      }

      expect(noNum).to.throw(Error);
      expect(invalidNum).to.throw(Error);
      expect(lessThanOne).to.throw(Error);
    });
  });

  describe('#generate', function () {
    it('calls buildMany on factoryGirl', asyncFunction(async function () {
      sinon.spy(factoryGirl, 'buildMany');
      const buildMany = new BuildMany(factoryGirl, 'model', 10);
      await buildMany.generate();
      expect(factoryGirl.buildMany).to.have.been.calledOnce;
      factoryGirl.buildMany.restore();
    }));

    it('passes arguments to buildMany correctly', asyncFunction(async function () {
      sinon.spy(factoryGirl, 'buildMany');
      const dummyAttrs = {};
      const dummyBuildOptions = {};
      const buildMany = new BuildMany(factoryGirl, 'model', 10, dummyAttrs, dummyBuildOptions);
      await buildMany.generate();
      expect(factoryGirl.buildMany).to.have.been.calledWith('model', 10, dummyAttrs, dummyBuildOptions);
      factoryGirl.buildMany.restore();
    }));

    it('returns a promise', function () {
      const buildMany = new BuildMany(factoryGirl, 'model', 10);
      const modelsP = buildMany.generate();
      expect(modelsP.then).to.be.a('function');
      return expect(modelsP).to.be.eventually.fulfilled;
    });

    it('resolves to array returned by buildMany', asyncFunction(async function () {
      const buildMany = new BuildMany(factoryGirl, 'model', 10);
      const models = await buildMany.generate();
      expect(models).to.be.an('array');
      expect(models).to.have.lengthOf(2);
      expect(models[0].name).to.be.equal('Wayne');
      expect(models[1].age).to.be.equal(22);
    }));

    it('resolves to array of keys if key is set', asyncFunction(async function () {
      const buildMany = new BuildMany(factoryGirl, 'model', 10, 'age');
      const models = await buildMany.generate();
      expect(models).to.have.lengthOf(2);
      expect(models[0]).to.be.equal(32);
      expect(models[1]).to.be.equal(22);
    }));
  });
});

