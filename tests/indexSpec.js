/**
 * Created by chetanv on 08/06/16.
 */

import {expect} from 'chai';
import Factory from '../src';
import Debug from 'debug';
import ObjectAdapter from '../src/adapters/ObjectAdapter';
import './test-helper/dummyFactories'
import asyncFunction from './test-helper/asyncFunction';
import {User, Address, PhoneNumber} from './test-helper/dummyModels';

const debug = Debug('indexSpec');

describe('index', function () {
  Factory.setAdapter(new ObjectAdapter);
  beforeEach(function () {
    Factory.cleanUp();
  });

  describe('PhoneNumber factory', function () {
    it('can get attrs', asyncFunction(async function () {
      const attrs = await Factory.attrs('PhoneNumber');
      expect(attrs).to.be.eql({
        type: 'mobile',
        number: '1234567890'
      });
    }));

    it('can override attrs', asyncFunction(async function () {
      const attrs = await Factory.attrs('PhoneNumber', {number: '0987654321'});
      expect(attrs).to.be.eql({
        type: 'mobile',
        number: '0987654321'
      });
    }));

    it('can override attrs with generators as well', asyncFunction(async function () {
      const attrs = await Factory.attrs('PhoneNumber', {alternate: Factory.assocAttrs('PhoneNumber')});
      expect(attrs.alternate).to.be.eql({
        type: 'mobile',
        number: '1234567890'
      });
    }));

    it('can get multiple attrs', asyncFunction(async function () {
      const attrs = await Factory.attrsMany('PhoneNumber', 3, {number: Factory.seq('PhoneNumber.override', n => `123-${n}`)});
      expect(attrs).to.be.an('array');
      expect(attrs).to.have.lengthOf(3);
    }));

    it('can use chance generator', asyncFunction(async function () {
      const attrs = await Factory.attrs('User');
      expect(attrs.bio).to.exist;
    }))
  })
});
