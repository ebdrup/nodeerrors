'use strict';
describe('nodeerrors', function () {

	it('is required without throwing an error', function () {
		const nodeerrors = require('../../lib/nodeerrors.js')();
		expect(nodeerrors).to.be.ok;
	});


	it('should have the errors and errorCodes defined in .errors.js configuration', function () {
		const nodeerrors = require('../../lib/nodeerrors.js')();
		expect(nodeerrors.system).to.be.a('function');
		expect(nodeerrors.notUnique).to.be.a('function');
		expect(nodeerrors.propertyNotDefined).to.be.a('function');
		expect(nodeerrors.errorCodes).to.be.eql({
			notUnique: 'notUnique',
			propertyNotDefined: 'propertyNotDefined',
			integration: 'integration',
			system: 'system' });
	});

	describe('having required nodeerrors in test1 dir', function () {
		let nodeerrors1;
		before(function () {
			nodeerrors1 = require('./dirCacheTest/test1/requireNodeErrors');
		});

		it('will have the test1 schema', function () {
			expect(nodeerrors1).to.have.property('test1');
		});

		describe('requiring it again ()', function(){
			let nodeerrors2;
			before(function(){
				//requireSchemagic is not cached in require cache
				nodeerrors2 = require('./dirCacheTest/test1/requireNodeErrors');
			});

			it('will be the same instance', function () {
				expect(nodeerrors2).to.equal(nodeerrors1);
			});

		});
	});
	describe('having required schemagic in test2 dir', function () {
		let nodeerrors1;
		before(function () {
			nodeerrors1 = require('./dirCacheTest/test2/requireNodeErrors');
		});

		it('will have the test2 schema', function () {
			expect(nodeerrors1).to.have.property('test2');
		});

		describe('requiring it from subdir', function(){
			let nodeerrors2;
			before(function(){
				nodeerrors2 = require('./dirCacheTest/test2/test2subdir/requireNodeErrors');
			});

			it.skip('will be equal', function () {
				expect(nodeerrors2).to.equal(nodeerrors1);
			});

		});
	});
	
});