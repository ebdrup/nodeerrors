"use strict";
delete require.cache[__filename]; //do not cache in require cache
var getErrorConfig = require("./util/getErrorConfig");
var makeErrorFunction = require("./util/makeErrorFunction");
var getErrorConfigFilePath = require("./util/getErrorConfigFilePath");
var parse = require("./util/parse");
var middleware = require("./middleware");
var cache = require("./util/cache"); //use requires caching to have a singleton
var path = require("path");

function getNodeErrors() {
	var startDir = path.dirname(module.parent.filename);
	var errorConfigFilePath;
	if (cache.errorConfigFilePaths[startDir]) {
		errorConfigFilePath = cache.errorConfigFilePaths[startDir];
	} else {
		errorConfigFilePath = getErrorConfigFilePath(startDir);
		if(!errorConfigFilePath){
			throw new Error("nodeerrors, cannot find .errors.js, starting from path " + startDir);
		}
		cache.errorConfigFilePaths[startDir] = errorConfigFilePath;
	}
	if (cache.nodeerrors[errorConfigFilePath]) {
		return cache.nodeerrors[errorConfigFilePath];
	}

	if (!cache.prototypesExtended) {
		cache.prototypesExtended = true;
		Error.prototype.innerError = function addInnerError(err) {
			this.internal = this.internal || {};
			this.internal.innerError = err;
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
	}

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

	cache.nodeerrors[errorConfigFilePath] = nodeError;
	return nodeError;
}

module.exports = getNodeErrors();
