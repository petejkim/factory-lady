/**
 * Created by chetanv on 06/06/16.
 */
import DummyModel from './DummyModel';

export default class DummyMongooseModel extends DummyModel {
  async remove() {
    this.removeCalled = true;
    return this;
  }
}
