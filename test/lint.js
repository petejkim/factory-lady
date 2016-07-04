import lint from 'mocha-eslint';

lint(['src', 'test'], {
  formatter: 'stylish',
});
