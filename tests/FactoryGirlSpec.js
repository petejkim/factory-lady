/**
 * Created by chetanv on 07/06/16.
 */


import './test-helper/testUtils';
import FactoryGirl from '../src/FactoryGirl'
import Factory from '../src/Factory'
import DefaultAdapter from '../src/adapters/DefaultAdapter';
import {expect} from 'chai';
import Debug from 'debug';
import DummyModel from './test-helper/DummyModel';
import DummyAdapter from './test-helper/DummyAdapter';
import asyncFunction from './test-helper/asyncFunction';
import sinon from 'sinon';

const debug = Debug('FactoryGirlSpec');

describe('FactoryGirl', function () {
  describe('#constructor', function () {
    const factoryGirl = new FactoryGirl();
    it('can be created', function () {
      expect(factoryGirl).to.be.an.instanceof(FactoryGirl);
    });

    it('defines generator methods', function () {
      expect(factoryGirl.assoc).to.be.a('function');
      expect(factoryGirl.assocMany).to.be.a('function');
      expect(factoryGirl.assocBuild).to.be.a('function');
      expect(factoryGirl.assocBuildMany).to.be.a('function');
      expect(factoryGirl.sequence).to.be.a('function');
      expect(factoryGirl.seq).to.be.a('function');
    });

    it('defines default adapter', function () {
      expect(factoryGirl.defaultAdapter).to.be.an.instanceof(DefaultAdapter);
    });
  });
  
  describe('#define', function () {
    const factoryGirl = new FactoryGirl();
    it('can define factory', function () {
      factoryGirl.define('factory1', DummyModel, {});
      expect(factoryGirl.factories['factory1']).to.exist;
      expect(factoryGirl.factories['factory1']).to.be.an.instanceof(Factory);
    });

    it('can not define factory with same name', function () {
      function nameRepeated() {
        factoryGirl.define('factory1', DummyModel, {});
      }
      expect(nameRepeated).to.throw(Error);
    });
  });

  describe('#getFactory', function () {
    const factoryGirl = new FactoryGirl();
    factoryGirl.define('factory1', DummyModel, {});

    it('returns requested factory', function () {
      const factory = factoryGirl.getFactory('factory1');
      expect(factory).to.exist;
      expect(factory).to.be.an.instanceof(Factory);
    });

    it('throws error if factory does not exists', function () {
      function factoryNotExists() {
        factoryGirl.getFactory('factory2');
      }

      expect(factoryNotExists).to.throw(Error);
    });
  });

  describe('#setAdapter', function () {
    it('sets the default adapter', function () {
      const factoryGirl = new FactoryGirl();
      expect(factoryGirl.defaultAdapter).to.be.an.instanceof(DefaultAdapter);
      const dummyAdapter = new DummyAdapter;
      factoryGirl.setAdapter(dummyAdapter);
      expect(factoryGirl.defaultAdapter).to.be.an.instanceof(DummyAdapter);
    });

    it('sets adapter for factories correctly', function () {
      const factoryGirl = new FactoryGirl();
      factoryGirl.define('factory1', DummyModel, {});
      factoryGirl.define('factory2', DummyModel, {});
      expect(factoryGirl.adapters['factory1']).to.not.exist;
      expect(factoryGirl.adapters['factory2']).to.not.exist;
      const dummyAdapter = new DummyAdapter;
      factoryGirl.setAdapter(dummyAdapter, 'factory1');
      expect(factoryGirl.adapters['factory1']).to.be.an.instanceof(DummyAdapter);
      expect(factoryGirl.adapters['factory2']).to.not.exist;
      expect(factoryGirl.defaultAdapter).to.be.an.instanceof(DefaultAdapter);
    })
  });

  describe('#getAdapter', function () {
    const factoryGirl = new FactoryGirl();
    factoryGirl.define('factory1', DummyModel, {});
    factoryGirl.define('factory2', DummyModel, {});
    const dummyAdapter = new DummyAdapter;
    factoryGirl.setAdapter(dummyAdapter, 'factory1');

    it('gets adapter correctly', function () {
      const adapter1 = factoryGirl.getAdapter('factory2');
      expect(adapter1).to.be.equal(factoryGirl.defaultAdapter);
      const adapter2 = factoryGirl.getAdapter('factory1');
      expect(adapter2).to.be.equal(dummyAdapter);
    });
  });

  describe('#attrs', function () {
    const factoryGirl = new FactoryGirl();
    factoryGirl.define('factory1', DummyModel, {name: 'Mark', age: 40});

    it('requests correct factory', asyncFunction(async function () {
      const spy = sinon.spy(factoryGirl, 'getFactory');
      const attrs = await factoryGirl.attrs('factory1');
      expect(spy).to.have.been.calledWith('factory1');
      factoryGirl.getFactory.restore();
    }));

    it('calls attrs on the factory with attrs and buildOptions', asyncFunction(async function () {
      const factory = factoryGirl.getFactory('factory1');
      const spy = sinon.spy(factory, 'attrs');
      const dummyAttrs = {};
      const dummyBuildOptions = {};
      const attrs = await factoryGirl.attrs('factory1', dummyAttrs, dummyBuildOptions);
      expect(spy).to.have.been.calledWith(dummyAttrs, dummyBuildOptions);
      factory.attrs.restore();
    }));

    it('returns a promise', function () {
      const attrsP = factoryGirl.attrs('factory1');
      expect(attrsP.then).to.be.a('function');
      return expect(attrsP).to.be.eventually.fulfilled;
    });

    it('resolves to attrs correctly', asyncFunction(async function () {
      const attrs = await factoryGirl.attrs('factory1');
      expect(attrs).to.be.eql({
        name: 'Mark',
        age: 40
      });
    }));
  });
  
  describe('#build', function () {
    const factoryGirl = new FactoryGirl();
    factoryGirl.define('factory1', DummyModel, {name: 'Mark', age: 40});

    it('requests correct factory and adapter', asyncFunction(async function () {
      const spy1 = sinon.spy(factoryGirl, 'getFactory');
      const spy2 = sinon.spy(factoryGirl, 'getAdapter');
      const model = await factoryGirl.build('factory1');
      expect(spy1).to.have.been.calledWith('factory1');
      expect(spy2).to.have.been.calledWith('factory1');
      factoryGirl.getFactory.restore();
      factoryGirl.getAdapter.restore();
    }));

    it('calls build on the factory with adapter, attrs and buildOptions', asyncFunction(async function () {
      const factory = factoryGirl.getFactory('factory1');
      const spy = sinon.spy(factory, 'build');
      const dummyAttrs = {};
      const dummyBuildOptions = {};
      const adapter = factoryGirl.getAdapter('factory1');
      const model = await factoryGirl.build('factory1', dummyAttrs, dummyBuildOptions);
      expect(spy).to.have.been.calledWith(adapter, dummyAttrs, dummyBuildOptions);
      factory.build.restore();
    }));

    it('returns a promise', function () {
      const modelP = factoryGirl.build('factory1');
      expect(modelP.then).to.be.a('function');
      return expect(modelP).to.be.eventually.fulfilled;
    });

    it('resolves to model correctly', asyncFunction(async function () {
      const model = await factoryGirl.build('factory1');
      expect(model).to.be.an.instanceof(DummyModel);
      expect(model.name).to.be.equal('Mark');
      expect(model.age).to.be.equal(40);
    }));
  });

  describe('#create', function () {
    const factoryGirl = new FactoryGirl();
    factoryGirl.define('factory1', DummyModel, {name: 'Mark', age: 40});

    it('requests correct factory and adapter', asyncFunction(async function () {
      const spy1 = sinon.spy(factoryGirl, 'getFactory');
      const spy2 = sinon.spy(factoryGirl, 'getAdapter');
      const model = await factoryGirl.create('factory1');
      expect(spy1).to.have.been.calledWith('factory1');
      expect(spy2).to.have.been.calledWith('factory1');
      factoryGirl.getFactory.restore();
      factoryGirl.getAdapter.restore();
    }));

    it('calls create on the factory with adapter, attrs and buildOptions', asyncFunction(async function () {
      const factory = factoryGirl.getFactory('factory1');
      const spy = sinon.spy(factory, 'create');
      const dummyAttrs = {};
      const dummyBuildOptions = {};
      const adapter = factoryGirl.getAdapter('factory1');
      const model = await factoryGirl.create('factory1', dummyAttrs, dummyBuildOptions);
      expect(spy).to.have.been.calledWith(adapter, dummyAttrs, dummyBuildOptions);
      factory.create.restore();
    }));

    it('returns a promise', function () {
      const modelP = factoryGirl.create('factory1');
      expect(modelP.then).to.be.a('function');
      return expect(modelP).to.be.eventually.fulfilled;
    });

    it('resolves to model correctly', asyncFunction(async function () {
      const model = await factoryGirl.create('factory1');
      expect(model).to.be.an.instanceof(DummyModel);
      expect(model.name).to.be.equal('Mark');
      expect(model.age).to.be.equal(40);
    }));
  });

  describe('#attrsMany', function () {
    const factoryGirl = new FactoryGirl();
    factoryGirl.define('factory1', DummyModel, {name: 'Mark', age: 40});

    it('requests correct factory', asyncFunction(async function () {
      const spy = sinon.spy(factoryGirl, 'getFactory');
      const attrs = await factoryGirl.attrsMany('factory1', 10);
      expect(spy).to.have.been.calledWith('factory1');
      factoryGirl.getFactory.restore();
    }));

    it('calls attrsMany on the factory with num, attrs and buildOptions', asyncFunction(async function () {
      const factory = factoryGirl.getFactory('factory1');
      const spy = sinon.spy(factory, 'attrsMany');
      const dummyAttrs = {};
      const dummyBuildOptions = {};
      const attrs = await factoryGirl.attrsMany('factory1', 10, dummyAttrs, dummyBuildOptions);
      expect(spy).to.have.been.calledWith(10, dummyAttrs, dummyBuildOptions);
      factory.attrsMany.restore();
    }));

    it('returns a promise', function () {
      const attrsP = factoryGirl.attrsMany('factory1', 1);
      expect(attrsP.then).to.be.a('function');
      return expect(attrsP).to.be.eventually.fulfilled;
    });

    it('resolves to attrs array correctly', asyncFunction(async function () {
      const attrs = await factoryGirl.attrsMany('factory1', 10);
      expect(attrs).to.be.an('array');
      expect(attrs).to.have.lengthOf(10);
      attrs.forEach(function (attr) {
        expect(attr).to.be.eql({
          name: 'Mark',
          age: 40
        });
      });
    }));
  });


  describe('#buildMany', function () {
    const factoryGirl = new FactoryGirl();
    factoryGirl.define('factory1', DummyModel, {name: 'Mark', age: 40});

    it('requests correct factory and adapter', asyncFunction(async function () {
      const spy1 = sinon.spy(factoryGirl, 'getFactory');
      const spy2 = sinon.spy(factoryGirl, 'getAdapter');
      const model = await factoryGirl.buildMany('factory1', 2);
      expect(spy1).to.have.been.calledWith('factory1');
      expect(spy2).to.have.been.calledWith('factory1');
      factoryGirl.getFactory.restore();
      factoryGirl.getAdapter.restore();
    }));

    it('calls buildMany on the factory with adapter, num, attrs and buildOptions', asyncFunction(async function () {
      const factory = factoryGirl.getFactory('factory1');
      const spy = sinon.spy(factory, 'buildMany');
      const dummyAttrs = {};
      const dummyBuildOptions = {};
      const adapter = factoryGirl.getAdapter('factory1');
      const model = await factoryGirl.buildMany('factory1', 5, dummyAttrs, dummyBuildOptions);
      expect(spy).to.have.been.calledWith(adapter, 5, dummyAttrs, dummyBuildOptions);
      factory.buildMany.restore();
    }));

    it('returns a promise', function () {
      const modelP = factoryGirl.buildMany('factory1', 2);
      expect(modelP.then).to.be.a('function');
      return expect(modelP).to.be.eventually.fulfilled;
    });

    it('resolves to models array correctly', asyncFunction(async function () {
      const models = await factoryGirl.buildMany('factory1', 5);
      expect(models).to.be.an('array');
      models.forEach(function (model) {
        expect(model).to.be.an.instanceof(DummyModel);
        expect(model.name).to.be.equal('Mark');
        expect(model.age).to.be.equal(40);
      });
    }));
  });

  describe('#createMany', function () {
    const factoryGirl = new FactoryGirl();
    factoryGirl.define('factory1', DummyModel, {name: 'Mark', age: 40});

    it('requests correct factory and adapter', asyncFunction(async function () {
      const spy1 = sinon.spy(factoryGirl, 'getFactory');
      const spy2 = sinon.spy(factoryGirl, 'getAdapter');
      const model = await factoryGirl.createMany('factory1', 2);
      expect(spy1).to.have.been.calledWith('factory1');
      expect(spy2).to.have.been.calledWith('factory1');
      factoryGirl.getFactory.restore();
      factoryGirl.getAdapter.restore();
    }));

    it('calls createMany on the factory with adapter, num, attrs and buildOptions', asyncFunction(async function () {
      const factory = factoryGirl.getFactory('factory1');
      const spy = sinon.spy(factory, 'createMany');
      const dummyAttrs = {};
      const dummyBuildOptions = {};
      const adapter = factoryGirl.getAdapter('factory1');
      const model = await factoryGirl.createMany('factory1', 5, dummyAttrs, dummyBuildOptions);
      expect(spy).to.have.been.calledWith(adapter, 5, dummyAttrs, dummyBuildOptions);
      factory.createMany.restore();
    }));

    it('returns a promise', function () {
      const modelP = factoryGirl.createMany('factory1', 2);
      expect(modelP.then).to.be.a('function');
      return expect(modelP).to.be.eventually.fulfilled;
    });

    it('resolves to models array correctly', asyncFunction(async function () {
      const models = await factoryGirl.createMany('factory1', 5);
      expect(models).to.be.an('array');
      models.forEach(function (model) {
        expect(model).to.be.an.instanceof(DummyModel);
        expect(model.name).to.be.equal('Mark');
        expect(model.age).to.be.equal(40);
      });
    }));
  });

  describe('#withOptions', function () {

    it('can replace options', function () {
      const factoryGirl = new FactoryGirl({a: 1});
      const newOptions = {hello: 'world'};
      factoryGirl.withOptions(newOptions);
      expect(factoryGirl.options).to.be.eql(newOptions);
    });

    it('can merge options', function () {
      const originalOptions = {a: 1};
      const factoryGirl = new FactoryGirl(originalOptions);
      const newOptions = {hello: 'world'};
      factoryGirl.withOptions(newOptions, true);
      expect(factoryGirl.options).to.be.eql({...originalOptions, ...newOptions});
    });
  });
});