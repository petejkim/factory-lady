
import DummyModel from './DummyModel';
import DummyAdapter from './DummyAdapter';

export default class DummyFactoryGirl {

  async create(/* name, attrs, buildOptions */) {
    return new DummyModel({
      name: 'Wayne',
      age: 23,
    });
  }

  async build(/* name, attrs, buildOptions */) {
    return new DummyModel({
      name: 'Jane',
      age: 21,
    });
  }

  async attrs(/* name, attrs, buildOptions */) {
    return new DummyModel({
      name: 'Bill',
      age: 32,
    });
  }

  async createMany(/* name, num, attrs, buildOptions */) {
    return [
      new DummyModel({
        name: 'Wayne',
        age: 23,
      }),
      new DummyModel({
        name: 'Jane',
        age: 21,
      }),
    ];
  }

  async attrsMany(/* name, num, attrs, buildOptions */) {
    return [
      new DummyModel({
        name: 'Andrew',
        age: 21,
      }),
      new DummyModel({
        name: 'Isaac',
        age: 25,
      }),
    ];
  }

  async buildMany(/* name, num, attrs, buildOptions */) {
    return [
      new DummyModel({
        name: 'Wayne',
        age: 32,
      }),
      new DummyModel({
        name: 'Jane',
        age: 22,
      }),
    ];
  }

  getAdapter(/* name */) {
    return new DummyAdapter;
  }
}
