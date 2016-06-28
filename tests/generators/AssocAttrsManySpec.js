/**
 * Created by chetanv on 06/06/16.
 */


import '../test-helper/testUtils';
import AssocAttrsMany from '../../src/generators/AssocAttrsMany';
import { expect } from 'chai';
import DummyFactoryGirl from '../test-helper/DummyFactoryGirl';
import asyncFunction from '../test-helper/asyncFunction';
import sinon from 'sinon';
// import _debug from 'debug';

// const debug = _debug('AssocAttrsManySpec');

describe('AssocAttrsMany', function () {
  const factoryGirl = new DummyFactoryGirl;

  describe('#generate', function () {
    it('calls attrsMany on factoryGirl', asyncFunction(async function () {
      sinon.spy(factoryGirl, 'attrsMany');
      const assocAttrsMany = new AssocAttrsMany(factoryGirl, 'model', 10);
      await assocAttrsMany.generate();
      expect(factoryGirl.attrsMany).to.have.been.calledOnce;
      factoryGirl.attrsMany.restore();
    }));

    it('passes arguments to attrsMany correctly',
      asyncFunction(async function () {
        sinon.spy(factoryGirl, 'attrsMany');
        const dummyAttrs = {};
        const dummyBuildOptions = {};
        const assocAttrsMany = new AssocAttrsMany(
          factoryGirl, 'model', 10, dummyAttrs, dummyBuildOptions
        );
        await assocAttrsMany.generate();
        expect(factoryGirl.attrsMany).to.have.been.calledWith(
          'model', 10, dummyAttrs, dummyBuildOptions
        );
        factoryGirl.attrsMany.restore();
      })
    );

    it('returns a promise', function () {
      const assocAttrsMany = new AssocAttrsMany(factoryGirl, 'model', 10);
      const modelsP = assocAttrsMany.generate();
      expect(modelsP.then).to.be.a('function');
      return expect(modelsP).to.be.eventually.fulfilled;
    });

    it('resolves to array returned by attrsMany',
      asyncFunction(async function () {
        const assocAttrsMany = new AssocAttrsMany(factoryGirl, 'model', 10);
        const models = await assocAttrsMany.generate();
        expect(models).to.be.an('array');
        expect(models).to.have.lengthOf(2);
        expect(models[0].name).to.be.equal('Andrew');
        expect(models[1].age).to.be.equal(25);
      })
    );

    it('resolves to array of keys if key is set',
      asyncFunction(async function () {
        const assocAttrsMany
          = new AssocAttrsMany(factoryGirl, 'model', 10, 'name');
        const models = await assocAttrsMany.generate();
        expect(models).to.have.lengthOf(2);
        expect(models[0]).to.be.equal('Andrew');
        expect(models[1]).to.be.equal('Isaac');
      })
    );
  });
});
