
import '../test-helper/testUtils';
import Assoc from '../../src/generators/Assoc';
import { expect } from 'chai';
import DummyFactoryGirl from '../test-helper/DummyFactoryGirl';
import asyncFunction from '../test-helper/asyncFunction';
import sinon from 'sinon';
// import _debug from 'debug';

// const debug = _debug('AssocSpec');

describe('Assoc', function () {
  describe('#generate', function () {
    const factoryGirl = new DummyFactoryGirl;
    const name = 'someModel';
    const key = 'someKey';
    const dummyAttrs = {};
    const dummyBuildOptions = {};
    const assoc = new Assoc(factoryGirl);

    it('calls create on the factoryGirl object',
      asyncFunction(async function () {
        sinon.spy(factoryGirl, 'create');
        await assoc.generate(name, key, dummyAttrs, dummyBuildOptions);
        expect(factoryGirl.create).to.have.been.calledWith(
          name, dummyAttrs, dummyBuildOptions
        );
        factoryGirl.create.restore();
      })
    );

    it('returns a promise', function () {
      const modelP = assoc.generate(name, key, dummyAttrs, dummyBuildOptions);
      expect(modelP.then).to.be.a('function');
      return expect(modelP).to.be.eventually.fulfilled;
    });

    it('resolves to the object returned by factory if key is null',
      asyncFunction(async function () {
        const assocWithNullKey = new Assoc(factoryGirl);
        const model = await assocWithNullKey.generate(name);
        expect(model).to.be.an('object');
      })
    );

    it('resolves to the object property returned by factory if key is not null',
      asyncFunction(async function () {
        const assocWithKey = new Assoc(factoryGirl);
        const modelA = await assocWithKey.generate(name, 'name');
        expect(modelA).to.be.equal('Wayne');
      })
    );
  });
});
