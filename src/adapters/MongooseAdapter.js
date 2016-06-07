/**
 * Created by chetanv on 01/06/16.
 */
  
class MongooseAdapter {
  async build(Model, props) {
    return new Model(props);
  }
  
  save(Model, model) {
    return model.save();
  }
  
  destroy(Model, model) {
    return model.remove();
  }
}

export default MongooseAdapter;
