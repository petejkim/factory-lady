# factory-girl

`factory-girl` is a factory library for [Node.js](http://nodejs.org/) / JavaScript inspired by [Factory\_girl](http://github.com/thoughtbot/factory_girl). It works asynchronously and supports lazy attributes as well as associations.

It is based on [factory-lady](https://github.com/petejkim/factory-lady), but uses an adapter to talk to your models (and doesn't use `throw` for errors that might occur during save).

## Installation

Node.js:

```
npm install factory-girl
```

To use `factory-girl` in the browser or other JavaScript environments, just include `index.js`.

## Defining Factories

JavaScript:

```javascript
var factory = require('factory-lady'),
    User    = require('../../app/models/user'),
    Post    = require('../../app/models/post');

var emailCounter = 1;

factory.define('user', User, {
  email    : function() { return 'user' + emailCounter++ + '@example.com'; }, // lazy attribute
  async    : function(cb) { somethingAsync(cb); }, // async lazy attribute
  state    : 'activated',
  password : '123456'
});

factory.define('post', Post, {
  user_id  : factory.assoc('user', 'id') // simply factory.assoc('user') for user object itself,
  subject  : 'Hello World',
  content  : 'Lorem ipsum dolor sit amet...'
});
```

## Using Factories

JavaScript:

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

## License

Copyright (c) 2011 Peter Jihoon Kim. This software is licensed under the [MIT License](http://github.com/petejkim/factory-lady/raw/master/LICENSE).
Copyright (c) 2014 Simon Wade. This software is licensed under the [MIT License](http://github.com/petejkim/factory-lady/raw/master/LICENSE).

