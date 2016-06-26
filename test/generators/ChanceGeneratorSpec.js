/**
 * Created by chetanv on 08/06/16.
 */

import '../test-helper/testUtils';
import ChanceGenerator from '../../src/generators/ChanceGenerator';
import { expect } from 'chai';
// import _debug from 'debug';
import asyncFunction from '../test-helper/asyncFunction';

// const debug = _debug('ChanceGeneratorSpec');

describe('ChanceGenerator', function () {
  describe('#constructor', function () {
    it('validates the passed chance method', function () {
      /* eslint-disable no-new */
      function invalidMethod() {
        new ChanceGenerator({}, 'invalidMethodName');
      }

      function validMethod() {
        new ChanceGenerator({}, 'bool');
      }
      /* eslint-enable no-new */

      expect(invalidMethod).to.throw(Error);
      expect(validMethod).to.not.throw(Error);
    });

    it('stores methodName and options', function () {
      const chance = new ChanceGenerator({}, 'bool', { likelihood: 30 });
      expect(chance.method).to.be.equal('bool');
      expect(chance.options).to.be.eql({ likelihood: 30 });
    });
  });

  describe('#generate', function () {
    it('returns a promise', function () {
      const chance = new ChanceGenerator({}, 'bool', { likelihood: 30 });
      const valP = chance.generate();
      expect(valP.then).to.be.a('function');
      return expect(valP).to.be.eventually.fulfilled;
    });

    it('resolves to a value', asyncFunction(async function () {
      const chance = new ChanceGenerator({}, 'bool', { likelihood: 30 });
      const val = await chance.generate();
      expect(val).to.exist;
    }));
  });
});
