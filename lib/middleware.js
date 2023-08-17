'use strict';
module.exports = function(options){

	const errors = require('nodeerrors');
	return errorHandler;

	function errorHandler(err, req, res, next){
		const error = errors.parse(err);
		req.error = JSON.parse(JSON.stringify(error)); //for logging of internal messages by logger
		console.error(req.error);
		if(!req.param('callback')){
			res.statusCode = error.http; //only non-jsonp should get http status codes other than 200
			delete error.http; //do not show http code to users (it's send in header)
		}
		delete error.internal; //do not show internal messages to users
		res.json(error);
	}
};
