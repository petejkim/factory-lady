/**
 * Created by chetanv on 01/06/16.
 */

import Generator from './Generator';

class Sequence extends Generator {
  static sequences = {};
  id = '';

  constructor(factoryGirl, id, callback = null) {
    super(factoryGirl);

    if(typeof id !== 'string') {
      throw new Error('Invalid sequence key passed');
    }

    this.id = id;

    Sequence.sequences[id] = Sequence.sequences[id] || 1;
    this.callback = callback;
  }

  async generate() {
    const count = Sequence.sequences[this.id]++;
    return this.callback ? this.callback(count) : count;
  }
}

export default Sequence;