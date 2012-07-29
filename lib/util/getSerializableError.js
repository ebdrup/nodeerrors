"use strict";
module.exports = function getSerializableError(err) {
	//this copying of properties is needed to get Error properties serialized by JSON.stringify
	var output = {};
	Object.getOwnPropertyNames(err).forEach(function (i) {
		if (err[i] && i !== "arguments") {
			output[i] = err[i];
		}
	});
	return output;
};