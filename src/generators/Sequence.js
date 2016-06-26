/**
 * Created by chetanv on 01/06/16.
 */

import Generator from './Generator';

export default class Sequence extends Generator {
  // why static and not module scope?
  static sequences = {};

  constructor(factoryGirl, id, callback = null) {
    if (typeof id !== 'string') {
      throw new Error('Invalid sequence key passed');
    }
    super(factoryGirl);
    this.id = id;
    Sequence.sequences[id] = Sequence.sequences[id] || 1;
    this.callback = callback;
  }

  generate() {
    const count = Sequence.sequences[this.id]++;
    return Promise.resolve(this.callback ? this.callback(count) : count);
  }
}
