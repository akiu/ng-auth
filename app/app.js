var angular = require("angular");

//third library
var angularAnimate = require("angular-animate");
var anglarSanitize = require("angular-sanitize");
var notification = require("ng-notifications-bar");

//local depencency
var directives = require("./directives/directives");
var controllers = require("./controllers/controllers");
var routes = require("./route/routes");
var services = require("./services/services");

var app = angular.module("myApp",	
	[	'myApp.controller', 
		'myApp.directives', 
		'myApp.routes', 
		'myApp.services',

		//animation
		'ngAnimate',  
		
		//notification
		'ngNotificationsBar', 
		'ngSanitize'
	]);

app.config(function($httpProvider) {
	$httpProvider.interceptors.push([
		'$injector', function($injector) {
			return $injector.get('AuthInterceptorFactory');
		}
	]);
});

app.run(function($rootScope, AUTH_EVENTS, AuthFactory) {

	$rootScope.$on("$stateChangeStart", function(event, next) {
		
		var authorizedRoles = next.data.authorizedRoles;

		if(!AuthFactory.isAuthorized(authorizedRoles)) {
			event.preventDefault();

			if (AuthFactory.isAuthenticated()) {
			    
			    // user is not allowed
	        	$rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
	      	
	      	} else {
	        	
	        	// user is not logged in
	        	$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
	      	}
		}
	})
});