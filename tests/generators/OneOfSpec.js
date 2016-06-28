/**
 * Created by chetanv on 24/06/16.
 */

import OneOf from '../../src/generators/OneOf';
import { expect } from 'chai';
import asyncFunction from '../test-helper/asyncFunction';

describe('OneOf', function () {
  describe('#constructor', function () {
    it('validates possible values', function () {
      /* eslint-disable no-new */
      function invalidValuesArray() {
        new OneOf({}, 23);
      }

      function emptyValuesArray() {
        new OneOf({}, []);
      }

      function validValuesArray() {
        new OneOf({}, [1, 2, 3]);
      }

      /* eslint-enable no-new */

      expect(invalidValuesArray).to.throw(Error);
      expect(emptyValuesArray).to.throw(Error);
      expect(validValuesArray).to.not.throw(Error);
    });
  });

  describe('#generate', function () {
    it('returns a promise', function () {
      const possibleValues = [1, 'two', 'III'];
      const oneOf = new OneOf({}, possibleValues);

      const valP = oneOf.generate();
      expect(valP.then).to.be.a('function');
      return expect(valP).to.be.eventually.fulfilled;
    });

    it('always generates one of the passed values',
      asyncFunction(async function () {
        const possibleValues = [1, 'two', 'III'];
        const oneOf = new OneOf({}, possibleValues);

        for (let i = 0; i < 5; i++) {
          const aValue = await oneOf.generate();
          expect(possibleValues.indexOf(aValue) > -1).to.be.true;
        }
      })
    );

    it('can accept functions as values', asyncFunction(async function () {
      const possibleValues = [() => 23];
      const oneOf = new OneOf({}, possibleValues);

      const val = await oneOf.generate();
      expect(val).to.be.equal(23);
    }));

    it('can accept async functions as values', asyncFunction(async function () {
      const possibleValues = [async() => 23];
      const oneOf = new OneOf({}, possibleValues);

      const val = await oneOf.generate();
      expect(val).to.be.equal(23);
    }));

    it('can accept functions returning promises as values',
      asyncFunction(async function () {
        const possibleValues = [() => Promise.resolve(23)];
        const oneOf = new OneOf({}, possibleValues);

        const val = await oneOf.generate();
        expect(val).to.be.equal(23);
      })
    );

    it('can accept promises as values',
      asyncFunction(async function () {
        const possibleValues = [Promise.resolve(23)];
        const oneOf = new OneOf({}, possibleValues);

        const val = await oneOf.generate();
        expect(val).to.be.equal(23);
      })
    );
  });
});
