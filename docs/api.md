### Factory
The `factory-girl` module exposes an instance of the class `FactoryGirl`.
This instance can be used to:
- create new instances of FactoryGirl
- define factories
- create models, either saved/unsaved instances or model attributes as plain javascript objects.
- specify adapters (per model or global)
- cleanup persisted models

### Creating new instances of FactoryGirl
Although you won't need to do this in most of the scenarios, still if you need another instance of FactoryGirl
you can do so by:

```javascript
import factory from 'factory-girl';

const myFactory = new factory.FactoryGirl(options);
```
We'll talk about options a bit later, or you can refer to [#withOptions](#with-options)
 
 
### Defining Factories
The first step to use the library is defining model factories. In a nutshell, before you ask `factory-girl` to build
models for you, you need to tell `factory-girl` how to build those models.

Following is the signature of the `define` api:
```javascript
define(
  name /* string: name of the factory */, 
  Model /* function: Model class or the constructor function */, 
  initializer /* object|function: the initializer object or function */, 
  options /* object: model factory options */ = {}
)
```
- name: The `name` parameter specifies the name of the model-factory. You need to pass this `name` when you 
request `factory-girl` to create a model instance for you.
- Model: The `Model` parameter specifies the constructor function or the model class to be used to instantiate
models for this model-factory.
- initializer: The `initializer` parameter can be a simple javascript object or a function that returns an object. 
The initializer specifies what attributes need to be initialized to create a meaningful instance of the model.
- options - Optionally you can provide an `options` object.

### Initlizers - values, sequences, functions, async functions, chance, assoc, assocMany, assocBuild, assocBuildMany, assocAttrs, assocAttrsMany

### #withOptions
### #attrs
### #attrsMany
### #build
### #buildMany
### #create
### #createMany




