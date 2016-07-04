/**
 * Created by chetanv on 01/06/16.
 */

import Generator from './Generator';

export default class Sequence extends Generator {
  static sequences = {};

  constructor(factoryGirl, id = null, callback = null) {
    super(factoryGirl);
    if (typeof id === 'function') {
      callback = id;
      id = null;
    }
    this.id = id || generateId();
    this.callback = callback;
    Sequence.sequences[this.id] = Sequence.sequences[this.id] || 1;
  }
  generate() {
    const next = Sequence.sequences[this.id]++;
    return this.callback ? this.callback(next) : next;
  }
}

function generateId() {
  let id;
  let i = 0;
  do {
    id = `_${i++}`;
  } while (id in Sequence.sequences);
  return id;
}
