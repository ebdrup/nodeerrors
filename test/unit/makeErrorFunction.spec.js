"use strict";
describe("When making an error function", function () {

	var makeErrorFunction = require("../../lib/util/makeErrorFunction");

	describe("when there is no code specified", function () {

		it("will give throw an error", function () {
			var errorCodeSpec = {
				message:"There was an internal server error"
			};
			expect(function () {
				makeErrorFunction("system", errorCodeSpec);
			}).to["throw"]("The error code specification for system, has no property 'code'");

		});

	});

	describe("with no arguments", function () {

		it("will have a call stack", function () {
			var errorCodeSpec = {
				code:999,
				message:"There was an internal server error"
			};
			var fn = makeErrorFunction("system", errorCodeSpec);
			var error = fn();
			expect(error.stack).to.be.ok;
		});

		it("will give it the correct name, code, id and message", function () {
			var errorCodeSpec = {
				code:999,
				message:"There was an internal server error"
			};
			var fn = makeErrorFunction("system", errorCodeSpec);
			var errorObject = fn();
			expect(errorObject.name).to.equal("system");
			expect(errorObject.id).to.be.a("string");
			expect(errorObject.code).to.equal(errorCodeSpec.code);
			expect(errorObject.message).to.equal(errorCodeSpec.message);
		});

		it("will add properties from spec to error", function () {
			var errorCodeSpec = {
				code:999,
				message:"There was an internal server error",
				http: 123456
			};
			var fn = makeErrorFunction("system", errorCodeSpec);
			var errorObject = fn();
			expect(errorObject.http).to.equal(123456);
		});

		it("will store argument passed as 'internal' property", function () {
			var internalData = { test:true, myArray: [1,2,3]};
			var errorCodeSpec = {
				code:999,
				message:"There was an internal server error"
			};
			var fn = makeErrorFunction("test", errorCodeSpec);
			var errorObject = fn(internalData);
			expect(errorObject.internal).to.eql(internalData);
		});
	});

	describe("with arguments", function () {

		it("will format the message with one argument", function () {
			var errorCodeSpec = {
				code:999,
				message:"error %s",
				args:["myParameter"]
			};
			var fn = makeErrorFunction("test", errorCodeSpec);
			var errorObject = fn("testParameterValue");
			expect(errorObject.message).to.equal("error testParameterValue");
		});

		it("will format the message with one argument and an internal parameter", function () {
			var internalData = { test:true, myArray: [1,2,3]};
			var errorCodeSpec = {
				code:999,
				message:"error %s",
				args:["myParameter"]
			};
			var fn = makeErrorFunction("test", errorCodeSpec);
			var errorObject = fn("testParameterValue", internalData);
			expect(errorObject.message).to.equal("error testParameterValue");
			expect(errorObject.internal).to.eql(internalData);
		});

		it("will format the message with two arguments", function () {
			var errorCodeSpec = {
				code:999,
				message:"error %s, %s",
				args:["myParameter1", "myParameter2"]
			};
			var fn = makeErrorFunction("test", errorCodeSpec);
			var errorObject = fn("testParameterValue1", "testParameterValue2");
			expect(errorObject.message).to.equal("error testParameterValue1, testParameterValue2");
		});

		it("will add the parameter to json in error object message", function () {
			var errorCodeSpec = {
				code:999,
				message:"error %s",
				args:["myParameter"]
			};
			var fn = makeErrorFunction("test", errorCodeSpec);
			var errorObject = fn("testParameterValue");
			expect(errorObject.myParameter).to.equal("testParameterValue");
		});

		it("will accept an object as parameter", function () {
			var data = { test:true, myArray: [1,2,3]};
			var errorCodeSpec = {
				code:999,
				message:"error %s",
				args:["myParameter"]
			};
			var fn = makeErrorFunction("test", errorCodeSpec);
			var errorObject = fn(data);
			expect(errorObject.myParameter).to.eql(data);
		});

		it("will store additional last parameter as 'internal' property", function () {
			var data = { test:true, myArray: [1,2,3]};
			var errorCodeSpec = {
				code:999,
				message:"error %s",
				args:["myParameter"]
			};
			var fn = makeErrorFunction("test", errorCodeSpec);
			var errorObject = fn("test", data);
			expect(errorObject.internal).to.eql(data);
		});
	});
});