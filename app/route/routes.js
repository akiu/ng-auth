(function() {

	var angular = require("angular");
	var uiRouter = require("angular-ui-router");
	var services = require("../services/services");

	var app = angular.module("myApp.routes", ['ui.router', 'myApp.services']);

	app.config(function($urlRouterProvider, $stateProvider, USER_ROLES) {

		$urlRouterProvider.otherwise('/register');

		$stateProvider
			.state('login', {
				url: '/login',
				templateUrl: "app/view/login.html",
				controller: "LoginCtrl",
				controllerAs: "vm",
				data: {
					authorizedRoles: [USER_ROLES.guest]
				}

			})
			.state('register', {
				url: '/register',
				templateUrl: "app/view/register.html",
				controller: "RegisterCtrl",
				controllerAs: "vm",
				data: {
					authorizedRoles: [USER_ROLES.guest]
				}

			})
			.state('home', {
				url: "/home",
				templateUrl: "app/view/home.html",
				controller: "HomeCtrl",
				controllerAs: "vm",
				data: {
					authorizedRoles: [USER_ROLES.admin]
				},
				resolve: {
					auth: function resolveAuthentication(AuthResolver) {
						return AuthResolver.resolve();
					}
				}
			});
	});

	module.exports = app;

})();

