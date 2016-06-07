/**
 * Created by chetanv on 06/06/16.
 */

import '../test-helper/testUtils';
import Assoc from '../../src/generators/Assoc'
import {expect} from 'chai';
import Debug from 'debug';
import DummyFactoryGirl from '../test-helper/DummyFactoryGirl';
import asyncFunction from '../test-helper/asyncFunction';
import sinon from 'sinon';

const debug = Debug('AssocSpec');

describe('Assoc', function () {
  describe('#generate', function () {
    const factoryGirl = new DummyFactoryGirl;
    const name = 'someModel';
    const key = 'someKey';
    const dummyAttrs = {};
    const dummyBuildOptions = {};
    const assoc = new Assoc(factoryGirl, name, key, dummyAttrs, dummyBuildOptions);

    it('calls create on the factoryGirl object', asyncFunction(async function () {
      sinon.spy(factoryGirl, 'create');
      await assoc.generate();
      expect(factoryGirl.create).to.have.been.calledWith(name, dummyAttrs, dummyBuildOptions);
      factoryGirl.create.restore();
    }));

    it('returns a promise', function () {
      const modelP = assoc.generate();
      expect(modelP.then).to.be.a('function');
      return expect(modelP).to.be.eventually.fulfilled;
    });

    it('resolves to the object returned by factory if key is null', asyncFunction(async function () {
      const assoc = new Assoc(factoryGirl, name);
      const model = await assoc.generate();
      expect(model).to.be.an('object');
    }));

    it('resolves to the object attribute returned by factory if key is not null', asyncFunction(async function () {
      const assoc = new Assoc(factoryGirl, name, 'name');
      const model_a = await assoc.generate();
      expect(model_a).to.be.equal('Wayne');
    }));
  });
});