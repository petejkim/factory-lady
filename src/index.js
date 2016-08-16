import FactoryGirl from './FactoryGirl';

export BookshelfAdapter from './adapters/BookshelfAdapter';
export DefaultAdapter from './adapters/DefaultAdapter';
export MongooseAdapter from './adapters/MongooseAdapter';
export SequelizeAdapter from './adapters/SequelizeAdapter';
export ObjectAdapter from './adapters/ObjectAdapter';

const factory = new FactoryGirl();
factory.FactoryGirl = FactoryGirl;

export { factory };

export default factory;
