/**
 * Created by chetanv on 01/06/16.
 */

import asyncPopulate from './utils/asyncPopulate';

class Factory {
  name = null;
  Model = null;
  initializer = null;
  options = null;

  constructor(Model, initializer, options = {}) {
    if(!Model || typeof Model !== 'function') {
      throw new Error('Invalid Model passed to the factory');
    }

    if(!initializer || (typeof initializer !== 'object' && typeof initializer !== 'function')) {
      throw new Error('Invalid initializer passed to the factory');
    }

    this.Model = Model;
    this.initializer = initializer;
    this.options = options;
  }

  async getFactoryAttrs(buildOptions = {}) {
    let attrs = {};
    if(typeof this.initializer === 'function') {
      attrs = await Promise.resolve(this.initializer(buildOptions));
    } else {
      attrs = {...this.initializer};
    }

    return attrs;
  }

  async attrs(attrs = {}, buildOptions = {}) {
    const factoryAttrs = await this.getFactoryAttrs(buildOptions);
    const modelAttrs = {};

    await asyncPopulate(modelAttrs, factoryAttrs);
    await asyncPopulate(modelAttrs, attrs);

    return modelAttrs;
  }

  async build(adapter, attrs = {}, buildOptions = {}) {
    const modelAttrs = await this.attrs(attrs, buildOptions);
    return adapter.build(this.Model, modelAttrs);
  }

  async create(adapter, attrs = {}, buildOptions = {}) {
    const model = await this.build(adapter, attrs, buildOptions);
    return adapter.save(this.Model, model);
  }

  async attrsMany(num, attrsArray = [], buildOptionsArray = []) {
    const models = [];
    let attrObject = null;
    let buildOptionsObject = null;

    if(!Array.isArray(attrsArray) && typeof attrsArray === 'object') {
      attrObject = attrsArray;
      attrsArray = [];
    }

    if(typeof buildOptionsArray === 'object') {
      buildOptionsObject = buildOptionsArray;
      buildOptionsArray = [];
    }

    if(typeof num !== 'number' || num < 1) {
      throw new Error('Invalid number of objects requested');
    }

    attrsArray.length = buildOptionsArray.length = num;
    for(let i = 0; i < num; i++) {
      models[i] = await this.attrs(
        attrObject || attrsArray[i] || {},
        buildOptionsObject || buildOptionsArray[i] || {}
      );
    }

    return models;
  }

  async buildMany(adapter, num, attrsArray = [], buildOptionsArray = []) {
    const attrs = await this.attrsMany(num, attrsArray, buildOptionsArray);
    const models = attrs.map((attr) => adapter.build(this.Model, attr));
    return Promise.all(models);
  }

  async createMany(adapter, num, attrsArray = [], buildOptionsArray = []) {
    const models = await this.buildMany(adapter, num, attrsArray, buildOptionsArray);
    const savedModels = models.map((model) => adapter.save(this.Model, model));
    return Promise.all(savedModels);
  }
}

export default Factory;