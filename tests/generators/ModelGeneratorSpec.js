/**
 * Created by chetanv on 06/06/16.
 */

import '../test-helper/testUtils';
import ModelGenerator from '../../src/generators/ModelGenerator';
import DummyFactoryGirl from '../test-helper/DummyFactoryGirl';
import { expect } from 'chai';
// import _debug from 'debug';

// const debug = _debug('ModelGeneratorSpec');

describe('ModelGenerator', function () {
  describe('#constructor', function () {
    const factoryGirl = new DummyFactoryGirl;

    it('can be created', function () {
      const dummyAttrs = {};
      const dummyBuildOptions = {};
      const modelGenerator = new ModelGenerator(
        factoryGirl, 'someModel', 'someKey', dummyAttrs, dummyBuildOptions
      );
      expect(modelGenerator).to.be.an.instanceof(ModelGenerator);
      expect(modelGenerator.factoryGirl).to.be.equal(factoryGirl);
      expect(modelGenerator.name).to.be.equal('someModel');
      expect(modelGenerator.key).to.be.equal('someKey');
      expect(modelGenerator.attrs).to.be.equal(dummyAttrs);
      expect(modelGenerator.buildOptions).to.be.equal(dummyBuildOptions);
    });

    it('defaults key, attrs and buildOptions correctly', function () {
      const modelGenerator = new ModelGenerator(factoryGirl, 'someModel');
      expect(modelGenerator).to.be.an.instanceof(ModelGenerator);
      expect(modelGenerator.factoryGirl).to.be.equal(factoryGirl);
      expect(modelGenerator.name).to.be.equal('someModel');
      expect(modelGenerator.key).to.be.equal(null);
      expect(modelGenerator.attrs).to.be.eql({});
      expect(modelGenerator.buildOptions).to.be.eql({});
    });

    it('validates model name', function () {
      /* eslint-disable no-new */
      function undefinedModelName() {
        new ModelGenerator(factoryGirl);
      }

      function emptyModelName() {
        new ModelGenerator(factoryGirl, '');
      }

      function nonStringModelName() {
        new ModelGenerator(factoryGirl, 3);
      }
      /* eslint-enable no-new */

      expect(undefinedModelName).to.throw(Error);
      expect(emptyModelName).to.throw(Error);
      expect(nonStringModelName).to.throw(Error);
    });
  });
});
