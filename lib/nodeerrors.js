"use strict";
var getErrorConfig = require("./util/getErrorConfig");
var makeErrorFunction = require("./util/makeErrorFunction");
var moduleConfig = require("moduleconfig");
var parse = require("./util/parse");
var middleware = require("./middleware");

function getNodeErrors() {
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
