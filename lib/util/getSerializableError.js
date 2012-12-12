"use strict";
module.exports = function getSerializableError(err) {
	//this copying of properties is needed to get Error properties serialized by JSON.stringify
	var output = {};
	Object.getOwnPropertyNames(err).forEach(function (property) {
		if (err[property] !== undefined && property!== "nodeErrors") {
			if (property === "innerError" || property === "internal") {
				output[property] = getSerializableError(err[property]); //deep copy, even if it has cyclic references.
			} else {
				try {
					//only add properties that can be stringified
					JSON.stringify(err[property]);
					output[property] = err[property];
				} catch (ex) {
					output[property] = "[cyclic]";
				}
			}
		}
	});
	return output;
};