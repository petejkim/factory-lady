/**
 * Created by chetanv on 01/06/16.
 */


import Factory from '../src/Factory';

import {expect} from 'chai';

describe('Factory', function () {
  it('can be created', function () {
    const factory = new Factory;
    expect(factory).to.be.an.instanceof(Factory);
  })
});