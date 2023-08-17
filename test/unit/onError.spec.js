'use strict';
describe('specifying onError', function () {
	require('../../lib/nodeerrors')();
	it('calls the callback if there is no error', function () {
		const data = { mytest: true };
		function myFunction(callback) {
			return callback(null, data);
		}
		const errorHandlerSpy = sinon.spy();
		const callbackSpy = sinon.spy();

		myFunction(callbackSpy.onError(errorHandlerSpy));

		expect(errorHandlerSpy).not.to.be.called;
		expect(callbackSpy).to.be.calledWith(null, data);
		expect(callbackSpy).to.be.calledOnce;
	});

	it('calls the error handler if an error is passed', function () {
		const error = new Error('test');
		function myFunction(callback) {
			return callback(error);
		}
		const errorHandlerSpy = sinon.spy();
		const callbackSpy = sinon.spy();

		myFunction(callbackSpy.onError(errorHandlerSpy));

		expect(callbackSpy).not.to.be.called;
		expect(errorHandlerSpy).to.be.calledWith(error);
		expect(errorHandlerSpy).to.be.calledOnce;
	});

	it('calls the error handler if an error is thrown in the handler', function () {
		const error = new Error('test');
		function myFunction(callback) {
			throw error;
		}
		const errorHandlerSpy = sinon.spy();

		myFunction.onError(errorHandlerSpy)();

		expect(errorHandlerSpy).to.be.calledWith(error);
		expect(errorHandlerSpy).to.be.calledOnce;
	});
});
