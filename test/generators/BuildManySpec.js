/**
 * Created by chetanv on 06/06/16.
 */


import '../test-helper/testUtils';
import BuildMany from '../../src/generators/BuildMany';
import { expect } from 'chai';
import DummyFactoryGirl from '../test-helper/DummyFactoryGirl';
import asyncFunction from '../test-helper/asyncFunction';
import sinon from 'sinon';
// import _debug from 'debug';

// const debug = _debug('BuildManySpec');

describe('BuildMany', function () {
  const factoryGirl = new DummyFactoryGirl;

  describe('#generate', function () {
    it('calls buildMany on factoryGirl', asyncFunction(async function () {
      sinon.spy(factoryGirl, 'buildMany');
      const buildMany = new BuildMany(factoryGirl, 'model', 10);
      await buildMany.generate();
      expect(factoryGirl.buildMany).to.have.been.calledOnce;
      factoryGirl.buildMany.restore();
    }));

    it('passes arguments to buildMany correctly',
      asyncFunction(async function () {
        sinon.spy(factoryGirl, 'buildMany');
        const dummyAttrs = {};
        const dummyBuildOptions = {};
        const buildMany = new BuildMany(
          factoryGirl, 'model', 10, dummyAttrs, dummyBuildOptions
        );
        await buildMany.generate();
        expect(factoryGirl.buildMany).to.have.been.calledWith(
          'model', 10, dummyAttrs, dummyBuildOptions
        );
        factoryGirl.buildMany.restore();
      })
    );

    it('returns a promise', function () {
      const buildMany = new BuildMany(factoryGirl, 'model', 10);
      const modelsP = buildMany.generate();
      expect(modelsP.then).to.be.a('function');
      return expect(modelsP).to.be.eventually.fulfilled;
    });

    it('resolves to array returned by buildMany',
      asyncFunction(async function () {
        const buildMany = new BuildMany(factoryGirl, 'model', 10);
        const models = await buildMany.generate();
        expect(models).to.be.an('array');
        expect(models).to.have.lengthOf(2);
        expect(models[0].name).to.be.equal('Wayne');
        expect(models[1].age).to.be.equal(22);
      })
    );

    it('resolves to array of keys if key is set',
      asyncFunction(async function () {
        const buildMany = new BuildMany(factoryGirl, 'model', 10, 'age');
        const models = await buildMany.generate();
        expect(models).to.have.lengthOf(2);
        expect(models[0]).to.be.equal(32);
        expect(models[1]).to.be.equal(22);
      })
    );
  });
});
