
(function() {

	var angular = require("angular");
	var localStorage = require("angular-local-storage");

	var app = angular.module("myApp.services", ['LocalStorageModule']);

	app.config(function(localStorageServiceProvider) {
		
		localStorageServiceProvider
			.setPrefix("ngAuth");
	});

	app.constant('API_URL', 'http://localhost:8000');

	app.constant('AUTH_EVENTS', {
		  
		  loginSuccess: 'auth-login-success',
		  loginFailed: 'auth-login-failed',
		  logoutSuccess: 'auth-logout-success',
		  sessionTimeout: 'auth-session-timeout',
		  notAuthenticated: 'auth-not-authenticated',
		  notAuthorized: 'auth-not-authorized'
	});

	app.constant('USER_ROLES', {
		  all: '*',
		  admin: 'admin',
		  editor: 'editor',
		  guest: 'guest'
	});

	app.service("SessionService", ['$q', 'API_URL', 'USER_ROLES', 'localStorageService', 
		function($q, API_URL, USER_ROLES, localStorageService) {

		this.user = function() {
			
			var _user = {};

			_user.id = localStorageService.get("id") ? localStorageService.get("id") : null;
			_user.userName = localStorageService.get("userName") ? localStorageService.get("userName") : null;
			_user.token = localStorageService.get("token") ? localStorageService.get("token") : null;
			_user.roles = localStorageService.get("roles") ? localStorageService.get("roles") : USER_ROLES.guest;

			return _user;
		};

		this.create = function(user_id, username, token, roles) {

			localStorageService.set("id", user_id);
			localStorageService.set("userName", username);
			localStorageService.set("token", token);
			localStorageService.set("roles", roles[0]);

		};

		this.logout = function() {

			localStorageService.remove("id");
			localStorageService.remove("userName");
			localStorageService.remove("token");
			localStorageService.remove("roles");
			
		};

	}]);

	app.factory('AuthFactory', ['$q', '$http', 'API_URL', 'SessionService', 
		function($q, $http, API_URL, SessionService) {
		
		var authService = {};

		authService.login = function(username, password) {

			var request = { 
				
				url: API_URL + "/api/login",
				data: {
					username: username,
					password: password,
				},
				method: "POST"
			};

			return $http(request);
		}

		authService.register = function(username, password) {

			var request = {
				
				url: API_URL + "/api/register",
				data: {
					username: username,
					password: password
				},
				method: "POST"
			};

			return $http(request);	
		}

		authService.isAuthenticated = function() {

			return !!SessionService.user().id;
		}

		authService.isAuthorized = function(authorizedRoles) {
			
			if(!angular.isArray(authorizedRoles)) {
				authorizedRoles = [authorizedRoles];
			}

			return (authService.isAuthenticated && authorizedRoles.indexOf(SessionService.user().roles) !== -1);
			
		}

		return authService;

	}]);

	app.factory('AuthInterceptorFactory', ['$rootScope', '$q', 'AUTH_EVENTS', 
		function($rootScope, $q, AUTH_EVENTS) {

		return {

			responseError: function(response) {
				$rootScope.$broadcast({
					401: AUTH_EVENTS.notAuthenticated,
			        403: AUTH_EVENTS.notAuthorized,
			        419: AUTH_EVENTS.sessionTimeout,
			        440: AUTH_EVENTS.sessionTimeout
				} [response.status], response);
				return $q.reject(response);
			}
		};
	}]);

	module.exports = app;

})();
