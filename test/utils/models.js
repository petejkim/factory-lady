/**
 * Created by chetanv on 26/05/16.
 */


var Model = function () {};
Model.prototype.save = function (callback) {
  this.saveCalled = true;
  callback();
};
Model.prototype.destroy = function (callback) {
  this.destroyCalled = true;
  callback();
};

var Person = function () {};
Person.prototype = new Model();

var Job = function () {};
Job.prototype = new Model();

var Company = function () {};
Company.prototype = new Model();

var Post = function () {};
Post.prototype = new Model();

var BlogPost = function () {};
BlogPost.prototype = new Model();

var User = function () {};
User.prototype = new Model();

var Faulty = function () {};
Faulty.prototype.save = function (callback) {
  callback(new Error('Save failed'));
};

module.exports = {
  Person: Person,
  Job: Job,
  Company: Company,
  Post: Post,
  Faulty: Faulty,
  BlogPost: BlogPost,
  User: User
};
