"use strict";
module.exports = function getSerializableError(err) {
	//this copying of properties is needed to get Error properties serialized by JSON.stringify
	var output = {};
	Object.getOwnPropertyNames(err).forEach(function (property) {
		if (err[property]) {
			try{
				//only add properties that can be stringified
				JSON.stringify(err[property]);
				output[property] = err[property];
			} catch (ex){

			}
		}
	});
	return output;
};