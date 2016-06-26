/**
 * Created by chetanv on 01/06/16.
 */

// maybe this should be called thunkify?
// also I think this should be defined (and exported) in FactoryGirl
export default function thunkify(factoryGirl, SomeGenerator) {
  return (...args) => {
    const generator = new SomeGenerator(factoryGirl, ...args);
    return () => generator.generate();
  };
}
