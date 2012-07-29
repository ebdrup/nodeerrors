"use strict";
describe("specifying an innerError", function () {
	require("../../lib/nodeerrors");

	it("will return the same Error", function () {
		var outerError = new Error("outer");
		var innerError = new Error("inner");
		var error = outerError.innerError(innerError);

		expect(error).to.be.a("Error");
		expect(error).to.equal(outerError);
	});

	it("will set the right properties", function () {
		var outerError = new Error("outer");
		var innerError = new Error("inner");
		var error = JSON.parse(outerError.innerError(innerError).message);

		expect(error.message).to.equal("outer");
		expect(error.internal.innerError.stack).to.equal(innerError.stack);
		expect(error.internal.innerError.message).to.equal("inner");
	});

	describe("when used on one of our errors", function () {

		it("will set the right properties, and keep the existing properties", function () {
			var data = {myTest:true};
			var outerError = new Error(JSON.stringify(data));
			var innerError = new Error("inner");
			var error = JSON.parse(outerError.innerError(innerError).message);

			expect(error.myTest).to.equal(true);
			expect(error.internal.innerError.stack).to.equal(innerError.stack);
			expect(error.internal.innerError.message).to.equal("inner");
		});
	});

});