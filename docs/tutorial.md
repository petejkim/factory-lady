### Tutorial
This tutorial highlights some of the `factory-girl` capabilities using a 
hypothetical `User` model. The purpose is to start with a simple model factory  
and gradually add more features to it using features provided by 
`factory-girl`. This tutorial may not cover all aspects of `factory-girl`, but 
should serve as a good starting point.


### A User factory
Let's start with a simple `User` factory, as we go on, we'll keep on modifying 
this factory to add functionality and showcase how `factory-girl` can help us 
with it.

```javascript
import factory from 'factory-girl';
import User from '../models/User';
import \_debug from 'debug';

const debug = \_debug('factory-girl-demo');

factory.define('User', User, {
  email: 'dummy_user@my_domain.com',
  password: 'a_random_password'
});

factory.build('User').then(function (user) {
  debug(user);
  // => 
  // User { email: 'dummy_user@my_domain.com', password: 'a_random_password' } 
});
```

Whenever we need a `User` object now, we can just request `factory-girl` to 
build one for us! That's awesome, but not very useful yet. All the objects we 
get back from `factory-girl` have same set of details i.e. 
`email = dummy_user@my_domain.com` and `password = `a_random_password`.

The #build api allows us to pass attributes to override default ones, so we can 
do:

```javascript
factory.build('User').then((user1) => { debug(user1); });
// => User { email: 'dummy_user@my_domain.com', password: 'a_random_password' } 
factory.build(
  'User', 
  { email: 'another_user@my_domain.com' }
).then((user2) => { debug(user2); });
// => User { email: 'another_user@my_domain.com', password: 'a_random_password' } 
```

But this again is not very useful, it requires us to keep providing a new email 
value each time we want to create a `User` model.

`factory-girl` has a solution: `sequences`. Instead of providing a hardcoded 
value, we can tell factory-girl to instead use a sequence. A slight 
modification to the model-factory definition:

```javascript
factory.define('User', User, {
  email: factory.sequence('User.email', (n) => `dummy_user_${n}@my_domain.com`),
  password: 'a_random_password'
});
```

Now we get a new email address every time we request `factory-girl` for a 
`User` instance.

```javascript
factory.build('User').then((user1) => { debug(user1); });
// => User { email: 'dummy_user_1@my_domain.com', password: 'a_random_password' } 
factory.build('User').then((user2) => { debug(user2); });
// => User { email: 'dummy_user_2@my_domain.com', password: 'a_random_password' } 
```

Better! Let's add `name` and `about` attributes for our `User` models: 

```javascript
factory.define('User', User, {
  email: factory.sequence('User.email', (n) => `dummy_user_${n}@my_domain.com`),
  password: 'a_random_password'
  name: factory.sequence('User.name', (n) => `user name ${n}`),
  about: 'this ideally should be a paragraph about user',
});
```

This should work fine, but what if you have a few test cases that expect 
`about` to be actually a paragraph? Or rather have user names that look a bit 
realistic instead of `user name 1`? `factory-girl` provides another goodie that 
we can use for a more 'realistic' data: `chancejs`. You can learn more about 
`chancejs` [here](http://chancejs.com/). `factory-girl` exposes a simple 
'#chance' api that can be easily used to populate fields with data generated 
by `chancejs`.

```javascript
factory.define('User', User, {
  email: factory.sequence('user.email', (n) => `dummy_user_${n}@my_domain.com`),
  password: factory.chance('word'),
  name: factory.chance('name'),
  about: factory.chance('paragraph')
});
```

What if you want `about` to have just 2 sentences or names to have a middle 
name as well or passwords to be a bit longer? No problem, you can just pass any 
options expected by the [chancejs api](http://chancejs.com/):

```javascript
factory.define('User', User, {
  email: factory.sequence('user.email', (n) => `dummy_user_${n}@my_domain.com`),
  password: factory.chance('word', { syllables: 4 }),
  name: factory.chance('name', { middle: true }),
  about: factory.chance('paragraph', { sentences: 2 })
});
```

Our user-factory will now create instances such as:

```javascript
User { 
  email: 'dummy_user_1@my_domain.com', 
  password: 'tavnamgi', 
  name: 'Nelgatwu Powuku Heup', 
  about: 'Idefeulo foc omoemowa wahteze liv juvde puguprof epehuji upuga zige odfe igo sit pilamhul oto ukurecef.'
}
```

Let's say we want our `User` instances to have a password expiry date. Assuming 
the date needs to be in future (apart from the test case where it shouldn't), 
hard-coding the date doesn't seems elegant. Let's say by default we want the 
expiry date to be a month from now (i.e. when the instance is being created). 
Anywhere you need to do something to compute a value for an attribute, you can 
provide a function that returns the value to be populated.

Our `User` factory now becomes:

```javascript
factory.define('User', User, {
  email: factory.sequence('user.email', (n) => `dummy_user_${n}@my_domain.com`),
  password: factory.chance('word', { syllables: 4 }),
  name: factory.chance('name', { middle: true }),
  about: factory.chance('paragraph', { sentences: 2 }),
  password_expiry: () => { d = new Date(); return someMethodToAddMonths(date, 1); }
});
```

What if you want to do something asynchronous? Although it won't be the case 
most of the times, but `factory-girl` doesn't restrict you from doing so. 
Anywhere you want to do something asynchronous, just provide a function that 
returns a promise that will resolve to the value to be populated.

```javascript
factory.define('User', User, {
  email: factory.sequence('user.email', (n) => `dummy_user_${n}@my_domain.com`),
  password: factory.chance('word', { syllables: 4 }),
  name: factory.chance('name', { middle: true }),
  about: factory.chance('paragraph', { sentences: 2 }),
  password_expiry: () => methodToAddMonths(new Date(), 1),
  favorite_cn_joke: () => { 
    fetch('http://api.icndb.com/jokes/random')
      .then(response => response.value.joke)
  }
});
```

So far we have been dealing with a single model. Most of the times you have 
several models associated with each other there are a few ways `factory-girl` 
allows you to have associations. Let's say we would like to have our users to 
have a profile image. We start by defining a factory for profile image model 
(assuming we already have a `ProfileImage` model):
 
```javascript
factory.define('ProfileImage', ProfileImage, {
  id: factory.sequence('ProfileImage.id'),
  imageUrl: http://lorempixel.com/200/200
});
```

To associate a profile image with factory generated models, we can simply do:

```javascript
factory.define('User', User, {
  email: factory.sequence('user.email', (n) => `dummy_user_${n}@my_domain.com`),
  password: factory.chance('word', { syllables: 4 }),
  name: factory.chance('name', { middle: true }),
  about: factory.chance('paragraph', { sentences: 2 }),
  password_expiry: () => methodToAddMonths(new Date(), 1),
  favorite_cn_joke: () => { 
    fetch('http://api.icndb.com/jokes/random')
      .then(response => response.value.joke)
  },
  profile_image: factory.assoc('ProfileImage', 'id')
});
```

`factory-girl` will now create a `ProfileImage` instance and place its `id` 
attribute in the `profile_image` attribute of the created `User` instance.

What if you want the `ProfileImage` instance itself to be assigned to 
`profile_image`? Just don't pass `'id'` and the `ProfileImage` instance itself
will be assigned to the `profile_image` attribute.

Note that `factory.assoc` will persist the model instance to DB. In case you
 don't want the model to be persisted, you can instead use `factory.assocBuild`,
 that would just build the model instance and not persist it to DB.
 
If you are looking to just embed the model attributes (not the instance of the 
model), use `factory.assocAttrs` in place of `factory.assoc`.


At times you may want to associate more than one model instance. For example, 
let's say we want our users to have a list of addresses. Assuming we already 
have an `Address` model, we first define the `Address` factory:

```javascript
factory.define('Address', Address, {
  id: factory.sequence('Address.id'),
  address1: factory.chance('address'),
  address2: factory.chance('street'),
  city: factory.chance('city', { country: 'us' }),
  state: factory.chance('state', { country: 'us' }),
  country: 'USA'
});
```

Now, we can tell `factory-girl` to associate a few (3 in the following example) 
addresses with our `User` instances:

```javascript
factory.define('User', User, {
  email: factory.sequence('user.email', (n) => `dummy_user_${n}@my_domain.com`),
  password: factory.chance('word', { syllables: 4 }),
  name: factory.chance('name', { middle: true }),
  about: factory.chance('paragraph', { sentences: 2 }),
  password_expiry: () => methodToAddMonths(new Date(), 1),
  favorite_cn_joke: () => { 
    fetch('http://api.icndb.com/jokes/random')
      .then(response => response.value.joke)
  },
  profile_image: factory.assoc('ProfileImage', 'id'),
  addresses: factory.assocMany('Address', 3)
});
```

Similar to `factory.assoc` we have `factory.assocBuildMany` and `factory.assocAttrsMany` 
to associate non-persisted models or just model attributes.

So far so good! We can already see `factory-girl` making our life easier to  
build model instances. But, it is still limited to some extent. What if you 
have 20 test cases for users with expired password? It's going to be tedious
to override the `password_expiry` attribute for each of those test cases. 
Combine it few more attributes that may change with different test cases and 
things may soon escalate.

`factory-girl` allows you to define model factories with a initializer function 
instead of an object as well. To get started, we just make a simple change:

```javascript
factory.define('User', User, (buildOptions) => {
  return {
    email: factory.sequence('user.email', (n) => `dummy_user_${n}@my_domain.com`),
    password: factory.chance('word', { syllables: 4 }),
    name: factory.chance('name', { middle: true }),
    about: factory.chance('paragraph', { sentences: 2 }),
    password_expiry: () => methodToAddMonths(new Date(), 1),
    favorite_cn_joke: () => { 
      fetch('http://api.icndb.com/jokes/random')
        .then(response => response.value.joke)
    },
    profile_image: factory.assoc('ProfileImage', 'id'),
    addresses: factory.assocMany('Address', 3, 'id')
  };
});
```

Notice that instead of an initializer object, we now have a function, that takes
an argument `buildOptions` and returns an initializer object. The `buildOptions` 
can be specified while requesting `factory-girl` to create an instance. Using 
the initializer function you can customise your models anyway you would want!

Let's first modify our factory a bit to use `buildOptions`, then we'll see how 
to pass `buildOptions`:

```javascript
factory.define('User', User, (buildOptions = {}) => {
  const attrs = {
    email: factory.sequence('user.email', (n) => `dummy_user_${n}@my_domain.com`),
    password: factory.chance('word', { syllables: 4 }),
    name: factory.chance('name', { middle: true }),
    about: factory.chance('paragraph', { sentences: 2 }),
    password_expiry: () => methodToAddMonths(new Date(), 1),
    favorite_cn_joke: () => { 
      fetch('http://api.icndb.com/jokes/random')
        .then(response => response.value.joke)
    },
    profile_image: factory.assoc('ProfileImage', 'id'),
    addresses: factory.assocMany('Address', buildOptions.addressCount || 3, 'id')
  };
  
  if(buildOptions.passwordExpired) {
    attrs['password_expiry'] = methodToAddMonths(new Date(), -1);
  }
  
  return attrs;
});
```

Now, while requesting `factory-girl` to create a `User` instance, we can do:

```javascript
factory.create('User', {}, { passwordExpired: true, addressCount: 4 })
  .then((user) => { debug(user'); })
```
Which would result in something like:
```javascript
User { 
  email: 'dummy_user_1@my_domain.com', 
  password: 'tavnamgi', 
  name: 'Nelgatwu Powuku Heup', 
  about: 'Idefeulo foc omoemowa wahteze liv juvde puguprof epehuji upuga zige odfe igo sit pilamhul oto ukurecef.',
  password_expiry: 'May 22, 2016' // date formatting may be changed,
  favorite_cn_joke: 'Chuck Norris has two speeds: Walk and Kill.',
  profile_image: 1, // id of the ProfileImage instance created
  addresses: [1, 2, 3, 4] // ids of the Address instances created
}
```

