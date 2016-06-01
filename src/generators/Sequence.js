/**
 * Created by chetanv on 01/06/16.
 */

import Generator from './Generator';

class Sequence extends Generator {
  count = 0;

  constructor(callback = null) {
    this.callback = callback;
  }

  generate() {
    this.count++;
    return this.callback ? this.callback(this.count) : this.count;
  }
}

export default Sequence;