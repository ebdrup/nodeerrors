"use strict";
module.exports = function(options){

	var errors = require("nodeerrors");
	return errorHandler;

	function errorHandler(err, req, res, next){
		var error = errors.parse(err);
		req.error = JSON.parse(JSON.stringify(error)); //for logging of internal messages by logger
		console.error(req.error);
		res.statusCode = error.http;
		delete error.http; //do not show http code to users (it's send in header)
		delete error.internal; //do not show internal messages to users
		res.json(error);
	}
};