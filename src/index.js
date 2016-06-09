/**
 * Created by chetanv on 07/06/16.
 */

import FactoryGirl from './FactoryGirl';

const factory = new FactoryGirl();
factory.Factory = FactoryGirl;

export default factory;

// TODO: Object adapter still works with models. Either change that or,
//       add a new JSONAdapter, or maybe we don't need it as we have assocAttrs

