

import './test-helper/testUtils';
import Factory from '../src/Factory';
import { expect } from 'chai';
import DummyModel from './test-helper/DummyModel';
import DummyAdapter from './test-helper/DummyAdapter';
import asyncFunction from './test-helper/asyncFunction';
import sinon from 'sinon';

describe('Factory', function () {
  describe('#constructor', function () {
    it('can be created', function () {
      const initializer = {};
      const options = {};
      const factory = new Factory(DummyModel, initializer, options);
      expect(factory).to.be.instanceof(Factory);
      expect(factory.Model).to.be.equal(DummyModel);
      expect(factory.initializer).to.be.equal(initializer);
    });

    it('can be created without options', function () {
      const factory = new Factory(DummyModel, {});
      expect(factory).to.be.instanceof(Factory);
    });

    it('validates Model', function () {
      /* eslint-disable no-new */
      function noModel() {
        new Factory();
      }

      function invalidModel() {
        new Factory(2);
      }

      function validModel() {
        new Factory(DummyModel, {});
      }

      /* eslint-enable no-new */

      expect(noModel).to.throw(Error);
      expect(invalidModel).to.throw(Error);
      expect(validModel).to.not.throw(Error);
    });

    it('validates initializer', function () {
      /* eslint-disable no-new */
      function noInitializer() {
        new Factory(DummyModel);
      }

      function invalidInitializer() {
        new Factory(DummyModel, 3);
      }

      function objectInitializer() {
        new Factory(DummyModel, {});
      }

      function functionInitializer() {
        new Factory(DummyModel, function () {
        });
      }

      /* eslint-enable no-new */

      expect(noInitializer).to.throw(Error);
      expect(invalidInitializer).to.throw(Error);
      expect(objectInitializer).to.not.throw(Error);
      expect(functionInitializer).to.not.throw(Error);
    });
  });

  const simpleObjInit = {
    name: 'Bruce',
    age: 42,
    address: {
      address1: 'Some Address 1',
      address2: 'Some Address 2',
    },
  };

  const simpleFuncInit = function () {
    return { ...simpleObjInit };
  };

  const objFactory = new Factory(DummyModel, simpleObjInit);
  const dummyAdapter = new DummyAdapter;

  describe('#getFactoryAttrs', function () {
    it('returns a promise', function () {
      const factory = new Factory(DummyModel, {});
      const factoryAttrsP = factory.getFactoryAttrs();
      expect(factoryAttrsP.then).to.be.a('function');
      return expect(factoryAttrsP).to.be.eventually.fulfilled;
    });

    it('resolves to a copy of factoryAttrs', asyncFunction(async function () {
      const factory = new Factory(DummyModel, simpleObjInit);
      const attrs = await factory.getFactoryAttrs();
      expect(attrs).to.be.eql(simpleObjInit);
      expect(attrs).to.be.not.equal(simpleObjInit);
    }));

    it('resolves to return value of initializer function',
      asyncFunction(async function () {
        const factory = new Factory(DummyModel, simpleFuncInit);
        const attrs = await factory.getFactoryAttrs();
        expect(attrs).to.be.eql(simpleObjInit);
        expect(attrs).to.be.not.equal(simpleObjInit);
      })
    );

    it('calls initializer function with buildOptions',
      asyncFunction(async function () {
        const spy = sinon.spy(simpleFuncInit);
        const dummyBuildOptions = {};
        const factory = new Factory(DummyModel, spy);
        await factory.getFactoryAttrs(dummyBuildOptions);
        expect(spy).to.have.been.calledOnce;
        expect(spy).to.have.been.calledWith(dummyBuildOptions);
      })
    );
  });

  describe('#attrs', function () {
    it('returns a promise', function () {
      const attrsP = objFactory.attrs();
      expect(attrsP.then).to.be.a('function');
      return expect(attrsP).to.be.eventually.fulfilled;
    });

    it('calls #getFactoryAttrs with buildOptions',
      asyncFunction(async function () {
        const spy = sinon.spy(objFactory, 'getFactoryAttrs');
        const dummyBuildOptions = {};
        await objFactory.attrs({}, dummyBuildOptions);
        expect(spy).to.have.been.calledWith(dummyBuildOptions);
        objFactory.getFactoryAttrs.restore();
      })
    );

    it('populates with factoryAttrs', asyncFunction(async function () {
      const attrs = await objFactory.attrs();
      expect(attrs).to.be.eql(simpleObjInit);
    }));

    it('overrides with passed attrs', asyncFunction(async function () {
      const overrides = {
        age: 24,
        address: {
          address1: 'Some Address Override',
        },
      };
      const attrs = await objFactory.attrs(overrides);
      expect(attrs).to.be.eql({
        name: 'Bruce',
        age: 24,
        address: {
          address1: 'Some Address Override',
        },
      });
    }));
  });

  describe('#build', function () {
    it('returns a promise', function () {
      const modelP = objFactory.build(dummyAdapter);
      expect(modelP.then).to.be.a('function');
      return expect(modelP).to.be.eventually.fulfilled;
    });

    it('calls attrs to get attributes', asyncFunction(async function () {
      const spy = sinon.spy(objFactory, 'attrs');
      const dummyAttrs = {};
      const dummyBuildOptions = {};
      await objFactory.build(dummyAdapter, dummyAttrs, dummyBuildOptions);
      expect(spy).to.have.been.calledWith(dummyAttrs, dummyBuildOptions);
      objFactory.attrs.restore();
    }));

    it('calls build on adapter with Model and attrs',
      asyncFunction(async function () {
        const spy = sinon.spy(dummyAdapter, 'build');
        await objFactory.build(dummyAdapter);
        expect(spy).to.have.been.calledWith(
          DummyModel, sinon.match(simpleObjInit)
        );
        dummyAdapter.build.restore();
      })
    );

    it('resolves to a Model instance', asyncFunction(async function () {
      const model = await objFactory.build(dummyAdapter);
      expect(model).to.be.an.instanceof(DummyModel);
    }));

    it('invokes afterBuild callback option if any',
      asyncFunction(async function () {
        const spy = sinon.spy(model => model);
        const factoryWithOptions
          = new Factory(DummyModel, simpleObjInit, { afterBuild: spy });
        const dummyAttrs = {};
        const dummyBuildOptions = {};
        const model = await factoryWithOptions.build(
          dummyAdapter, dummyAttrs, dummyBuildOptions
        );
        expect(spy).to.have.been.calledWith(
          model, dummyAttrs, dummyBuildOptions
        );
      })
    );

    it('accepts afterBuild callback returning a promise',
      asyncFunction(async function () {
        const factoryWithOptions = new Factory(
          DummyModel,
          simpleObjInit,
          { afterBuild: model => Promise.resolve(model) }
        );

        const model = await factoryWithOptions.build(dummyAdapter);
        expect(model).to.be.an.instanceof(DummyModel);
      })
    );
  });

  describe('#create', function () {
    it('returns a promise', function () {
      const modelP = objFactory.create(dummyAdapter);
      expect(modelP.then).to.be.a('function');
      return expect(modelP).to.be.eventually.fulfilled;
    });

    it('calls build to build the model', asyncFunction(async function () {
      const spy = sinon.spy(objFactory, 'build');
      const dummyAttrs = {};
      const dummyBuildOptions = {};
      await objFactory.create(dummyAdapter, dummyAttrs, dummyBuildOptions);
      expect(spy).to.have.been.calledWith(dummyAttrs, dummyBuildOptions);
      objFactory.build.restore();
    }));

    it('calls save on adapter with Model and model',
      asyncFunction(async function () {
        const spy = sinon.spy(dummyAdapter, 'save');
        await objFactory.create(dummyAdapter);
        expect(spy).to.have.been.calledWith(
          sinon.match(new DummyModel(simpleObjInit)), DummyModel
        );
        dummyAdapter.save.restore();
      })
    );

    it('resolves to a Model instance', asyncFunction(async function () {
      const model = await objFactory.create(dummyAdapter);
      expect(model).to.be.an.instanceof(DummyModel);
    }));

    it('invokes afterCreate callback option if any',
      asyncFunction(async function () {
        const spy = sinon.spy(model => model);
        const factoryWithOptions
          = new Factory(DummyModel, simpleObjInit, { afterCreate: spy });
        const dummyAttrs = {};
        const dummyBuildOptions = {};
        const model = await factoryWithOptions.create(
          dummyAdapter, dummyAttrs, dummyBuildOptions
        );
        expect(spy).to.have.been.calledWith(
          model, dummyAttrs, dummyBuildOptions
        );
      })
    );

    it('accepts afterCreate callback returning a promise',
      asyncFunction(async function () {
        const factoryWithOptions = new Factory(
          DummyModel,
          simpleObjInit,
          { afterCreate: model => Promise.resolve(model) }
        );

        const model = await factoryWithOptions.create(dummyAdapter);
        expect(model).to.be.an.instanceof(DummyModel);
      })
    );

    it('invokes afterBuild callback on create',
      asyncFunction(async function () {
        const spy = sinon.spy(model => model);
        const factoryWithOptions
          = new Factory(DummyModel, simpleObjInit, { afterBuild: spy });
        await factoryWithOptions.create(dummyAdapter);
        expect(spy).to.have.callCount(1);
      })
    );
  });

  describe('#buildMany', function () {
    it('returns a promise', function () {
      const modelsP = objFactory.buildMany(dummyAdapter, 5);
      expect(modelsP.then).to.be.a('function');
      return expect(modelsP).to.be.eventually.fulfilled;
    });

    it('calls attrsMany to get model attrs', asyncFunction(async function () {
      const spy = sinon.spy(objFactory, 'attrsMany');
      const dummyAttrs = {};
      const dummyBuildOptions = {};
      await objFactory.buildMany(
        dummyAdapter, 5, dummyAttrs, dummyBuildOptions
      );
      expect(spy).to.have.been.calledWith(5, dummyAttrs, dummyBuildOptions);
      objFactory.attrsMany.restore();
    }));

    it('calls build on adapter with Model and each model attrs',
      asyncFunction(async function () {
        const spy = sinon.spy(dummyAdapter, 'build');
        await objFactory.buildMany(dummyAdapter, 5);
        expect(spy).to.have.callCount(5);
        expect(spy).to.have.been.calledWith(
          DummyModel, sinon.match(simpleObjInit)
        );
        dummyAdapter.build.restore();
      })
    );

    it('resolves to an array of Model instances',
      asyncFunction(async function () {
        const models = await objFactory.buildMany(dummyAdapter, 5);
        expect(models).to.be.an('array');
        expect(models).to.have.lengthOf(5);
        models.forEach(function (model) {
          expect(model).to.be.an.instanceof(DummyModel);
        });
      })
    );

    it('invokes afterBuild callback option if any for each model',
      asyncFunction(async function () {
        const spy = sinon.spy(model => model);
        const factoryWithOptions
          = new Factory(DummyModel, simpleObjInit, { afterBuild: spy });
        const dummyAttrs = {};
        const dummyBuildOptions = {};
        const models = await factoryWithOptions.buildMany(
          dummyAdapter, 5, dummyAttrs, dummyBuildOptions
        );
        expect(spy).to.have.callCount(5);
        for (let i = 0; i < 5; i++) {
          expect(spy.getCall(i)).to.have.been.calledWith(
            models[i], dummyAttrs, dummyBuildOptions
          );
        }
      })
    );

    it('accepts afterBuild callback returning a promise',
      asyncFunction(async function () {
        const factoryWithOptions = new Factory(
          DummyModel,
          simpleObjInit,
          { afterBuild: model => Promise.resolve(model) }
        );

        const models = await factoryWithOptions.buildMany(dummyAdapter, 5);
        expect(models).to.be.an('array');
        models.forEach(function (model) {
          expect(model).to.be.an.instanceof(DummyModel);
        });
      })
    );
  });

  describe('#createMany', function () {
    it('returns a promise', function () {
      const modelsP = objFactory.createMany(dummyAdapter, 5);
      expect(modelsP.then).to.be.a('function');
      return expect(modelsP).to.be.eventually.fulfilled;
    });

    it('calls buildMany to build models', asyncFunction(async function () {
      const spy = sinon.spy(objFactory, 'buildMany');
      const dummyAttrs = {};
      const dummyBuildOptions = {};
      await objFactory.createMany(
        dummyAdapter, 5, dummyAttrs, dummyBuildOptions
      );
      expect(spy).to.have.been.calledWith(
        dummyAdapter, 5, dummyAttrs, dummyBuildOptions
      );
      objFactory.buildMany.restore();
    }));

    it('calls save on adapter with Model and each model',
      asyncFunction(async function () {
        const spy = sinon.spy(dummyAdapter, 'save');
        await objFactory.createMany(dummyAdapter, 5);
        expect(spy).to.have.callCount(5);
        expect(spy).to.have.been.calledWith(
          sinon.match(new DummyModel(simpleObjInit)), DummyModel
        );
        dummyAdapter.save.restore();
      })
    );

    it('resolves to an array of Model instances',
      asyncFunction(async function () {
        const models = await objFactory.createMany(dummyAdapter, 5);
        expect(models).to.be.an('array');
        expect(models).to.have.lengthOf(5);
        models.forEach(function (model) {
          expect(model).to.be.an.instanceof(DummyModel);
        });
      })
    );

    it('invokes afterCreate callback option if any for each model',
      asyncFunction(async function () {
        const spy = sinon.spy(model => model);
        const factoryWithOptions
          = new Factory(DummyModel, simpleObjInit, { afterCreate: spy });
        const dummyAttrs = {};
        const dummyBuildOptions = {};
        const models = await factoryWithOptions.createMany(
          dummyAdapter, 5, dummyAttrs, dummyBuildOptions
        );
        expect(spy).to.have.callCount(5);
        for (let i = 0; i < 5; i++) {
          expect(spy.getCall(i)).to.have.been.calledWith(
            models[i], dummyAttrs, dummyBuildOptions
          );
        }
      })
    );

    it('accepts afterCreate callback returning a promise',
      asyncFunction(async function () {
        const factoryWithOptions = new Factory(
          DummyModel,
          simpleObjInit,
          { afterCreate: model => Promise.resolve(model) }
        );

        const models = await factoryWithOptions.createMany(dummyAdapter, 5);
        expect(models).to.be.an('array');
        models.forEach(function (model) {
          expect(model).to.be.an.instanceof(DummyModel);
        });
      })
    );

    it('invokes afterBuild callback on createMany',
      asyncFunction(async function () {
        const spy = sinon.spy(model => model);
        const factoryWithOptions
          = new Factory(DummyModel, simpleObjInit, { afterBuild: spy });
        await factoryWithOptions.createMany(dummyAdapter, 2);
        expect(spy).to.have.callCount(2);
      })
    );
  });

  describe('#attrsMany', function () {
    it('validates number of objects', function () {
      const noNumP = objFactory.attrsMany();
      const invalidNumP = objFactory.attrsMany('alpha');
      const lessThanOneNumP = objFactory.attrsMany(0);
      const validNumP = objFactory.attrsMany(10);

      return Promise.all([
        expect(noNumP).to.be.eventually.rejected,
        expect(invalidNumP).to.be.eventually.rejected,
        expect(lessThanOneNumP).to.be.eventually.rejected,
        expect(validNumP).to.be.eventually.fulfilled,
      ]);
    });

    it('validates attrsArray', function () {
      const noAttrsArrayP = objFactory.attrsMany(10);
      const arrayAttrsArrayP = objFactory.attrsMany(10, [{ a: 1 }]);
      const objectAttrsArrayP = objFactory.attrsMany(10, { b: 2 });
      const invalidAttrsArrayP = objFactory.attrsMany(10, 'woops');

      return Promise.all([
        expect(noAttrsArrayP).to.be.eventually.fulfilled,
        expect(arrayAttrsArrayP).to.be.eventually.fulfilled,
        expect(objectAttrsArrayP).to.be.eventually.fulfilled,
        expect(invalidAttrsArrayP).to.be.eventually.rejected,
      ]);
    });

    it('validates buildOptionsArray', function () {
      const noBuildOptionsArrayP = objFactory.attrsMany(10, []);
      const arrayBuildOptionsArrayP = objFactory.attrsMany(10, [], [{ a: 1 }]);
      const objectBuildOptionsArrayP = objFactory.attrsMany(10, [], { b: 2 });
      const invalidBuildOptionsArrayP = objFactory.attrsMany(10, [], 'woops');

      return Promise.all([
        expect(noBuildOptionsArrayP).to.be.eventually.fulfilled,
        expect(arrayBuildOptionsArrayP).to.be.eventually.fulfilled,
        expect(objectBuildOptionsArrayP).to.be.eventually.fulfilled,
        expect(invalidBuildOptionsArrayP).to.be.eventually.rejected,
      ]);
    });

    it('calls attrs for each model attr', asyncFunction(async function () {
      const spy = sinon.spy(objFactory, 'attrs');
      await objFactory.attrsMany(10);
      expect(spy).to.have.callCount(10);
      objFactory.attrs.restore();
    }));

    it('passes same attrObject and buildOptionsObject for each model attr',
      asyncFunction(async function () {
        const spy = sinon.spy(objFactory, 'attrs');

        const dummyAttrObject = {};
        const dummyBuildOptionsObject = {};

        await objFactory.attrsMany(
          10, dummyAttrObject, dummyBuildOptionsObject
        );

        expect(spy).to.have.callCount(10);

        spy.args.forEach(function (argsArray) {
          expect(argsArray[0]).to.be.equal(dummyAttrObject);
          expect(argsArray[1]).to.be.equal(dummyBuildOptionsObject);
        });

        objFactory.attrs.restore();
      })
    );

    it('passes attrObject and buildOptions object from arrays to attrs',
      asyncFunction(async function () {
        const spy = sinon.spy(objFactory, 'attrs');

        const dummyAttrArray = [];
        const dummyBuildOptionsArray = [];

        for (let i = 0; i < 10; i++) {
          dummyAttrArray[i] = { a: i };
          dummyBuildOptionsArray[i] = { b: i };
        }

        await objFactory.attrsMany(10, dummyAttrArray, dummyBuildOptionsArray);

        expect(spy).to.have.callCount(10);
        spy.args.forEach(function (argsArray, i) {
          expect(argsArray[0]).to.be.eql({ a: i });
          expect(argsArray[1]).to.be.eql({ b: i });
        });
        objFactory.attrs.restore();
      })
    );

    it('returns a promise', function () {
      const modelsP = objFactory.attrsMany(10);
      expect(modelsP.then).to.be.a('function');
      return expect(modelsP).to.be.eventually.fulfilled;
    });
  });
});
