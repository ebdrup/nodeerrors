module.exports = {
	errorConfigFilePaths : {}, //lookup error configs based on dir name from witch require was called, here
	nodeerrors :{}  //lookup nodeErrors object based on errorConfigFilePath here
}; //cache singleton