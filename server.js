/**
 * @author Robert T Ivaniszyn II
 */
console.log('\n--------------------------------------------------');
console.log("Welcome to the Hyke Server");
console.log('--------------------------------------------------\n');

//Declare a 'self' for the server for holding the master server object
var self = this;

//Instantiate empty vars for dev requires
var util;

//load local configs
var configDB = require('./config/database.js');
var configDefaults = require('./config/defaults.js');

// set up ======================================================================
// get all the tools we need
//Express
var express = require('express');
var session = require('express-session');
var app = express();
var port = process.env.PORT || 8080;

//Mongoose
var mongoose = require('mongoose');
// Use native promises
mongoose.Promise = global.Promise;
//Load all relevant db schema into one object
var dbSchema = {
	configSchemas : require('./app/models/config'),
	userSchema : require('./app/models/user')
};
// connect to our database
mongoose.connect(configDB.url);

//Passport
var passport = require('passport');
// pass passport for configuration
require('./config/passport')(passport);

//Flash Messages
var flash = require('connect-flash');

//Others
var engines = require('consolidate');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dev = require('./app/devTools');

var serverState = {
	dev : false, //default dev mode to off
};

process.argv.forEach(function(val, index, array) {
	if (val == "dev") {
		serverState.dev = true;
		//if (serverState.dev)
		util = require('util');
	};
});

self.server = {
	state : serverState,
	configs : {
		sessionConfig : configDefaults.sessionConfig
	},
	schema : dbSchema
};

var serverInit = function(next) {
	console.log("Hyke Server Initializing...\n");

	console.log("Loading configuration from DB...\n");
	dbQueries.getDBConfigs(function(result) {
		if (result['_id'] === null) {
			self.server.configs = result;
		};

		console.log("Loading configuration from DB complete!\n");

		console.log("Configuring Express for REST API...\n");
		//create statics for public assets
		app.use('/css', express.static(__dirname + '/public/css/'));
		app.use('/themes', express.static(__dirname + '/themes/'));
		app.use('/img', express.static(__dirname + '/themes/img'));
		app.use('/js', express.static(__dirname + '/public/js/'));
		app.use('/fonts', express.static(__dirname + '/public/fonts/'));
		app.use('/npm', express.static(__dirname + '/node_modules/'));
		app.use('/pages', express.static(__dirname + '/public/pages/'));
		app.use('/privatePages', express.static(__dirname + '/private/pages'));
		// set up our express application
		app.use(morgan('dev'));
		// log every request to the console
		app.use(cookieParser());
		// read cookies (needed for auth)
		app.use(bodyParser.urlencoded({
			extended : true
		}));
		app.use(bodyParser.json());
		// get information from html forms

		console.log("Configuring passport for authentication...\n");
		// required for passport
		app.use(session(self.server.configs.sessionConfig));
		// session secret
		app.use(passport.initialize());
		app.use(passport.session());
		// persistent login sessions
		app.use(flash());
		// use connect-flash for flash messages stored in session

		console.log("Loading routes for API...\n");
		// routes ======================================================================
		require('./app/routes.js')(app, express, passport);
		// load our routes and pass in our app and fully configured passport

		console.log('Hyke Server init complete!');
		console.log('--------------------------------------------------\n');
		next();

	});

};

var serverStart = function(next) {
	console.log('\n--------------------------------------------------');
	console.log("Starting Hyke Server...");
	console.log('--------------------------------------------------\n');
	// launch ======================================================================
	app.listen(port);
	next();
};

var dbQueries = {
	getDBConfigs : function(callback) {
		//Load the schema locally for ease of use
		var configSchemas = self.server.schema.configSchemas;

		//Create a local instance of the schema
		var sessionConfigSchema = configSchemas.sessionConfigSchema;

		if (self.server.state.dev)
			dev.printSchema(sessionConfigSchema, "sessionConfigSchema");

		sessionConfigSchema.findOne().sort({
			'_id' : -1
		}).lean().exec(function(error, returnData) {

			if (error) {
				console.log("Error getting session config data: " + error);
				callback(error);
			} else {
				if (self.server.state.dev)
					dev.printReturnData(error, returnData);
				callback(returnData);
			};

		});
	},
};

var getDBConfigs = function(callback) {
	//Load the schema locally for ease of use
	var configSchemas = self.server.schema.configSchemas;

	//Create a local instance of the schema
	var sessionConfigSchema = configSchemas.sessionConfigSchema;

	if (self.server.state.dev)
		dev.printSchema(sessionConfigSchema, "sessionConfigSchema");

	sessionConfigSchema.findOne().sort({
		'_id' : -1
	}).lean().exec(function(error, returnData) {

		if (error) {
			console.log("Error getting session config data: " + error);
			callback(error);
		} else {
			if (self.server.state.dev)
				dev.printReturnData(error, returnData);
			callback(returnData);
		};

	});
};

serverInit(function() {
	serverStart(function() {
		console.log("Hyke Server has successfully started!\n");
		console.log('--------------------------------------------------\n');
		console.log('The magic happens on port ' + port + '!');
		console.log('--------------------------------------------------');
		console.log('Traffic Log:');
		console.log('--------------------------------------------------\n');
	});
});

