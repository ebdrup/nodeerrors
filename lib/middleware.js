"use strict";
var errors = require("./nodeerrors");
module.exports = function(options){

	return errorHandler;

	function errorHandler(req, res, next, err){
		var error = errors.parse(err);
		req.error = JSON.parse(JSON.stringify(error)); //for logging of internal messages by logger
		res.statusCode = error.http;
		delete error.http; //do not show http code to users (it's send in header)
		delete error.internal; //do not show internal messages to users
		res.json(error);
	}
};