/**
 * Created by chetanv on 08/06/16.
 */

import Factory from '../../src';
import Debug from 'debug';
import {User, Address, PhoneNumber} from './dummyModels';

const debug = Debug('dummyFactories');

Factory.define('PhoneNumber', PhoneNumber, {
  type: 'mobile',
  number: '1234567890'
});

Factory.define('PhoneNumber2', PhoneNumber, function (buildOptions) {
  const attrs = {
    type: 'mobile',
    number: Factory.seq('PhoneNumber2.number', n => `1234567890-${n}`)
  };

  if (buildOptions.landline) {
    attrs.type = 'landline';
  }

  return attrs;
});

Factory.define('Address', Address, function (buildOptions) {
  const attrs = {
    id: Factory.seq('Address.id'),
    street: Factory.seq('Address.street', n => `street-${n}`),
    laneNo: Factory.sequence('Address.laneNo'),
    landlineNumber: Factory.assocBuild('PhoneNumber2', {}, {landline: true})
  };
  return attrs;
});

Factory.define('User', User, function (buildOptions) {
  const attrs = {
    name: Factory.seq('User.name', n => `User ${n}`),
    email: Factory.seq('User.email', n => `user${n}@email.com`),
    mobile: Factory.assocBuildMany('PhoneNumber', 2, null, {number: Factory.seq('User.mobile', n => `123456-${n}`)}),
    address: Factory.assocMany('Address', 3, 'id')
  };

  return attrs;
});
