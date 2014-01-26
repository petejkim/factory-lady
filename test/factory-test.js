var Factory = require('..');
var should = require('should');
var context = describe;

describe('Factory', function() {
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
    var nameCounter = 1;

    Factory.define('person', Person, {
      name: function(cb) { cb("person " + nameCounter++); }
    , age: 25
    , job: Factory.assoc('job')
    , title: Factory.assoc('job', 'title')
    , job_description: Factory.assoc('job', 'description')
    , job_description_alternate: Factory.assoc('job', 'description_alternate')
    });

    Factory.define('job', Job, {
      title: 'Engineer'
    , company: function(cb) { cb('Foobar Inc.'); }
    , description: function(cb) { cb('{{title}} in {{company}}'); }
    , description_alternate: '{{title}}, {{company}}'
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

      context('factory containing dependent attribute', function() {
        it('is able to handle that where dependent attribute is a string', function(done){
          Factory.build('person', function(person) {
            (person instanceof Person).should.be.true;
            (person.job instanceof Job).should.be.true;
            person.should.not.have.property('saveCalled');
            person.job.saveCalled.should.be.true;
            person.job.title.should.eql('Engineer');
            person.job.company.should.eql('Foobar Inc.');
            person.job.description_alternate.should.eql('Engineer, Foobar Inc.');
            person.job_description_alternate.should.eql('Engineer, Foobar Inc.');
            done();
          });
        });

        it('is able to handle that where dependent attribute is a function', function(done){
          Factory.build('person', function(person) {
            (person instanceof Person).should.be.true;
            (person.job instanceof Job).should.be.true;
            person.should.not.have.property('saveCalled');
            person.job.saveCalled.should.be.true;
            person.job.title.should.eql('Engineer');
            person.job.company.should.eql('Foobar Inc.');
            person.job.description.should.eql('Engineer in Foobar Inc.');
            person.job_description.should.eql('Engineer in Foobar Inc.');
            done();
          });
        });

        it('is able to handle that where dependent attribute is passed as argument', function(done){
          Factory.build('person', { name : 'John Doe, {{title}} - {{age}}' }, function(person) {
            (person instanceof Person).should.be.true;
            (person.job instanceof Job).should.be.true;
            person.should.not.have.property('saveCalled');
            person.job.saveCalled.should.be.true;
            person.name.should.eql('John Doe, Engineer - 25');
            person.title.should.eql('Engineer');
            person.job.title.should.eql('Engineer');
            person.job.company.should.eql('Foobar Inc.');
            person.job.description.should.eql('Engineer in Foobar Inc.');
            person.job_description.should.eql('Engineer in Foobar Inc.');
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

