/**
 * Created by chetanv on 26/05/16.
 */

var factory = require('..');
var models = require('./models');

var Person = models.Person;
var Job = models.Job;
var Company = models.Company;
var Post = models.Post;
var BlogPost = models.BlogPost;
var User = models.User;
var Faulty = models.Faulty;

var nameCounter = 1;
var emailCounter = 1;
var idCounter = 1;

beforeEach(function () {
  nameCounter = 1;
  emailCounter = 1;
  idCounter = 1;
});

factory.define('person', Person, {
  name: function (cb) {
    process.nextTick(function () {
      cb(null, "Person " + nameCounter++);
    });
  },
  email: function () {
    return "email" + (emailCounter++) + "@noemail.com";
  },
  age: 25,
  job: factory.assoc('job', null, {company: 'Bazqux Co.'}),
  title: factory.assoc('job', 'title')
});

factory.define('job', Job, {
  title: 'Engineer',
  company: 'Foobar Inc.',
  duties: {
    cleaning: false,
    writing: true,
    computing: true
  }
});

factory.define('job_with_after_build', Job, {
  title: 'Engineer',
  company: 'Foobar Inc.'
}, {
  afterBuild: function (doc, options, done) {
    doc.title = 'Astronaut';
    done(null, doc);
  }
});

factory.define('job_with_after_create', Job, {
  title: 'Engineer',
  company: 'Foobar Inc.'
}, {
  afterCreate: function (doc, options, done) {
    doc.title = 'Astronaut';
    if (options) {
      if (options.key) {
        doc._key = options.key;
      }

      if (options.anotherKey) {
        doc._anotherKey = options.anotherKey;
      }
    }
    done(null, doc);
  }
});

factory.define('company', Company, {
  name: 'Fruit Company',
  employees: factory.assocMany('person', 3),
  managers: factory.assocMany('person', 'name', 2)
});


factory.define('post', Post, {
  num: factory.sequence(),
  email: factory.sequence(function (n) {
    return 'email' + n + '@test.com';
  }),
  name: factory.seq(function (n, cb) {
    process.nextTick(function () {
      cb(null, 'Post' + n);
    });
  })
});

factory.define('blogpost', BlogPost, {
  heading: 'The Importance of Being Ernest',
  title: function () {
    return this.heading;
  }
});


factory.define('user', User, function (buildOptions) {
  var attrs = {
    username: function () {
      return 'username_' + nameCounter++;
    },
    password: 'dummy_password',
    facebook: {},
    twitter: {}
  };

  if (buildOptions.facebookUser) {
    attrs.facebook = {
      id: function () {
        return 'dummy_fb_id_' + idCounter++;
      },
      token: 'fb_token1234567',
      email: function () {
        return 'fb_email_' + emailCounter++ + '@fb.com';
      },
      name: 'John Doe'
    }
  }

  if(buildOptions.twitterUser) {
    attrs.twitter = {
      id: function () {
        return 'dummy_tw_id_' + idCounter++;
      },
      token: 'tw_token1234567',
      displayName: 'Jane Doe',
      username: function () {
        return 'dummy_tw_handle_' + emailCounter++;
      }
    }
  }

  return attrs;
});

factory.define('faulty', Faulty, {});
factory.setAdapter(null, 'faulty');
