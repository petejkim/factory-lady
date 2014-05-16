/* global describe */
var factory = require('..'),
    should = require('should'),
    context = describe;

describe('factory', function() {
  var Model, Person, Job;

  before(function() {
    Model = function() {};

    Model.prototype.save = function(callback) {
      this.saveCalled = true;
      callback();
    };

    Person = function() {};
    Person.protoype = new Model();

    Job = function() {};
    Job.prototype = new Model();
  });

  beforeEach(function() {
    var nameCounter = 1, emailCounter = 1;
    factory.define('person', Person, {
      name: function(cb) {
        process.nextTick(function() { // begone Zalgo!!
          cb(null, "Person " + nameCounter++);
        });
      },
      email: function() { return "email" + (emailCounter++) + "@noemail.com"; },
      age: 25,
      job: factory.assoc('job'),
      title: factory.assoc('job', 'title')
    });

    factory.define('job', Job, {
      title: 'Engineer',
      company: 'Foobar Inc.'
    });
  });

  describe('#build', function() {
    it('builds, but does not save the object', function(done) {
      factory.build('job', function(err, job) {
        (job instanceof Job).should.be.true;
        job.title.should.eql('Engineer');
        job.company.should.eql('Foobar Inc.');
        job.should.not.have.property('saveCalled');
        done();
      });

      context('passing attributes as second argument', function() {
        it('sets them', function(done) {
          factory.build('job', { title: "Artist", company: "Bazqux Co." }, function(err, job) {
            (job instanceof Job).should.be.true;
            job.title.should.eql('Artist');
            job.company.should.eql('Bazqux Co.');
            job.should.not.have.property('saveCalled');
            done();
          });
        });
      });

      context('factory containing an association', function() {
        it('is able to handle that', function(done) {
          factory.build('person', { age: 30 }, function(err, person) {
            (person instanceof Person).should.be.true;
            person.should.not.have.property('saveCalled');
            person.name.should.eql('Person 1');
            person.age.should.eql(30);
            (person.job instanceof Job).should.be.true;
            person.job.title.should.eql('Engineer');
            person.job.company.should.eql('Foobar Inc.');
            person.job.saveCalled.should.be.true;
            person.title.should.eql('Engineer');
            done();
          });
        });
      });
    });
  });

  describe('#create', function() {
    it('builds and saves the object', function(done) {
      factory.create('job', function(err, job) {
        (job instanceof Job).should.be.true;
        job.title.should.eql('Engineer');
        job.company.should.eql('Foobar Inc.');
        job.saveCalled.should.be.true;
        done();
      });
    });

    context('yields errors', function() {

      before(function() {
        var Faulty = function() {};
        Faulty.prototype.save = function(callback) {
          callback(new Error('Save failed'));
        };
        factory.define('faulty', Faulty, {});
      });
      afterEach(function() {
        factory.setAdapter(null, 'faulty');
      });

      it('from the adapter', function(done) {
        var FaultyAdapter = function() {};
        FaultyAdapter.prototype = new factory.Adapter();
        FaultyAdapter.prototype.save = function(doc, Model, cb) {
          cb(new Error('Save failed'));
        };
        factory.setAdapter(new FaultyAdapter(), 'faulty');
        factory.create('faulty', function(err, faulty) {
          (err instanceof Error).should.be.true;
          err.message.should.eql('Save failed');
          done();
        });
      });

      it('from the model', function(done) {
        factory.create('faulty', function(err, faulty) {
          (err instanceof Error).should.be.true;
          err.message.should.eql('Save failed');
          done();
        });
      });
    });

    context('passing attributes as second argument', function() {
      it('sets them', function(done) {
        factory.create('job', { title: "Artist", company: "Bazqux Co." }, function(err, job) {
          (job instanceof Job).should.be.true;
          job.title.should.eql('Artist');
          job.company.should.eql('Bazqux Co.');
          job.saveCalled.should.be.true;
          done();
        });
      });
    });

    context('factory(...) instead of factory.create(...)', function() {
      it('is aliased, so it does the same thing as #create', function(done) {
        factory('job', function(err, job) {
          (job instanceof Job).should.be.true;
          job.title.should.eql('Engineer');
          job.company.should.eql('Foobar Inc.');
          job.saveCalled.should.be.true;
          done();
        });
      });
    });
  });

});

