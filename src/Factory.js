/**
 * Created by chetanv on 01/06/16.
 */


class Factory {
  name = null;
  Model = null;
  initializer = null;
  options = null;

  constructor(Model, initializer, options = {}) {
    this.Model = Model;
    this.initializer = initializer;
    this.options = options;
  }

  attrs(attrs = {}, buildOptions = {}) {
    if(typeof this.initializer === 'function') {
      attrs = this.initializer(buildOptions);
    } else {
      attrs = {...this.initializer};
    }

    function buildAttr(a) {
      if (a instanceof Generator) {
        return a.generate();
      }

      if (typeof a === 'function') {
        return a();
      }

      return attr;
    }

    const modelAttrs = {};

    Object.keys(attrs).forEach((attr) => {
      modelAttrs[attr] = buildAttr(attr);
    });

    return modelAttrs;
  }

  build(attrs = {}, buildOptions = {}) {

  }

  buildSync(attrs = {}, buildOptions = {}) {

  }

  create(attrs = {}, buildOptions = {}) {

  }

  attrsMany(num, attrsArray = [], buildOptionsArray = []) {

  }

  buildMany(num, attrsArray = [], buildOptionsArray = []) {

  }

  createMany(num, attrsArray = [], buildOptionsArray = []) {

  }
}

export default Factory;