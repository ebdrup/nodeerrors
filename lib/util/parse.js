"use strict";
var uuid = require("uuid");
var getSerializableError = require("./getSerializableError");

module.exports = function parseError(err) {
	var errors = this;
	var error;
	if(err && err.internal && err.internal.nodeErrors){
		error = getSerializableError(err);
	} else {
		//this is not one of our errors, must be from mongo or somewhere else, no recovery possible.
		error = parseError.call(this, errors.system().innerError(err));
	}
	if(!error.id){
		error.id = uuid.v4();
	}
	return error;
};

