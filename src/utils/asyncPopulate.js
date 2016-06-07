/**
 * Created by chetanv on 07/06/16.
 */

async function asyncPopulate(target, source) {
  if(typeof target !== 'object') {
    throw new Error('Invalid target passed');
  }

  if(typeof source !== 'object') {
    throw new Error('Invalid source passed');
  }

  Object.keys(source).forEach(async(attr) => {
    if (Array.isArray(source[attr])) {
      target[attr] = [];
      await asyncPopulate(target[attr], source[attr]);
    } else if (typeof source[attr] === 'object') {
      target[attr] = target[attr] || {};
      await asyncPopulate(target[attr], source[attr]);
    } else if (typeof source[attr] === 'function') {
      target[attr] = await Promise.resolve(source[attr]());
    } else {
      target[attr] = await Promise.resolve(source[attr]);
    }
  });

  return target;
}

export default asyncPopulate;