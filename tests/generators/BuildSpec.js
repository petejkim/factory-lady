/**
 * Created by chetanv on 06/06/16.
 */

import '../test-helper/testUtils';
import Build from '../../src/generators/Build';
import { expect } from 'chai';
import DummyFactoryGirl from '../test-helper/DummyFactoryGirl';
import asyncFunction from '../test-helper/asyncFunction';
import sinon from 'sinon';
// import _debug from 'debug';

// const debug = _debug('BuildSpec');

describe('Build', function () {
  describe('#generate', function () {
    const factoryGirl = new DummyFactoryGirl;
    const name = 'someModel';
    const key = 'someKey';
    const dummyAttrs = {};
    const dummyBuildOptions = {};
    const build
      = new Build(factoryGirl, name, key, dummyAttrs, dummyBuildOptions);

    it('calls create on the factoryGirl object',
      asyncFunction(async function () {
        sinon.spy(factoryGirl, 'build');
        await build.generate();
        expect(factoryGirl.build).to.have.been.calledWith(
          name, dummyAttrs, dummyBuildOptions
        );
        factoryGirl.build.restore();
      })
    );

    it('returns a promise', function () {
      const modelP = build.generate();
      expect(modelP.then).to.be.a('function');
      return expect(modelP).to.be.eventually.fulfilled;
    });

    it('resolves to the object returned by factory if key is null',
      asyncFunction(async function () {
        const buildWithNullKey = new Build(factoryGirl, name);
        const model = await buildWithNullKey.generate();
        expect(model).to.be.an('object');
      })
    );

    it('resolves to the object property returned by factory if key is not null',
      asyncFunction(async function () {
        const buildWithKey = new Build(factoryGirl, name, 'name');
        const modelA = await buildWithKey.generate();
        expect(modelA).to.be.equal('Jane');
      })
    );
  });
});
