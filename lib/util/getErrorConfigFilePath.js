"use strict";
var path = require("path");
var fs = require("fs");
var existsSync = fs.existsSync || path.existsSync;
var FILE_NAME = ".errors.js";

module.exports = function getErrorConfigFilePath(startDir) {
	var dir = startDir;
	var lastDir;
	while (lastDir !== dir) {
		if (existsSync(path.join(dir, FILE_NAME))) {
			return path.join(dir, FILE_NAME);
		}
		if (existsSync(path.join(dir, "config", FILE_NAME))) {
			return path.join(dir, "config", FILE_NAME);
		}
		lastDir = dir;
		dir = path.join(dir, "..");
	}
	return false;
};