/**
 * @author Robert T Ivaniszyn II
 */

//Declare a 'self' for the server for holding the master server object
var self = this;

// set up ======================================================================
// get all the tools we need
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var engines = require('consolidate');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');
var configDefaults = require('./config/defaults.js');

//Instantiate empty vars for dev requires
var util;

// Use native promises
mongoose.Promise = global.Promise;

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

//Instantiate all relevant db schema into one object
var dbSchema = {
	configSchemas : require('./app/models/config'),
	userSchema : require('./app/models/user')
};

self.server = {
	state : serverState,
	//configs :
	schema : dbSchema
};

// configuration ===============================================================
mongoose.connect(configDB.url);
// connect to our database

require('./config/passport')(passport);
// pass passport for configuration

var serverInit = function(next) {
	console.log("Hyke Server Initializing...");

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

	// required for passport
	app.use(session(configDefaults.sessionConfig));
	// session secret
	app.use(passport.initialize());
	app.use(passport.session());
	// persistent login sessions
	app.use(flash());

	// use connect-flash for flash messages stored in session

	// routes ======================================================================
	require('./app/routes.js')(app, express, passport);
	// load our routes and pass in our app and fully configured passport
	next();

};

var dev = require('./app/devTools');

var getDBConfigs = function(callback) {
	//Load the schema locally for ease of use
	var configSchemas = self.server.schema.configSchemas;

	//Create a local instance of the schema
	var sessionConfigSchema = configSchemas.sessionConfigSchema;

	if (self.server.state.dev) dev.printSchema(sessionConfigSchema, "sessionConfigSchema");

	sessionConfigSchema.findOne().sort({
		'_id' : -1
	}).exec(function(error, returnData) {
		if (self.server.state.dev) dev.printReturnData(error, returnData);

	});
};

var serverStart = function(next) {
	// launch ======================================================================
	app.listen(port);
	next();
};

serverInit(function() {
	serverStart(function() {
		console.log('The magic happens on port ' + port);
		getDBConfigs();
	});
});

