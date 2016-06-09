/**
 * Created by chetanv on 01/06/16.
 */

import asyncPopulate from './utils/asyncPopulate';
import _debug from 'debug';

const debug = _debug('Factory');

class Factory {
  name = null;
  Model = null;
  initializer = null;
  options = null;

  constructor(Model, initializer, options = {}) {
    if (!Model || typeof Model !== 'function') {
      throw new Error('Invalid Model passed to the factory');
    }

    if (
      !initializer ||
      (typeof initializer !== 'object' && typeof initializer !== 'function')
    ) {
      throw new Error('Invalid initializer passed to the factory');
    }

    this.Model = Model;
    this.initializer = initializer;
    this.options = options;

    debug(`Factory created for model: ${Model.name}`);
  }

  getFactoryAttrs(buildOptions = {}) {
    let attrs = {};
    if (typeof this.initializer === 'function') {
      attrs = this.initializer(buildOptions);
    } else {
      attrs = { ...this.initializer };
    }

    return Promise.resolve(attrs);
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

  attrsMany(num, _attrsArray = [], _buildOptionsArray = []) {
    const models = [];
    let attrObject = null;
    let buildOptionsObject = null;
    let attrsArray = _attrsArray;
    let buildOptionsArray = _buildOptionsArray;

    if (typeof attrsArray === 'object' && !Array.isArray(attrsArray)) {
      attrObject = attrsArray;
      attrsArray = [];
    }

    if (
      !Array.isArray(buildOptionsArray) &&
      typeof buildOptionsArray === 'object'
    ) {
      buildOptionsObject = buildOptionsArray;
      buildOptionsArray = [];
    }

    if (typeof num !== 'number' || num < 1) {
      return Promise.reject(new Error('Invalid number of objects requested'));
    }

    if (!Array.isArray(attrsArray)) {
      return Promise.reject(new Error('Invalid attrsArray passed'));
    }

    if (!Array.isArray(buildOptionsArray)) {
      return Promise.reject(new Error('Invalid buildOptionsArray passed'));
    }

    attrsArray.length = buildOptionsArray.length = num;
    for (let i = 0; i < num; i++) {
      models[i] = this.attrs(
        attrObject || attrsArray[i] || {},
        buildOptionsObject || buildOptionsArray[i] || {}
      );
    }

    return Promise.all(models);
  }

  async buildMany(adapter, num, attrsArray = [], buildOptionsArray = []) {
    const attrs = await this.attrsMany(num, attrsArray, buildOptionsArray);
    const models = attrs.map((attr) => adapter.build(this.Model, attr));
    return Promise.all(models);
  }

  async createMany(adapter, num, attrsArray = [], buildOptionsArray = []) {
    const models = await this.buildMany(
      adapter, num, attrsArray, buildOptionsArray
    );
    const savedModels = models.map((model) => adapter.save(this.Model, model));
    return Promise.all(savedModels);
  }
}

export default Factory;
