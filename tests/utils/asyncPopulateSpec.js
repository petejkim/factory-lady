/**
 * Created by chetanv on 07/06/16.
 */


import '../../test-helper/testUtils';
import asyncPopulate from '../../src/utils/asyncPopulate';
import {expect} from 'chai';
import Debug from 'debug';
import asyncFunction from '../../test-helper/asyncFunction';

const debug = Debug('asyncPopulateSpec');

describe('asyncPopulate', function () {
  it('returns a promise', function () {
    const asyncPopulateP = asyncPopulate({}, {});
    expect(asyncPopulateP.then).to.be.a('function');
    return expect(asyncPopulateP).to.be.eventually.fulfilled;
  });
  
  it('populates objects correctly', asyncFunction(async function () {
    const source = {
      num: 1,
      str: 'hello',
      funcs: {
        sync: function() { return 'shouldHaveThisValue' },
        async: async function () { return 'shouldHaveResolvedValue'; },
        promise: function () { return Promise.resolve('shouldWorkWithPromises'); }
      },
      arrays: {
        simple: [1, 2, 3],
        funcs: [
          function() { return 1; },
          async function () { return 2; },
          function () { return Promise.resolve(3); }
        ],
        nested: [
          1, [
            {a: 1, b: 2},
            {c: 3, d: 4},
            [
              {
                p: function () { return 20 },
                q: [6, 7]
              }
            ]
          ]
        ]
      }
    };

    const target = {};
    await asyncPopulate(target, source);

    expect(target).to.be.eql({
      num: 1,
      str: 'hello',
      funcs: {
        sync: 'shouldHaveThisValue',
        async: 'shouldHaveResolvedValue',
        promise: 'shouldWorkWithPromises'
      },
      arrays: {
        simple: [1, 2, 3],
        funcs: [1, 2, 3],
        nested: [
          1, [
            {a: 1, b: 2},
            {c: 3, d: 4},
            [
              {
                p: 20,
                q: [6, 7]
              }
            ]
          ]
        ]
      }
    });
  }));

  it('overrides only provided data', asyncFunction(async function () {
    const target = {
      x: {
        y: 1,
        z: 3
      },
      p: [1, 2, 3]
    };
    const source = {
      x: {
        y: function () { return 'yo'; }
      },
      p: [4]
    };

    await asyncPopulate(target, source);

    expect(target).to.be.eql({
      x: {
        y: 'yo',
        z: 3
      },
      p: [4]
    });

  }));
});
