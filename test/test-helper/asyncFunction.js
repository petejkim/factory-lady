
const asyncFunction = func => async done => {
  try {
    await func();
    done();
  } catch (e) {
    done(e);
  }
};

export default asyncFunction;
