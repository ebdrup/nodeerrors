'use strict';
const request = require('request');
describe('when serializing and deserializing a normal error', function () {
	it('will not give the same result', function () {
		const error = new Error('This is my error');
		const serialized = JSON.parse(JSON.stringify(error));
		expect(serialized.stack).not.to.be.ok;
	});
});

describe('when passed an error', function () {
	it('will make an error that is serializable', function () {
		const getSerialiazableError = require('../../lib/util/getSerializableError');
		const error = getSerialiazableError(new Error('This is my error'));
		const serialized = JSON.parse(JSON.stringify(error));
		expect(serialized.stack).to.be.ok;
		expect(error).to.eql(serialized);
	});
	it('will make only copy properties that can be JSON.serialized', function () {
		const getSerialiazableError = require('../../lib/util/getSerializableError');
		const sourceError = new Error('This is my error');
		//create circular reference
		const o = { circle: {} };
		o.circle = o;
		sourceError.test = o;
		const error = getSerialiazableError(sourceError);
		const serialized = JSON.parse(JSON.stringify(error));
		expect(serialized.stack).to.be.ok;
		expect(error).to.eql(serialized);
	});

	it('will not crash on big objects JSON.serialized', function (done) {
		const getSerialiazableError = require('../../lib/util/getSerializableError');
		const sourceError = new Error('This is my error');
		//get request response, that will reak havoc on the node process if JSON.stringify is run on it
		request.get('http://google.com', function (err, response) {
			for (let i = 0; i < 1000; i++) {
				sourceError[i] = response;
			}
			const error = getSerialiazableError(sourceError);
			const serialized = JSON.parse(JSON.stringify(error));
			expect(serialized.stack).to.be.ok;
			expect(error).to.eql(serialized);
			return done();
		});
	});
});
