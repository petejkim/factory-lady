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
  
class FactoryGirl {
  factories = {};
  options = {};

  constructor() {
    super();
    this.assoc = attrGenerator(Assoc);
    this.assocMany = attrGenerator(AssocMany);
    this.assocBuild = attrGenerator(Build);
    this.assocBuildMany = attrGenerator(BuildMany);
    this.sequence = attrGenerator(Sequence);
  }
  
  define(name, Model, initializer, options) {
    if(this.getFactory(name)) {
      throw new Error(`factory ${name} already defined`)
    }
    
    this.factories[name] = new Factory(Model, initializer, options);
  }

  build(name, attrs, buildOptions) {
    return this.getFactory(name).build(attrs, buildOptions);
  }

  buildSync(name, attrs, buildOptions) {
    return this.getFactory(name).buildSync(attrs, buildOptions);
  }

  create(name, attrs, buildOptions) {
    return this.getFactory(name).create(attrs, buildOptions);
  }

  buildMany(name, num, attrs, buildOptions) {
    return this.getFactory(name).buildMany(num, attrs, buildOptions);
  }

  createMany(name, num, attrs, buildOptions) {
    return this.getFactory(name).createMany(num, attrs, buildOptions);
  }
  
  getFactory(name) {
    return this.factories[name];
  }

  withOptions(options, merge = false) {
    this.options = merge ? {...this.options, ...options} : options;
  }
}