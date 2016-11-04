/**
 * @author Robert T Ivaniszyn II
 */
// app/routes.js
var util = require('util');
module.exports = function(app, express, passport) {
	var router = express.Router();
	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/api/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		console.log(util.inspect(req.flash));
		res.json({
			message : req.flash('loginMessage')
		});
	});

	// process the login form
	app.post('/api/login/local', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/api/register', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.json({
			message : req.flash('signupMessage')
		});
	});

	// process the signup form
	app.post('/api/register', passport.authenticate('local-signup', {
		successRedirect : '/private/profile', // redirect to the secure profile section
		failureRedirect : '/register.html', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/api/profile', isLoggedIn, function(req, res) {
		res.json({
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/api/logout', function(req, res) {
		console.log("Logging user out");
		req.logout();
		res.end();
		//res.redirect('/home');
	});

	app.get('/private/profile', isLoggedIn, function(req, res) {
		if (req.headers.referer) {
			var options = {
				root : __dirname + '/../private/pages/',
				dotfiles : 'deny',
				headers : {
					'x-timestamp' : Date.now(),
					'x-sent' : true
				},
			};
			var fileName = 'profile.html';
			res.sendFile(fileName, options, function(err) {
				if (err) {
					console.log("error");
					console.log(err);
					res.status(err.status).end();
				} else {
					console.log('Sent:', fileName);
				}
			});
		} else {
			callIndex(req, res, (__dirname + '/../public/'));
		};
	});
	
	app.get('/profile', isLoggedIn, function(req, res) {

		callIndex(req, res, (__dirname + '/../public/'));
	});
	app.get('/login', function(req, res) {
		if (req.headers.referer) {
			var options = {
				root : __dirname + '/../public/pages/',
				dotfiles : 'deny',
				headers : {
					'x-timestamp' : Date.now(),
					'x-sent' : true
				},
			};
			var fileName = 'login.html';
			res.sendFile(fileName, options, function(err) {
				if (err) {
					console.log("error");
					console.log(err);
					res.status(err.status).end();
				} else {
					console.log('Sent:', fileName);
				}
			});
		} else {
			callIndex(req, res, (__dirname + '/../public/'));
		};

	});
	app.get('/home', function(req, res) {
		if (req.headers.referer) {
			var options = {
				root : __dirname + '/../public/pages/',
				dotfiles : 'deny',
				headers : {
					'x-timestamp' : Date.now(),
					'x-sent' : true
				},
			};
			var fileName = 'home.html';
			res.sendFile(fileName, options, function(err) {
				if (err) {
					console.log("error");
					console.log(err);
					res.status(err.status).end();
				} else {
					console.log('Sent:', fileName);
				}
			});
		} else {
			callIndex(req, res, (__dirname + '/../public/'));
		};
	});
	
	/*app.get('/logout', function(req, res) {
		res.redirect('/');
	});*/
	app.get('/', function(req, res) {
		callIndex(req, res, (__dirname + '/../public/'));
	});
};

function callIndex(req, res, root, next) {
	var options = {
		root : root,
		dotfiles : 'deny',
		headers : {
			'x-timestamp' : Date.now(),
			'x-sent' : true
		},
	};
	var fileName = 'index.html';
	res.sendFile(fileName, options, function(err) {
		if (err) {
			console.log("error");
			console.log(err);
			res.status(err.status).end();
		} else {
			console.log('Sent:', fileName);
		}
	});
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated()) {
		console.log("User logged in!");
		return next();
	}
		

	// if they aren't redirect them to the home page
	console.log('notAuth redirect');
	res.redirect('/login');
	
}