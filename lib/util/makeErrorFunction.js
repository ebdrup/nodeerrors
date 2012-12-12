"use strict";
var format = require("util").format;

module.exports = function makeErrorFunction(errorCodeName, errorCodeSpec) {
	if (!errorCodeSpec.code && errorCodeSpec.code !== 0) {
		throw new Error(format("The error code specification for %s, has no property 'code'", errorCodeName));
	}

	return function () {
		var error = new Error(""), message;
		error.id = "myId";
		error.internal = {nodeErrors:true};
		error.name = errorCodeName;
		var i = 0;
		if (errorCodeSpec.args) {
			for (i = 0; i < errorCodeSpec.args.length; i++) {
				var argName = errorCodeSpec.args[i];
				if (arguments[i]) {
					error[argName] = arguments[i];
				}
			}
		}
		if(arguments[i]){
			error.internal = arguments[i]; //always allow additional last argument to be stored as internal
		}
		//get error message
		if (errorCodeSpec.args) {
			var formatArguments = [errorCodeSpec.message];
			formatArguments.push.apply(formatArguments, arguments);
			message = format.apply(format, formatArguments);
		} else {
			message = errorCodeSpec.message;
		}
		error.message = message;
		//add additional error code spec properties
		var properties = Object.keys(errorCodeSpec);
		for(i=0; i<properties.length; i++){
			var propertyName = properties[i];
			if(propertyName !== "args" && propertyName !== "message"){
				error[propertyName] = errorCodeSpec[propertyName];
			}
		}
		return error;
	};
};