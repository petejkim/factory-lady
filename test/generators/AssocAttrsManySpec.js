

import '../test-helper/testUtils';
import AssocAttrsMany from '../../src/generators/AssocAttrsMany';
import { expect } from 'chai';
import DummyFactoryGirl from '../test-helper/DummyFactoryGirl';
import asyncFunction from '../test-helper/asyncFunction';
import sinon from 'sinon';

describe('AssocAttrsMany', function () {
  const factoryGirl = new DummyFactoryGirl;

  describe('#generate', function () {
    it('calls attrsMany on factoryGirl', asyncFunction(async function () {
      sinon.spy(factoryGirl, 'attrsMany');
      const assocAttrsMany = new AssocAttrsMany(factoryGirl);
      await assocAttrsMany.generate('model', 10);
      expect(factoryGirl.attrsMany).to.have.been.calledOnce;
      factoryGirl.attrsMany.restore();
    }));

    it('passes arguments to attrsMany correctly',
      asyncFunction(async function () {
        sinon.spy(factoryGirl, 'attrsMany');
        const dummyAttrs = {};
        const dummyBuildOptions = {};
        const assocAttrsMany = new AssocAttrsMany(factoryGirl);
        await assocAttrsMany.generate('model', 10, dummyAttrs, dummyBuildOptions);
        expect(factoryGirl.attrsMany).to.have.been.calledWith(
          'model', 10, dummyAttrs, dummyBuildOptions
        );
        factoryGirl.attrsMany.restore();
      })
    );

    it('returns a promise', function () {
      const assocAttrsMany = new AssocAttrsMany(factoryGirl);
      const modelsP = assocAttrsMany.generate('model', 10);
      expect(modelsP.then).to.be.a('function');
      return expect(modelsP).to.be.eventually.fulfilled;
    });

    it('resolves to array returned by attrsMany',
      asyncFunction(async function () {
        const assocAttrsMany = new AssocAttrsMany(factoryGirl);
        const models = await assocAttrsMany.generate('model', 10);
        expect(models).to.be.an('array');
        expect(models).to.have.lengthOf(2);
        expect(models[0].attrs.name).to.be.equal('Andrew');
        expect(models[1].attrs.age).to.be.equal(25);
      })
    );

    it('resolves to array of keys if key is set',
      asyncFunction(async function () {
        const assocAttrsMany
          = new AssocAttrsMany(factoryGirl);
        const models = await assocAttrsMany.generate('model', 10, 'name');
        expect(models).to.have.lengthOf(2);
        expect(models[0]).to.be.equal('Andrew');
        expect(models[1]).to.be.equal('Isaac');
      })
    );
  });
});
