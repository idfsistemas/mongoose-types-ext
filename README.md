[![npm version](https://badge.fury.io/js/mongoose-types-ext.svg)](http://badge.fury.io/js/mongoose-types-ext)
[![Build Status](https://travis-ci.org/the-darc/mongoose-types-ext.svg?branch=master)](https://travis-ci.org/the-darc/mongoose-types-ext)
[![Coverage Status](https://coveralls.io/repos/the-darc/mongoose-types-ext/badge.svg)](https://coveralls.io/r/the-darc/mongoose-types-ext)

# mongoose-types-ext #

A package of mongoose types extensions.

## Instalation ##

### With npm

```bash
    npm install --save mongoose-types-ext
```

### Runing tests ###

```bash
	gulp test
```

## Usage ##

Just require the extensions before load your mongoose models:

```javascript
var mongoose = require('mongoose');
require('mongoose-types-ext')(mongoose);
var YourSchemaDefinition = new mongooseSchema({
	someField: {
		type: String,
		maxLength: 10
	},
	/* (...) */
});
var YourModel = mongoose.model('YourModel', YourSchemaDefinition);
```

## Supported extentions ##

### String ###
 - `exactLength`: Sets a exact length string validator.

**Custom error messages:** You can also configure custom error messages and use the special token
`{EXACT_LENGTH}` which will be replaced with the invalid value. Ex: 

```javascript
var rule = [4, 'The length of path `{PATH}` ({VALUE}) should be equal {EXACT_LENGTH}.'];
var schema = new Schema({ n: { type: String, exactLength: rule })
var M = mongoose.model('Measurement', schema);
var s= new M({ n: 'teste' });
s.validate(function (err) {
	console.log(String(err)); // ValidationError: The length of path `n` (test) should be equal 4.
})
```

### Number ###
 - `exclusivemin`: Sets a minimum number validator not including the configurated value.

**Custom error messages:** You can also configure custom error messages and use the special token
`{EXCLUSIVE_MIN}` which will be replaced with the invalid value. Ex: 

```javascript
var rule = [10, 'The value of path `{PATH}` ({VALUE}) should be greater than ({EXCLUSIVE_MIN}).'];
var schema = new Schema({ n: { type: Number, exclusivemin: rule })
var M = mongoose.model('Measurement', schema);
var s= new M({ n: 10 });
s.validate(function (err) {
	console.log(String(err)); // ValidationError: The value of path `n` (10) should be greater than 10.
});
```

How to contribute
-----------------

I am very glad to see this project living with pull requests.

LICENSE
-------

Copyright (c) 2015 Daniel Campos

Licensed under the MIT license.

