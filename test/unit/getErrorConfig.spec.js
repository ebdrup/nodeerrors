"use strict";
var path = require("path");
var fs = require("fs");
describe("when fetching config file", function () {
	it('will return default config if there is no config', function () {
		var result = require("../../lib/util/getErrorConfig");
		expect(result).to.eql({
			system:{
				code:1,
				message:'There was an internal server error',
				http:500
			}
		});
	});

	it('will return the config file by requiring it', function () {
		var requireMock = requireMockFactory(__filename);
		var errorsMock = require("../mocks/.errors.js");

		requireMock.mock("fs", {
			existsSync:function () {
				return true;
			}
		});
		requireMock.mock("*.errors.js", errorsMock);

		//act
		var result = requireMock("../../lib/util/getErrorConfig");

		var expectedResult = JSON.parse(JSON.stringify(errorsMock));
		_(expectedResult).extend({system:{
			code:1,
			message:'There was an internal server error',
			http:500 }
		});

		expect(result).to.eql(expectedResult);
	});

	it('will add system error if it is not defined', function () {
		var requireMock = requireMockFactory(__filename);
		var errorsMock = require("../mocks/.errors.js");

		requireMock.mock("fs", {
			existsSync:function () {
				return true;
			}
		});
		requireMock.mock("*.errors.js", errorsMock);

		//act
		var result = requireMock("../../lib/util/getErrorConfig");

		expect(result.system).to.eql({
			code:1,
			message:"There was an internal server error",
			http:500
		});
	});

	it('will look in config folder if not found in root', function () {
		var requireMock = requireMockFactory(__filename);
		var existsSyncSpy = sinon.spy(fs.existsSync);
		requireMock.mock("fs", {
			existsSync:existsSyncSpy
		});

		//act
		requireMock("../../lib/util/getErrorConfig");

		var firstPath = existsSyncSpy.getCall(0).args[0];
		var secondPath = existsSyncSpy.getCall(1).args[0];

		expect(secondPath).to.equal(path.join(path.dirname(firstPath), "/config/.errors.js"));
	});

	it('will look in parent folder if not found in root or config folder', function () {
		var requireMock = requireMockFactory(__filename);
		var existsSyncSpy = sinon.spy(fs.existsSync);
		requireMock.mock("fs", {
			existsSync:existsSyncSpy
		});

		//act
		requireMock("../../lib/util/getErrorConfig");

		var firstPath = existsSyncSpy.getCall(0).args[0];
		var secondPath = existsSyncSpy.getCall(2).args[0];

		expect(secondPath).to.equal(path.join(path.dirname(firstPath), "../.errors.js"));
	});

});