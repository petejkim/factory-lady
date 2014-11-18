var Factory = require('..').Factory;
require('chai').should();

module.exports = function(adapter, Model, countModels) {
  var factory = new Factory();
  factory.setAdapter(adapter);

  beforeEach(function() {
    factory.define('model', Model, {
      name: 'Rudy'
    });
  });

  it('builds a new unsaved model', function(done) {
    factory.build('model', function(err, model) {
      if (err) return done(err);
      model.should.be.an.instanceof(Model);
      adapter.get(model, 'name').should.equal('Rudy');

      countModels(function(err, length) {
        if (err) return done(err);
        length.should.equal(0);
        done();
      });
    });
  });

  it('creates a saved model', function(done) {
    factory.create('model', function(err, model) {
      if (err) return done(err);
      model.should.be.an.instanceof(Model);
      adapter.get(model, 'name').should.equal('Rudy');

      countModels(function(err, length) {
        if (err) return done(err);
        length.should.equal(1);
        done();
      });
    });
  });

  it('cleans up saved models', function(done) {
    factory.create('model', function(err, model) {
      if (err) return done(err);
      factory.cleanup(function(err) {
        if (err) return done(err);
        countModels(function(err, length) {
          if (err) return done(err);
          length.should.equal(0);
          done();
        });
      });
    });
  });
};
