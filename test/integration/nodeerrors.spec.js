"use strict";
describe("nodeerrors", function () {

	it("is required without throwing an error", function () {
		var nodeerrors = require("../../lib/nodeerrors.js");
		expect(nodeerrors).to.be.ok;
	});


	it("should have the errors and errorCodes defined in .errors.js configuration", function () {
		//first we get a mock of reading the config file
		var requireMock = requireMockFactory(__filename);
		var errorsMock = require("../mocks/.errors.js");
		requireMock.mock("fs", {
			existsSync:function () {
				return true;
			}
		});
		requireMock.mock("*.errors.js", errorsMock);
		var errorConfigMock = requireMock("../../lib/util/getErrorConfig");
		//then we use that mock to load nodeerrors
		requireMock = requireMockFactory(__filename);
		requireMock.mock("*getErrorConfig*", errorConfigMock);

		var nodeerrors = requireMock("../../lib/nodeerrors.js");

		expect(nodeerrors.system).to.be.a("function");
		expect(nodeerrors.notUnique).to.be.a("function");
		expect(nodeerrors.propertyNotDefined).to.be.a("function");
		expect(nodeerrors.errorCodes).to.be.eql({ notUnique: 1, propertyNotDefined: 2, system: 0 });
	});
});