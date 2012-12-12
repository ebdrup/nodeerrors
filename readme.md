nodeerror
---------
This is a library for handling errors more efficiently in ```node.js```, especially made for people like me
who use function hoisting most of the time to avoid some of the so-called "callback hell".

Installation
------------
```
npm install nodeerror
```

onError
-------
Instead of writing

```js
return mongoCollection.findOne({}, handleDocument);

function handleDocument(err, document){
	if(err){
    	return callback(err);
	}
    //...
}
```


After you require ```nodeerror``` anywhere (Function.prototype has been extended), you can write:

```js
return mongoCollection.findOne({}, handleDocument.onError(callback));

function handleDocument(err, document){
    //...
}
```
If ```findOne``` returns an error, it will automatically be sent to ```callback```.
You no longer need to handle the error in the ```handleDocument``` function, it will always be falsy
(probably ```null```)


Try catch is inserted around the function that has onError called.
This means that the following code will not result in an uncaught exception. Instead the error will be passed to
```callback```, for error handling.

```js
return mongoCollection.findOne({}, handleDocument.onError(callback));

function handleDocument(err, document){
    throw new Error("some error");
}
```

Specifying you own errors
-------------------------
You specify your own error types by adding the file ```.errors.js``` in the root folder of your project or in
```config/.errors.js```. Here is an example of a ```.errors.js``` file:

```js
module.exports = {
	"notUnique":{
		code:2,
		message:"The property \"%s\" is not unique. The value \"%s\" already exists.",
		args:["propertyName", "propertyValue"],
		http:400
	},
	"propertyNotDefined":{
		code:3,
		message:"The property named \"%s\" should be defined",
		args:["propertyName"],
		http:400
	}
};
```

with the file above, you will be able to use your own errors like this:
```js
var errors = require("nodeerrors"); //I personally make this a global (once and for all)

callback(errors.notUnique("someProperty", "somePropertyValue")); //call callback with 'notUnique' error
```
Notice that ```errors.notUnique``` takes the two parameters ```propertyName``` and ```propertyValue``` as defined in
the ```args``` property above.

Also these two parameters are automatically inserted into the error message where there is a ```%s```.


You will also be able to do like this:
```js
var errors = require("nodeerrors"); //I personally make this a global (once and for all)

callback(errors.propertyNotDefined("someProperty")); //call callback with 'propertyNotDefined' error
```
Notice that ```propertyNotDefined``` only takes a single argument, because there is only one argument defined in
```args```. You can even leave out ```args``` altogether, if your error does not take arguments.


Parsing errors
-----------------------------------------
When you want an error to JSON.stringify-able (handle cyclic references), you should parse it with the ```parse```
function.
If you are passed an error in your own callback, you can parse it like this:
```js
var errors = require("nodeerrors");

function (err, data){
	if(err){
		errorObject = errors.parse(err);
		//...
	}
}
```
The ```errorObject``` variable will now contain
```javascript
{
	"name": "propertyNotDefined",
	"code": 3,
	"http": 400,
	"propertyName": "someProperty",
	"message": "The property named \"someProperty\" should be defined",
	"stack": "[call stack of Error]"
	"id": "1cbf5dab-4630-4d09-b779-2c721e571859"
	"internal": {
		//...
	}
}
```

Note that you can parse any error, also errors passed to you from third party libraries.
Errors from third party libraries are wrapped in a ```system``` error, and the original error will be in
```internal.innerError```

Also note that each when parsing an error it will be given a uuid in the property ```id```, you can use this when
 you log the error and want to look up a specific error.

Adding extra internal values
----------------------------
You can always add an extra parameter, when you create an error. So if we take the ```propertyNotDefined``` example
from above, that took only one parameter, we can do this:
```js
var errors = require("nodeerrors"); //I personally make this a global (once and for all)

callback(errors.propertyNotDefined(
	"someProperty",
	{notice:"This should NEVER happen"} //extra internal parameter
));
```
This extra parameter will be added to the errors internal parameter. So when we parse the error:

```js
var errors = require("nodeerrors");

function (err, data){
	if(err){
		//...
	}
}
```
The ```err``` variable will now contain:
```json
{
	"name": "propertyNotDefined",
	"code": 3,
	"http": 400,
	"propertyName": "someProperty",
	"message": "The property named \"someProperty\" should be defined",
	"stack": "[call stack of Error]"
	"internal": {
		"notice":"This should NEVER happen"
	}
}
```
Note, you should always pass JSON serializable objects as the extra parameter.

innerError
----------
When you are passed an error, you sometimes wrap it in your own error, perhaps grouping different error types into
one kind of error you return. When you do this, you can save the original error using ```.innerError``` on the Error
object (```Error.prototype``` has been extended). So you can do something like this:

```js
var errors = require("nodeerrors"); //I personally put these two as globals (once and for all)
var errorCodes = errors.errorCodes;

function handleDocument(err, document){
	if(err){
		if(err.code = errorCodes.fileNotFound){
 			return callback(errors.mySpecialError().innerError(err));
 		}
 		return callback(err);
 	}
}
```

This returns a ```mySpecialError``` with the ```fileNotFound``` error as an inner error.

Express compatible error handling middleware
--------------------------------------------
TBA :-)