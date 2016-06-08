/**
 * Created by chetanv on 06/06/16.
 */

import '../test-helper/testUtils';
import AssocAttrs from '../../src/generators/AssocAttrs'
import {expect} from 'chai';
import Debug from 'debug';
import DummyFactoryGirl from '../test-helper/DummyFactoryGirl';
import asyncFunction from '../test-helper/asyncFunction';
import sinon from 'sinon';

const debug = Debug('AssocAttrsSpec');

describe('AssocAttrs', function () {
  describe('#generate', function () {
    const factoryGirl = new DummyFactoryGirl;
    const name = 'someModel';
    const key = 'someKey';
    const dummyAttrs = {};
    const dummyBuildOptions = {};
    const assocAttrs = new AssocAttrs(factoryGirl, name, key, dummyAttrs, dummyBuildOptions);

    it('calls attrs on the factoryGirl object', asyncFunction(async function () {
      const spy = sinon.spy(factoryGirl, 'attrs');
      await assocAttrs.generate();
      expect(spy).to.have.been.calledWith(name, dummyAttrs, dummyBuildOptions);
      factoryGirl.attrs.restore();
    }));

    it('returns a promise', function () {
      const modelP = assocAttrs.generate();
      expect(modelP.then).to.be.a('function');
      return expect(modelP).to.be.eventually.fulfilled;
    });

    it('resolves to the object returned by factory if key is null', asyncFunction(async function () {
      const assocAttrs = new AssocAttrs(factoryGirl, name);
      const model = await assocAttrs.generate();
      expect(model).to.be.an('object');
    }));

    it('resolves to the object attribute returned by factory if key is not null', asyncFunction(async function () {
      const assocAttrs = new AssocAttrs(factoryGirl, name, 'name');
      const model_a = await assocAttrs.generate();
      expect(model_a).to.be.equal('Bill');
    }));
  });
});