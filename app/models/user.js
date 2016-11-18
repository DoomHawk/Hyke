// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var nameObject = {
	prefix : String,
	first : String,
	middle : String,
	last : String,
	suffix : String,
};

var addressObject = {
		street : String,
		city : String,
		state : String,
		zip : Number,
};

var endpointObject = {
		location : String,
		date : Date
};

var profileSchema = mongoose.Schema({
	name : nameObject,
	address : addressObject
});

var tripSchema = mongoose.Schema({
	type : String,
	start : endpointObject,
	end : endpointObject,
	options : {
		seats : Number,
		bags : Number,
		additionalMileage : Number,
		additionalTravelTime : Number,
		pickupFee : Number,
		budget : Number
	},
});

var vehicleSchema = mongoose.Schema({
	make : String,
	model : String,
	year : Number,

});

// define the schema for our user model
var userSchema = mongoose.Schema({

	local : {
		email : String,
		password : String,
	},
	facebook : {
		id : String,
		token : String,
		email : String,
		name : String
	},
	twitter : {
		id : String,
		token : String,
		displayName : String,
		username : String
	},
	google : {
		id : String,
		token : String,
		email : String,
		name : String
	},
	hykeAccount : {
		profile : profileSchema,
		trips : [tripSchema],
		vehicles : [vehicleSchema]
	}

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema); 