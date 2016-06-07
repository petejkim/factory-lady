/**
 * Created by chetanv on 06/06/16.
 */

import DummyModel from './DummyModel';

class DummyFactoryGirl {

  async create(name, attrs, buildOptions) {
    return new DummyModel({
      name: 'Wayne',
      age: 23
    });
  }

  async build(name, attrs, buildOptions) {
    return new DummyModel({
      name: 'Jane',
      age: 21
    });
  }

  async createMany(name, num, attrs, buildOptions) {
    return [
      new DummyModel({
        name: 'Wayne',
        age: 23
      }),
      new DummyModel({
        name: 'Jane',
        age: 21
      })
    ];
  }

  async buildMany(name, num, attrs, buildOptions) {
    return [
      new DummyModel({
        name: 'Wayne',
        age: 32
      }),
      new DummyModel({
        name: 'Jane',
        age: 22
      })
    ];
  }
}

export default DummyFactoryGirl;