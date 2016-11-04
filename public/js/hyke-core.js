/**
 * @author Robert T Ivaniszyn II
 */

//standard closure
(function() {
	//load the dependencies into the core
	var app = angular.module('mo', ['ngRoute']);

	// configure our routes
	app.config(function($routeProvider, $locationProvider) {
		$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : 'pages/home.html',
			controller : 'homeController'
		})

		// route for the about page
		.when('/private/profile', {
			templateUrl : '/private/profile',
			controller : 'profileController'
		})
		.when('/profile', { 
			redirectTo : '/private/profile'
		})

		// route for the contact page
		.when('/login', {
			templateUrl : 'pages/login.html',
			controller : 'loginController'
		})
		
		.when('/logout', {
			templateUrl : 'home',
			controller : 'logoutController'
		})
		
		/*.when('/logout', {
			redirectTo : '/api/logout'
		})*/
		
		.when('/register', {
			templateUrl : 'pages/register.html',
			controller : 'registerController'
		}).otherwise({
			redirectTo : '/'
		});

		// use the HTML5 History API
		$locationProvider.html5Mode(true);

	});

	//moApp.service();

	app.factory("flash", function($rootScope) {
		var queue = [];
		var currentMessage = "";

		$rootScope.$on("$routeChangeSuccess", function() {
			currentMessage = queue.shift() || "";
		});

		return {
			setMessage : function(message) {
				queue.push(message);
			},
			getMessage : function() {
				return currentMessage;
			}
		};
	});

	// create the controller and inject Angular's $scope
	app.controller('homeController', function($scope, $http) {
		var uri = 'http://' + location.hostname + '/api/login';

		$http.get(uri).then(function(response) {
			$scope.flashMessage = response.data;
			if ($scope.flashMessage.message.length == 0) {
				$scope.flashMessage = null;
			}
		});

		$scope.message = 'Hello world! :)';
	});

	app.controller('profileController', function($scope, $http, $location) {
		var uri = 'http://' + location.hostname + '/api/profile';

		$http.get(uri).then(function(response) {
			$scope.user = response.data.user;
			if ($scope.user == null) {
				$location.path( "/login" );
				$scope.$parent.userLoggedIn = false;
			} else {
				$scope.$parent.userLoggedIn = true;
			}
		});
		
		$scope.message = 'Look! I am a profile page.';
	});

	app.controller('registerController', function($scope, $http) {
		var uri = 'http://' + location.hostname + '/api/register';

		$http.get(uri).then(function(response) {
			$scope.flashMessage = response.data;
		});
		$scope.message = 'Log in! JK. This is just a demo.';
	});

	app.controller('loginController', function($scope, $http) {
		var uri = 'http://' + location.hostname + '/api/login';

		$http.get(uri).then(function(response) {
			$scope.flashMessage = response.data;
		});
		$scope.message = 'Log in! JK. This is just a demo.';
	});
	
	app.controller('logoutController', function($scope, $http) {
		var uri = 'http://' + location.hostname + '/api/logout';

		$http.get(uri).then(function(response) {
			$scope.flashMessage = response.data;
			$scope.$parent.userLoggedIn = false;
		});
		$scope.message = 'Log in! JK. This is just a demo.';
	});

})();
