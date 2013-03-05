module.exports = {
	"notUnique":{
		message:"The property \"%s\" is not unique. The value \"%s\" already exists.",
		args:["propertyName", "propertyValue"],
		http:400
	},
	"propertyNotDefined":{
		message:"The property named \"%s\" should be defined",
		args:["propertyName"],
		http:400
	},
	"integration":{
		message:"Test",
		http:400
	}
};