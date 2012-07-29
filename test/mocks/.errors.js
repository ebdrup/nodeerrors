module.exports = {
	"notUnique":{
		code:1,
		message:"The property \"%s\" is not unique. The value \"%s\" already exists.",
		args:["propertyName", "propertyValue"],
		http:400
	},
	"propertyNotDefined":{
		code:2,
		message:"The property named \"%s\" should be defined",
		args:["propertyName"],
		http:400
	}
};