/**
 * Created by chetanv on 08/06/16.
 */

import '../test-helper/testUtils';
import ManyModelGenerator from '../../src/generators/ManyModelGenerator';
import { expect } from 'chai';
// import _debug from 'debug';
import DummyFactoryGirl from '../test-helper/DummyFactoryGirl';

// const debug = _debug('ManyModelGeneratorSpec');

describe('ManyModelGenerator', function () {
  const factoryGirl = new DummyFactoryGirl;

  describe('#constructor', function () {
    const manyModelGenerator = new ManyModelGenerator(factoryGirl, 'model', 10);

    it('can be created', function () {
      expect(manyModelGenerator).to.be.instanceof(ManyModelGenerator);
    });

    it('stores the number of instances to be associated', function () {
      expect(manyModelGenerator.num).to.be.equal(10);
    });

    it('throws error if num is not valid', function () {
      /* eslint-disable no-new */
      function noNum() {
        new ManyModelGenerator(factoryGirl, 'model');
      }

      function invalidNum() {
        new ManyModelGenerator(factoryGirl, 'model', 'not-a-num');
      }

      function lessThanOne() {
        new ManyModelGenerator(factoryGirl, 'model', -1);
      }
      /* eslint-enable no-new */

      expect(noNum).to.throw(Error);
      expect(invalidNum).to.throw(Error);
      expect(lessThanOne).to.throw(Error);
    });
  });
});
