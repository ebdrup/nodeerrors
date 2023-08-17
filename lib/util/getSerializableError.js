'use strict';
const util = require('util');
module.exports = function getSerializableError(err) {
	//this copying of properties is needed to get Error properties serialized by JSON.stringify
	const output = {};
	//In order to get stack trace and so on, we use Object.getOwnPropertyNames, to get non-enumerable properties
	err && (typeof err === 'object') && Object.getOwnPropertyNames(err).forEach(function (property) {
		if (err[property] !== undefined && property !== 'nodeErrors') {
			if (property === 'innerError' || property === 'internal') {
				output[property] = getSerializableError(err[property]); //deep copy, even if it has cyclic references.
			} else {
				if (shouldSerialize(err[property])) {
					output[property] = err[property];
				} else {
					output[property] = '[cyclic or too complex]';
				}
			}
		}
	});
	return output;
};

function shouldSerialize(obj) {
	let count = 0;
	return  _shouldSerialize(obj);

	function _shouldSerialize(obj) {
		count++;
		if (count >= 1000) {
			return false;
		}
		//default: stringify stuff that can not be run through Object.keys
		if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) {
			return true;
		}
		if (util.isArray(obj)) {
			for (let j = 0; j < obj.length; j++) {
				if (!_shouldSerialize(obj[j])) {
					return false;
				}
			}
		}
		//JSON.stringify stringifies enumerable properties, so we use Object.keys
		const keys = Object.keys(obj), len = keys.length;
		for (let i = 0; i < len; i++) {
			if (!_shouldSerialize(obj[keys[i]])) {
				return false;
			}
		}
		return true;
	}
}