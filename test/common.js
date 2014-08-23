global.sinon = require('sinon');
var chai = require('chai');
chai.config.includeStack = true;
global.expect = chai.expect;
chai.use(require('sinon-chai'));
