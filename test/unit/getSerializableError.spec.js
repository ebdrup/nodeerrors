"use strict";
describe("when serializing and deserializing a normal error", function () {
	it('will not give the same result', function () {
		var error = new Error("This is my error");
		var serialized = JSON.parse(JSON.stringify(error));
		expect(serialized.stack).not.to.be.ok;
	});
});

describe("when passed an error", function () {
	it('will make an error that is serializable', function () {
		var getSerialiazableError = require("../../lib/util/getSerializableError");
		var error = getSerialiazableError(new Error("This is my error"));
		var serialized = JSON.parse(JSON.stringify(error));
		expect(serialized.stack).to.be.ok;
		expect(error).to.eql(serialized);
	});
	it('will make only copy properties that can be JSON.serialized', function () {
		var getSerialiazableError = require("../../lib/util/getSerializableError");
		var sourceError = new Error("This is my error");
		//create circular reference
		var o= { circle : {}};
		o.circle = o;
		sourceError.test = o;
		var error = getSerialiazableError(sourceError);
		var serialized = JSON.parse(JSON.stringify(error));
		expect(serialized.stack).to.be.ok;
		expect(error).to.eql(serialized);
	});
});