"use strict";

function getErrorConfig(filePath) {
	var config = JSON.parse(JSON.stringify(require(filePath))); //make copy so we do not alter original
	if (!config.system) {
		config.system = {
			message:"There was an internal server error",
			http:500
		};
	}
	return config;
}

module.exports = getErrorConfig;

