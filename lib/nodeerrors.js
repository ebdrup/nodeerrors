'use strict';
const parentModule = require('parent-module');
const path = require('path');
const getErrorConfig = require('./util/getErrorConfig');
const moduleConfig = require('@debitoor/moduleconfig');
const makeErrorFunction = require('./util/makeErrorFunction');
const parse = require('./util/parse');
const middleware = require('./middleware');

function getNodeErrors() {
	if (!moduleConfig.prototypesExtended) {
		moduleConfig.prototypesExtended = true;
		Error.prototype.innerError = function addInnerError(err) {
			this.internal = this.internal || {};
			this.internal.innerError = err;
			return this;
		};
		Function.prototype.onError = function (callback) {
			const fn = this;
			return function (err) {
				if (err) {
					err.callbackStack = err.callbackStack || new Error().stack;
					return callback(err);
				}
				try {
					fn.apply(null, arguments);
				} catch (ex) {
					return callback(ex);
				}
			};
		};
	}

	const startDir = path.dirname(parentModule());

	const loadPathFunction = (errorConfigFilePath) => {
		//Not in cache, create nodeErrors object
		const nodeError = {
			errorCodes: {},
			middleware: middleware
		};
		nodeError.parse = parse.bind(nodeError);
		const errorCodeSpecs = getErrorConfig(errorConfigFilePath);
		const functionsToMake = Object.keys(errorCodeSpecs); //get array of friendly names.
		for (let i = 0; i < functionsToMake.length; i++) {
			//get error code friendly name, for example: 'internalError'
			const errorCodeName = functionsToMake[i];
			//make error function for friendly name
			nodeError[errorCodeName] = makeErrorFunction(errorCodeName, errorCodeSpecs[errorCodeName]);
			//save the error code in errorCodes
			nodeError.errorCodes[errorCodeName] = errorCodeName;
		}
		return nodeError;
	};

	return moduleConfig({ startDir, paths: ['.errors.js', 'config/.errors.js'], loadPathFunction });
}

module.exports = getNodeErrors;
