/**
 * Created by chetanv on 01/06/16.
 */

export default function (Generator) {
  return function () {
    return new Generator(...arguments);
  }
}