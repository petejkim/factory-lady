
export default class DummyModel {
  constructor(attrs = {}) {
    this.attrs = Object.assign({
      name: attrs.name || 'George',
      age: attrs.age || 27,
    }, attrs);
    this.constructorCalled = true;
  }
  async save() {
    this.saveCalled = true;
    return this;
  }
  async destroy() {
    this.destroyCalled = true;
    return this;
  }
  get(attr) {
    return this.attrs[attr];
  }
  set(attrs) {
    return Object.assign(this.attrs, attrs);
  }
}
