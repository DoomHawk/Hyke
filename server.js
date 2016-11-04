/**
 * @author Robert T Ivaniszyn II
 */

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

// configuration ===============================================================
mongoose.connect(configDB.url);
// connect to our database

require('./config/passport')(passport); // pass passport for configuration

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

/*app.set('views', 'public');
app.engine('html', engines.mustache);
app.set('view engine', 'html');*/ 

// required for passport
app.use(session({
    secret : 'ilovescotchscotchyscotchscotch',
    resave : true,
    saveUninitialized : true
}));
// session secret
app.use(passport.initialize());
app.use(passport.session());
// persistent login sessions
app.use(flash());

// use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, express, passport);
// load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port); 