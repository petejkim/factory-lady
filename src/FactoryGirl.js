/**
 * Created by chetanv on 01/06/16.
 */

import Factory from './Factory';
import Sequence from './generators/Sequence';
import Assoc from './generators/Assoc';
import Build from './generators/Build';
import AssocMany from './generators/AssocMany';
import BuildMany from './generators/BuildMany';
import attrGenerator from './generators/attrGenerator';
import DefaultAdapter from './adapters/DefaultAdapter';
import Debug from 'debug';

const debug = Debug('FactoryGirl');

class FactoryGirl {
  factories = {};
  options = {};
  adapters = {};
  created = new Set();

  constructor(options) {
    this.assoc = attrGenerator(this, Assoc);
    this.assocMany = attrGenerator(this, AssocMany);
    this.assocBuild = attrGenerator(this, Build);
    this.assocBuildMany = attrGenerator(this, BuildMany);
    this.seq = this.sequence = attrGenerator(this, Sequence);

    this.defaultAdapter = new DefaultAdapter;
    this.options = options;
  }

  define(name, Model, initializer, options) {
    if (this.getFactory(name, false)) {
      throw new Error(`factory ${name} already defined`)
    }

    this.factories[name] = new Factory(Model, initializer, options);
  }

  attrs(name, attrs, buildOptions) {
    return this.getFactory(name).attrs(attrs, buildOptions);
  }

  build(name, attrs, buildOptions) {
    const adapter = this.getAdapter(name);
    return this.getFactory(name).build(adapter, attrs, buildOptions);
  }

  create(name, attrs, buildOptions) {
    const adapter = this.getAdapter(name);
    return this.getFactory(name).create(adapter, attrs, buildOptions).then((createdModel) => {
      this.addToCreatedList(adapter, createdModel);
      return createdModel;
    });
  }

  attrsMany(name, num, attrs, buildOptions) {
    return this.getFactory(name).attrsMany(num, attrs, buildOptions);
  }

  buildMany(name, num, attrs, buildOptions) {
    const adapter = this.getAdapter(name);
    return this.getFactory(name).buildMany(adapter, num, attrs, buildOptions);
  }

  createMany(name, num, attrs, buildOptions) {
    const adapter = this.getAdapter(name);
    return this.getFactory(name).createMany(adapter, num, attrs, buildOptions).then((createdModels) => {
      this.addToCreatedList(adapter, createdModels);
      return createdModels;
    });
  }

  getFactory(name, throwError = true) {
    if(!this.factories[name]) {
      if(throwError) {
        throw new Error('Invalid factory requested');
      }
    }
    return this.factories[name];
  }

  withOptions(options, merge = false) {
    this.options = merge ? {...this.options, ...options} : options;
  }

  getAdapter(factory) {
    return factory ? (this.adapters[factory] || this.defaultAdapter) : this.defaultAdapter;
  }

  addToCreatedList(adapter, models) {
    if(!Array.isArray(models)) {
      models = [models];
    }

    for(let model of models) {
      this.created.add([adapter, model]);
    }
  }

  cleanUp() {
    for(let [adapter, model] of this.created) {
      adapter.destroy(model.constructor, model);
    }
    this.created.clear();
  }

  setAdapter(adapter, factory) {
    if (!factory) {
      this.defaultAdapter = adapter;
    } else {
      this.adapters[factory] = adapter;
    }
  }
}

export default FactoryGirl;