"use strict";
var uuid = require("node-uuid");
var getSerializableError = require("./getSerializableError");

module.exports = function parseError(err) {
	var errors = require("../nodeerrors.js");
	var error;
	if(err && err.internal && err.internal.nodeErrors){
		error = getSerializableError(err);
	} else {
		//this is not one of our errors, must be from mongo or somewhere else, no recovery possible.
		error = parseError(errors.system().innerError(err));
	}
	if(!error.id){
		error.id = uuid.v4();
	}
	return error;
};

