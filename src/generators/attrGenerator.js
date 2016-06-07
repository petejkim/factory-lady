/**
 * Created by chetanv on 01/06/16.
 */

export default function (factoryGirl, SomeGenerator) {
  return function () {
    const generator = new SomeGenerator(factoryGirl, ...arguments);
    return async function () {
      return generator.generate();
    }
  }
}