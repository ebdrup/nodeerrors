'use strict';
describe('specifying an innerError', function () {
	require('../../lib/nodeerrors')();

	it('will return the same Error', function () {
		const outerError = new Error('outer');
		const innerError = new Error('inner');
		const error = outerError.innerError(innerError);

		expect(error).to.be.instanceof(Error);
		expect(error).to.equal(outerError);
	});
});
