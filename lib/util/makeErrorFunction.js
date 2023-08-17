'use strict';
const format = require('util').format;
const uuid = require('uuid');

module.exports = function makeErrorFunction(errorCodeName, errorCodeSpec) {
	if (!errorCodeName) {
		throw new Error('The error code specification has no name');
	}

	return function () {
		const error = new Error('');
		let message;
		error.id = 'myId';
		error.code = errorCodeName;
		//get error message
		if (errorCodeSpec.args) {
			const numberOfFormatArguments = (errorCodeSpec.message.match(/\%s|\%d|\%j/g) || []).length;
			const formatArguments = [errorCodeSpec.message];
			const nonInternalArguments = Array.prototype.slice.call(arguments, 0, numberOfFormatArguments);
			formatArguments.push.apply(formatArguments, nonInternalArguments);
			message = format.apply(format, formatArguments);
		} else {
			message = errorCodeSpec.message;
		}
		error.message = message;
		error.id = uuid.v4();
		//add arguments
		let i = 0;
		if (errorCodeSpec.args) {
			for (i = 0; i < errorCodeSpec.args.length; i++) {
				const argName = errorCodeSpec.args[i];
				if (arguments[i]) {
					error[argName] = arguments[i];
				}
			}
		}
		if(arguments[i]){
			error.internal = arguments[i]; //always allow additional last argument to be stored as internal
		}
		error.internal = error.internal || {};
		error.internal.nodeErrors = true;
		//add additional error code spec properties
		const properties = Object.keys(errorCodeSpec);
		for(i=0; i<properties.length; i++){
			const propertyName = properties[i];
			if(propertyName !== 'args' && propertyName !== 'message'){
				error[propertyName] = errorCodeSpec[propertyName];
			}
		}
		return error;
	};
};