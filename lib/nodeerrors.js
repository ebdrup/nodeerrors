"use strict";
var _ = require("underscore");
var errorCodeSpecs = require("./util/getErrorConfig");
var makeErrorFunction = require("./util/makeErrorFunction");
var parse = require("./util/parse");
var getSerializableError = require("./util/getSerializableError");
var middleware = require("./middleware");

var nodeError = {
	errorCodes:{},
	parse:parse,
	middleware:middleware
};

var functionsToMake = _.keys(errorCodeSpecs); //get array of freindly names.
for (var i = 0; i < functionsToMake.length; i++) {
	//get error code freindly name, for example: "internalError"
	var errorCodeName = functionsToMake[i];
	//make error function for freindly name
	nodeError[errorCodeName] = makeErrorFunction(errorCodeName, errorCodeSpecs[errorCodeName]);
	//save the error code in errorCodes
	nodeError.errorCodes[errorCodeName] = errorCodeSpecs[errorCodeName].code;
}

Error.prototype.innerError = function addInnerError(err) {
	var error;
	try {
		error = JSON.parse(this.message);
	} catch (ex) {
		error = {
			message:this.message
		};
	}
	error.internal = error.internal || {};
	error.internal.innerError = getSerializableError(err);
	this.message = JSON.stringify(error);
	return this;
};

Function.prototype.onError = function (callback) {
	var fn = this;
	return function (err) {
		if (err) {
			return callback(err);
		}
		try {
			fn.apply(null, arguments);
		} catch (ex) {
			return callback(ex);
		}
	};
};

module.exports = nodeError;