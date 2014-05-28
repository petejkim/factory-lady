# factory-girl

[![Build Status](https://travis-ci.org/aexmachina/factory-girl.png)](https://travis-ci.org/aexmachina/factory-girl)

`factory-girl` is a factory library for [Node.js](http://nodejs.org/) and the browser that is inspired by [Factory\_girl](http://github.com/thoughtbot/factory_girl). It works asynchronously and supports associations and the use of functions for generating attributes.

It started out as a fork of [factory-lady](https://github.com/petejkim/factory-lady), but the fork deviated quite a bit. This module uses an adapter to talk to your models so it can support different ORMs such as [Bookshelf](https://github.com/aexmachina/factory-girl-bookshelf) and [Sequelize](https://github.com/aexmachina/factory-girl-sequelize) (and doesn't use `throw` for errors that might occur during save).

## Installation

Node.js:

```
npm install factory-girl
```

To use `factory-girl` in the browser or other JavaScript environments, just include `index.js` and access `window.Factory`.

## Defining Factories

```javascript
var factory = require('factory-lady'),
    User    = require('../../app/models/user'),
    Post    = require('../../app/models/post');

var emailCounter = 1;

factory.define('user', User, {
  state: 'active',
  // define attributes using functions
  email: function() {
    return 'user' + emailCounter++ + '@example.com';
  },
  // or using async functions by accepting a callback
  async: function(callback) {
    somethingAsync(callback);
  },
  password: '123456'
});
console.log(factory.build('user')); => {state: 'active', email: 'user1@example.com', async: 'foo', password: '123456'}

factory.define('post', Post, {
  // create associations using factory.assoc(model, attr)
  // or factory.assoc('user') for user object itself
  user_id: factory.assoc('user', 'id'),
  subject: 'Hello World',
  // you can refer to other attributes using `this`
  slug: function() {
    return slugify(this.subject);
  }
});
console.log(factory.build('post')); => {user_id: 123, subject: 'Hello World', slug: 'hello-world'}
```

## Using Factories

```javascript
factory.build('post', function(err, post) {
  // post is a Post instance that is not saved
});

factory.build('post', {title: 'Foo', content: 'Bar'}, function(err, post) {
  // build a post and override title and content
});

factory.create('post', function(err, post) {
  // post is a saved Post instance
});

factory('post', function(err, post) {
  // same as factory.create
});
```

### `buildMany` and `createMany`

```
factory.buildMany('post', 10, function(err, posts) {
  // build 10 posts
});
factory.buildMany('post', [{title: 'Foo'}, {title: 'Bar'}], function(err, posts) {
  // build 2 posts using the specified attributes
});
factory.buildMany('post', [{title: 'Foo'}, {title: 'Bar'}], 10, function(err, posts) {
  // build 10 posts using the specified attributes for the first and second
});
```

## License

Copyright (c) 2011 Peter Jihoon Kim. This software is licensed under the [MIT License](http://github.com/petejkim/factory-lady/raw/master/LICENSE).
Copyright (c) 2014 Simon Wade. This software is licensed under the [MIT License](http://github.com/petejkim/factory-lady/raw/master/LICENSE).

