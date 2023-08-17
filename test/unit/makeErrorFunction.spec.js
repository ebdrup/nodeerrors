'use strict';
describe('When making an error function', function () {

	const makeErrorFunction = require('../../lib/util/makeErrorFunction');

	describe('when there is no name specified', function () {

		it('will give throw an error', function () {
			const errorCodeSpec = {
				message: 'There was an internal server error'
			};
			expect(function () {
				makeErrorFunction('', errorCodeSpec);
			}).to['throw']('The error code specification has no name');
			expect(function () {
				makeErrorFunction(null, errorCodeSpec);
			}).to['throw']('The error code specification has no name');
			expect(function () {
				makeErrorFunction(undefined, errorCodeSpec);
			}).to['throw']('The error code specification has no name');
		});

	});

	describe('with no arguments', function () {

		it('will have a call stack', function () {
			const errorCodeSpec = {
				message: 'There was an internal server error'
			};
			const fn = makeErrorFunction('system', errorCodeSpec);
			const error = fn();
			expect(error.stack).to.be.ok;
		});

		it('will give it the correct code, id and message', function () {
			const errorCodeSpec = {
				message: 'There was an internal server error'
			};
			const fn = makeErrorFunction('system', errorCodeSpec);
			const errorObject = fn();
			expect(errorObject.code).to.equal('system');
			expect(errorObject.id).to.be.a('string');
			expect(errorObject.message).to.equal(errorCodeSpec.message);
		});

		it('will add properties from spec to error', function () {
			const errorCodeSpec = {
				message: 'There was an internal server error',
				http: 123456
			};
			const fn = makeErrorFunction('system', errorCodeSpec);
			const errorObject = fn();
			expect(errorObject.http).to.equal(123456);
		});

		it('will store argument passed as \'internal\' property', function () {
			const internalData = { test: true, myArray: [1, 2, 3] };
			const errorCodeSpec = {
				message: 'There was an internal server error'
			};
			const fn = makeErrorFunction('test', errorCodeSpec);
			const errorObject = fn(internalData);
			expect(errorObject.internal).to.eql(internalData);
		});
	});

	describe('with arguments', function () {

		it('will format the message with one argument', function () {
			const errorCodeSpec = {
				message: 'error %s',
				args: ['myParameter']
			};
			const fn = makeErrorFunction('test', errorCodeSpec);
			const errorObject = fn('testParameterValue');
			expect(errorObject.message).to.equal('error testParameterValue');
		});

		it('will format the message with one argument and an internal parameter', function () {
			const internalData = { test: true, myArray: [1, 2, 3] };
			const errorCodeSpec = {
				message: 'error %s',
				args: ['myParameter']
			};
			const fn = makeErrorFunction('test', errorCodeSpec);
			const errorObject = fn('testParameterValue', internalData);
			expect(errorObject.message).to.equal('error testParameterValue');
			expect(errorObject.internal).to.eql(internalData);
		});

		it('will format the message with two arguments', function () {
			const errorCodeSpec = {
				message: 'error %s, %s',
				args: ['myParameter1', 'myParameter2']
			};
			const fn = makeErrorFunction('test', errorCodeSpec);
			const errorObject = fn('testParameterValue1', 'testParameterValue2');
			expect(errorObject.message).to.equal('error testParameterValue1, testParameterValue2');
		});

		it('will add the parameter to json in error object message', function () {
			const errorCodeSpec = {
				message: 'error %s',
				args: ['myParameter']
			};
			const fn = makeErrorFunction('test', errorCodeSpec);
			const errorObject = fn('testParameterValue');
			expect(errorObject.myParameter).to.equal('testParameterValue');
		});

		it('will accept an object as parameter', function () {
			const data = { test: true, myArray: [1, 2, 3] };
			const errorCodeSpec = {
				message: 'error %s',
				args: ['myParameter']
			};
			const fn = makeErrorFunction('test', errorCodeSpec);
			const errorObject = fn(data);
			expect(errorObject.myParameter).to.eql(data);
		});

		it('will store additional last parameter as \'internal\' property', function () {
			const data = { test: true, myArray: [1, 2, 3] };
			const errorCodeSpec = {
				message: 'error %s',
				args: ['myParameter']
			};
			const fn = makeErrorFunction('test', errorCodeSpec);
			const errorObject = fn('test', data);
			expect(errorObject.internal).to.eql(data);
		});
	});
});
