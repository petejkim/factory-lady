/**
 * Created by chetanv on 06/06/16.
 */

const asyncFunction = function (func) {
  return async function(done) {
    try {
      await func();
      done();
    } catch(e) {
      done(e);
    }
  }
};

export default asyncFunction;