"use strict";
var _ = require("underscore");
var getSerializableError = require("./getSerializableError");

module.exports = function parseError(err) {
	var errors = require("../nodeerrors.js");
	var error;
	try {
		error = JSON.parse(err.message);
		error.internal =  error.internal || {};
		_(error.internal).extend(getSerializableError(err)); //add call stack from Error object
		delete error.internal.message; //no need to keep JSON string, it has been de-serialized in to error object.
		return error;
	} catch (ex) {
		//this is not one of our errors, must be from mongo or somewhere else, no recovery possible.
		return parseError(errors.system().innerError(err));
	}
};

