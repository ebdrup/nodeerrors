"use strict";
var getErrorConfig = require("./util/getErrorConfig");
var makeErrorFunction = require("./util/makeErrorFunction");
var moduleConfig = require("moduleconfig");
var parse = require("./util/parse");
var middleware = require("./middleware");

function getNodeErrors() {
	if (!moduleConfig.prototypesExtended) {
		moduleConfig.prototypesExtended = true;
		Error.prototype.innerError = function addInnerError(err) {
			this.internal = this.internal || {};
			this.internal.innerError = err;
			return this;
		};
		Function.prototype.onError = function (callback) {
			var fn = this;
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


	return moduleConfig([".errors.js", "config/.errors.js"], function(errorConfigFilePath){
		//Not in cache, create nodeErrors object
		var nodeError = {
			errorCodes:{},
			middleware:middleware
		};
		nodeError.parse = parse.bind(nodeError);
		var errorCodeSpecs = getErrorConfig(errorConfigFilePath);
		var functionsToMake = Object.keys(errorCodeSpecs); //get array of friendly names.
		for (var i = 0; i < functionsToMake.length; i++) {
			//get error code friendly name, for example: "internalError"
			var errorCodeName = functionsToMake[i];
			//make error function for friendly name
			nodeError[errorCodeName] = makeErrorFunction(errorCodeName, errorCodeSpecs[errorCodeName]);
			//save the error code in errorCodes
			nodeError.errorCodes[errorCodeName] = errorCodeName;
		}
		return nodeError;
	});

}

module.exports = getNodeErrors();
