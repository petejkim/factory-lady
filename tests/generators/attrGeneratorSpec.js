/**
 * Created by chetanv on 06/06/16.
 */


import '../../test-helper/testUtils';
import attrGenerator from '../../src/generators/attrGenerator';
import {expect} from 'chai';
import Debug from 'debug';
import DummyFactoryGirl from '../../test-helper/DummyFactoryGirl';
import DummyGenerator from '../../test-helper/DummyGenerator';
import asyncFunction from '../../test-helper/asyncFunction';
import sinon from 'sinon';

const debug = Debug('attrGeneratorSpec');

describe('attrGenerator', function () {
  it('returns a function', function () {
    const generatorFunc = attrGenerator({}, DummyGenerator);
    expect(generatorFunc).to.be.a('function');
  });

  describe('[returned function]', function () {
    const spy = sinon.spy(DummyGenerator);
    const factory = new DummyFactoryGirl;
    const generatorFunc = attrGenerator(factory, spy);

    it('creates an instance of passed Generator', function () {
      generatorFunc();
      expect(spy).to.have.been.calledWith(factory);
    });

    it('passes arguments to Generator constructor', function () {
      generatorFunc(1, 2, 3);
      expect(spy).to.have.been.calledWith(factory, 1, 2, 3);
    });

    it('returns another value function', function () {
      const valueFunction = generatorFunc(1);
      expect(valueFunction).to.be.a('function');
    });

    describe('[value function]', function () {
      const valueFunction = generatorFunc(1);

      it('returns a promise', function () {
        const valueP = valueFunction();
        expect(valueP.then).to.be.a('function');
        return expect(valueP).to.be.eventually.fulfilled;
      });

      it('resolves to generator#generate value', asyncFunction(async function () {
        const value = await valueFunction();
        expect(value).to.be.equal('hello');
      }));
    });
  });
});