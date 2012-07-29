"use strict";
describe("When parsing an error", function () {

	var parse = require("../../lib/util/parse");

	it("will wrap a normal exception in a system error", function () {
		var result = parse(new Error("my test"));
		expect(result.code).to.equal(0);
		expect(result.message).to.equal("There was an internal server error");
		expect(result.http).to.equal(500);
		expect(result.internal.innerError).to.be.ok;
		expect(result.internal.innerError.message).to.equal("my test");
		expect(result.internal.innerError.stack).to.be.ok;
	});

	it("will parse on of our errors and put stack on 'internal' properties", function () {
		var data = {mytest:true, test:[1, 2, 3, 4, 5]};
		var result = parse(new Error(JSON.stringify(data)));
		expect(result.internal.stack).to.be.ok;
		delete result.internal;
		expect(result).to.eql(data);
	});
});