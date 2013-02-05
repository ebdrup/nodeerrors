"use strict";
describe("specifying an innerError", function () {
	require("../../lib/nodeerrors");

	it("will return the same Error", function () {
		var outerError = new Error("outer");
		var innerError = new Error("inner");
		var error = outerError.innerError(innerError);

		expect(error).to.be.instanceof(Error);
		expect(error).to.equal(outerError);
	});

});