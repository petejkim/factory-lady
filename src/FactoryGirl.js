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
  
class FactoryGirl {
  factories = {};
  options = {};
  adapters = {};

  constructor(options) {
    super();
    this.assoc = attrGenerator(this, Assoc);
    this.assocMany = attrGenerator(this, AssocMany);
    this.assocBuild = attrGenerator(this, Build);
    this.assocBuildMany = attrGenerator(this, BuildMany);
    this.sequence = attrGenerator(this, Sequence);

    this.defaultAdapter = options.defaultAdapter || new DefaultAdapter;
  }
  
  define(name, Model, initializer, options) {
    if(this.getFactory(name)) {
      throw new Error(`factory ${name} already defined`)
    }

    this.factories[name] = new Factory(Model, initializer, options);
  }

  async attrs(name, attrs, buildOptions) {
    return await this.getFactory(name).attrs(attrs, buildOptions);
  }

  async build(name, attrs, buildOptions) {
    const adapter = this.adapters[name] || this.defaultAdapter;
    return await this.getFactory(name).build(adapter, attrs, buildOptions);
  }

  async create(name, attrs, buildOptions) {
    const adapter = this.adapters[name] || this.defaultAdapter;
    return await this.getFactory(name).create(adapter, attrs, buildOptions);
  }

  async buildMany(name, num, attrs, buildOptions) {
    const adapter = this.adapters[name] || this.defaultAdapter;
    return await this.getFactory(name).buildMany(adapter, num, attrs, buildOptions);
  }

  async createMany(name, num, attrs, buildOptions) {
    const adapter = this.adapters[name] || this.defaultAdapter;
    return await this.getFactory(name).createMany(adapter, num, attrs, buildOptions);
  }
  
  getFactory(name) {
    return this.factories[name];
  }

  withOptions(options, merge = false) {
    this.options = merge ? {...this.options, ...options} : options;
  }

  setAdapter(adapter, factory) {
    if(!factory) {
      this.defaultAdapter = adapter;
    } else {
      this.adapters[factory] = adapter;
    }
  }
}

export default FactoryGirl;