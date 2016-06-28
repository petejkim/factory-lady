/**
 * Created by chetanv on 07/06/16.
 */

// import _debug from 'debug';

// const debug = _debug('asyncPopulate');

/* eslint-disable no-param-reassign */
function asyncPopulate(target, source) {
  if (typeof target !== 'object') {
    return Promise.reject(new Error('Invalid target passed'));
  }

  if (typeof source !== 'object') {
    return Promise.reject(new Error('Invalid source passed'));
  }

  const promises = [];
  Object.keys(source).forEach((attr) => {
    if (Array.isArray(source[attr])) {
      target[attr] = [];
      promises.push(asyncPopulate(target[attr], source[attr]));
    } else if (typeof source[attr] === 'object') {
      target[attr] = target[attr] || {};
      promises.push(asyncPopulate(target[attr], source[attr]));
    } else if (typeof source[attr] === 'function') {
      promises.push(
        Promise.resolve(source[attr]()).then((v) => { target[attr] = v; })
      );
    } else {
      promises.push(
        Promise.resolve(source[attr]).then((v) => { target[attr] = v; })
      );
    }
  });

  return Promise.all(promises);
}
/* eslint-enable no-param-reassign */

export default asyncPopulate;
