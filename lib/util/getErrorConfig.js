"use strict";
var _ = require("underscore");
var path = require("path");
var fs = require("fs");
var existsSync = fs.existsSync || path.existsSync;
var CONFIG_FILE_NAME = ".errors.js";

function requireConfig() {
	var dir = path.join(__dirname, "../..");
	var lastDir;

	while (lastDir !== dir) {
		if (existsSync(path.join(dir, CONFIG_FILE_NAME))) {
			return require(path.join(dir, CONFIG_FILE_NAME));
		}
		if (existsSync(path.join(dir, "config", CONFIG_FILE_NAME))) {
			return require(path.join(dir, "config", CONFIG_FILE_NAME));
		}
		lastDir = dir;
		dir = path.join(dir, "..");
	}
	return {};
}
var config = JSON.parse(JSON.stringify(requireConfig())); //make copy so we do not alter original
if (!config.system) {
	config.system = {
		message:"There was an internal server error",
		http:500
	};
}

module.exports = config;

