util = require('util');
exports.printReturnData = function(error, returnData) {
	var printObject = "returnData: " + util.inspect(returnData);
	console.log(printObject);
};

exports.printSchema = function(schema, name) {
	var printObject = name + ": " + util.inspect(schema);
	console.log(printObject);
};