'use strict';

function getCyclicObject() {
	const x = {};
	const y = { loop: x };
	x.loop = y;
	return x;
}

describe('When parsing an error', function () {

	const nodeerrors = require('../../lib/nodeerrors.js')();
	const parse = require('../../lib/util/parse');
	const makeErrorFunction = require('../../lib/util/makeErrorFunction');

	it('will wrap a normal exception in a system error', function () {
		const result = parse.call(nodeerrors, new Error('my test'));
		expect(result).to.have.property('id').to.be.a('string');
		expect(result.code).to.equal('system');
		expect(result.message).to.equal('There was an internal server error');
		expect(result.http).to.equal(500);
		expect(result.internal.innerError).to.be.ok;
		expect(result.internal.innerError.message).to.equal('my test');
		expect(result.internal.innerError.stack).to.be.ok;
	});

	it('will handle a cyclic property in innerError', function () {
		const err = new Error('my test');
		err.cyclic = getCyclicObject();
		const result = parse.call(nodeerrors, err);
		expect(result).to.have.property('id').to.be.a('string');
		expect(result.code).to.equal('system');
		expect(result.message).to.equal('There was an internal server error');
		expect(result.http).to.equal(500);
		expect(result.internal.innerError).to.be.ok;
		expect(result.internal.innerError.message).to.equal('my test');
		expect(result.internal.innerError.stack).to.be.ok;
		expect(result.internal.innerError.cyclic).to.equal('[cyclic or too complex]');
	});

	it('will handle cyclic property in error, not return nodeErrors-property, and not overwrite id', function () {
		const errorCodeSpec = {
			message: 'Test',
			http: 123456,
			cyclic: getCyclicObject()
		};
		const fn = makeErrorFunction('test', errorCodeSpec);
		const err = fn();
		const errorId = err.id;
		const result = parse.call(nodeerrors, err);
		expect(result).to.have.property('id').to.be.a('string');
		expect(result.code).to.equal('test');
		expect(result.message).to.equal('Test');
		expect(result.http).to.equal(123456);
		expect(result.cyclic).to.equal('[cyclic or too complex]');
		expect(result.id).to.equal(errorId);
		expect(result.internal).to.not.have.property('nodeErrors');
	});
});
