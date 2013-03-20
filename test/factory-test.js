var Factory = require('..');
var should = require('should');
var context = describe;

describe('Factory', function() {
  var Model, Person, Job, Robot;

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

    Robot = function() {};
    Robot.prototype = new Model();
    Robot.prototype.set = function(attr, val) {
      this.setterCalled = true;
      this[attr] = val;
    };
    Robot.prototype.get = function(attr) {
      this.getterCalled = true;
      return this[attr];
    };
  });

  beforeEach(function() {
    var nameCounter = 1;

    Factory.define('person', Person, {
      name: function(cb) { cb("person " + nameCounter++); }
    , age: 25
    , job: Factory.assoc('job')
    , title: Factory.assoc('job', 'title')
    });

    Factory.define('job', Job, {
      title: 'Engineer'
    , company: 'Foobar Inc.'
    });

    Factory.define('robot', Robot, {
      name: 'Bender Bending Rodríguez'
    , title: Factory.assoc('job', 'title')
    });
  });

  describe('#build', function() {
    it('builds, but does not save the object', function(done) {
      Factory.build('job', function(job) {
        (job instanceof Job).should.be.true;
        job.title.should.eql('Engineer');
        job.company.should.eql('Foobar Inc.');
        job.should.not.have.property('saveCalled');
        done();
      });

      context('passing attributes as second argument', function() {
        it('sets them', function(done) {
          Factory.build('job', { title: "Artist", company: "Bazqux Co." }, function(job) {
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
          Factory.build('person', { age: 30 }, function(person) {
            (person instanceof Person).should.be.true;
            person.should.not.have.property('saveCalled');
            person.name.should.eql('person 1');
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

      context('factory model with getters and setters', function() {
        before(function() {
          Factory.setter = 'set';
          Factory.getter = 'get';
        });

        after(function() {
          Factory.getter = Factory.setter = null;
        });

        it('builds using defined setter', function(done) {
          Factory.build('robot', function(robot) {
            (robot instanceof Robot).should.be.true;
            robot.get('name').should.eql('Bender Bending Rodríguez');
            robot.get('title').should.eql('Engineer');
            robot.getterCalled.should.be.true;
            robot.setterCalled.should.be.true;
            done();
          });
        });

        it('builds assoc. attribute with defined getter', function(done) {
          Job.prototype.get = function() {
            return 'calledGetter';
          };
          Factory.build('robot', function(robot) {
            robot.title.should.eql('calledGetter')
            Job.prototype.get = undefined;
            done();
          });
        });
      });
    });
  });

  describe('#create', function() {
    it('builds and saves the object', function(done) {
      Factory.create('job', function(job) {
        (job instanceof Job).should.be.true;
        job.title.should.eql('Engineer');
        job.company.should.eql('Foobar Inc.');
        job.saveCalled.should.be.true;
        done();
      });
    });

    context('passing attributes as second argument', function() {
      it('sets them', function(done) {
        Factory.create('job', { title: "Artist", company: "Bazqux Co." }, function(job) {
          (job instanceof Job).should.be.true;
          job.title.should.eql('Artist');
          job.company.should.eql('Bazqux Co.');
          job.saveCalled.should.be.true;
          done();
        });
      });
    });

    context('Factory(...) instead of Factory.create(...)', function() {
      it('is aliased, so it does the same thing as #create', function(done) {
        Factory('job', function(job) {
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

