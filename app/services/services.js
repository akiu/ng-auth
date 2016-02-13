
(function() {

	var angular = require("angular");

	var app = angular.module("myApp.services", []);

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

	app.service("SessionService", ['$q', '$http', 'API_URL', 'USER_ROLES', 
		function($q, $http, API_URL, USER_ROLES) {

		this.user = {
			
			id: null,
			token: null,
			roles: USER_ROLES.guest
			
		};

		this.create = function(user_id, token, roles) {

			this.user.id = user_id;
			this.user.token = token;
			this.user.roles = roles[0];
			
		};

		this.logout = function() {

			this.user.id = null;
			this.user.token = null;
			this.user.roles = USER_ROLES.guest;
			
		};

	}]);

	app.factory('AuthFactory', ['$q', '$http', 'API_URL', 'SessionService', 
		function($q, $http, API_URL, SessionService) {
		
		return {
			
			register : function(username, password) {
				
				var request = {
					
					url: API_URL + "/api/register",
					data: {
						username: username,
						password: password
					},
					method: "POST"
				};

				return $http(request);	
			},

			login : function(username, password) {

				var request = { 
					
					url: API_URL + "/api/login",
					data: {
						username: username,
						password: password,
					},
					method: "POST"
				};

				return $http(request);
			},

			isAuthenticated : function() {
				
				return !!SessionService.user.id;
			},

			isAuthorized : function(authorizedRoles) {
				
				if(!angular.isArray(authorizedRoles)) {
					authorizedRoles = [authorizedRoles];
				}

				return (this.isAuthenticated && authorizedRoles.indexOf(SessionService.user.roles) !== -1);
			}
		};

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

	app.factory('AuthResolver', ['$q', '$rootScope', '$state', 
		function($q, $rootScope, $state) {

		return {

			resolve: function() {

				var deferred = $q.defer();
				var unwatch = $rootScope.$watch('currentUser', function(currentUser) {
					if (angular.isDefined(currentUser)) {
						if(currentUser) {
							deferred.resolve(currentUser);
						} else {
							deferred.reject();
							$state.go('login');
						}

						unwatch();
					}
				});

				return deferred.promise;
			}
		};
	}]);

	module.exports = app;

})();
