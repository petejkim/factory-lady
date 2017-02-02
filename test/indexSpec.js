import './test-helper/testUtils';
import { expect } from 'chai';
import Factory, {
  BookshelfAdapter,
  SequelizeAdapter,
  DefaultAdapter,
  MongooseAdapter,
  ObjectAdapter,
} from '../src';

import FactoryGirl from '../src/FactoryGirl';
import BA from '../src/adapters/BookshelfAdapter';
import SA from '../src/adapters/SequelizeAdapter';
import DA from '../src/adapters/DefaultAdapter';
import MA from '../src/adapters/MongooseAdapter';
import OA from '../src/adapters/ObjectAdapter';

describe('index', function () {
  it('exports correctly', function () {
    expect(Factory).to.be.instanceof(FactoryGirl);

    expect(BA).to.be.equal(BookshelfAdapter);
    expect(SA).to.be.equal(SequelizeAdapter);
    expect(DA).to.be.equal(DefaultAdapter);
    expect(MA).to.be.equal(MongooseAdapter);
    expect(OA).to.be.equal(ObjectAdapter);
  });
});
