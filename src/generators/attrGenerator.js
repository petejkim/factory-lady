/**
 * Created by chetanv on 01/06/16.
 */

export default function (factoryGirl, SomeGenerator) {
  return (...args) => {
    const generator = new SomeGenerator(factoryGirl, ...args);
    return () => generator.generate();
  };
}
