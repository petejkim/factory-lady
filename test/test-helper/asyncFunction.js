/**
 * Created by chetanv on 06/06/16.
 */

const asyncFunction = func => async done => {
  try {
    await func();
    done();
  } catch (e) {
    done(e);
  }
};

export default asyncFunction;
