(function() {

	var angular = require("angular");

	var app = angular.module("myApp.controller", []);

	app.controller("AppCtrl", ['AuthFactory', '$rootScope', 'AUTH_EVENTS', '$scope', 'SessionService', 'notifications', '$state', '$scope',
		function(AuthFactory, $rootScope, AUTH_EVENTS, $scope, SessionService, notifications, $state, $scope) {

		var vm = this;

		$scope.currentUser = null;

		vm.user = {};

		
		vm.user.username = null;
		vm.user.roles = [];

		vm.isAuthorized = AuthFactory.isAuthenticated();

		vm.setCurrentUser = function (username, roles) {
    		
    		//menampilkan username di menu
    		vm.user.username = username;

    		//menampilkan menu sesuai roles
    		vm.user.roles = roles;

    		$scope.currentUser = username;
  		};
		
		$scope.$on(AUTH_EVENTS.loginSuccess, function(event, args) {
			
			notifications.showSuccess('Login Success');
			vm.setCurrentUser(args.username, args.roles)
		});

		$scope.$on(AUTH_EVENTS.notAuthorized, function(event, args) {

			notifications.showError('You are not authorized');
		});

		$scope.$on(AUTH_EVENTS.notAuthenticated, function(event, args) {

			notifications.showError('Please Login first');
		});

		vm.logout = function() {

			SessionService.logout();

			vm.user.username = null;
			vm.user.token = [];

			$scope.currentUser = null;

			$state.go('login');

			notifications.showError("You Are Logged Out");
		}

		return this;
	}]);

	app.controller("LoginCtrl", ['$scope', 'AuthFactory','$rootScope', 'SessionService', 'AUTH_EVENTS', '$state',
		function($scope, AuthFactory, $rootScope, SessionService, AUTH_EVENTS, $state) {

		var vm = this;
		
		vm.user = {};

		vm.login = function(username, password) {

			AuthFactory.login(username, password).then(function(response) {

				data = response.data;

				SessionService.create(data.id, data.token, data.roles);

				$rootScope.$broadcast(AUTH_EVENTS.loginSuccess, { username: data.username, roles: data.roles});

				$state.go('home');

			}, function(error) {

				$rootScope.$broadcast(AUTH_EVENTS.loginFailed);

			});
		}

		return this;
	}]);

	app.controller("RegisterCtrl", ['$scope', 'AuthFactory', 
		function($scope, AuthFactory) {

		var vm = this;

		vm.user = {};

		vm.register = function() {
			
			AuthFactory.register(vm.user.username, vm.user.password).then(function(data) {

				console.log(data);

			}, function(error) {

				console.log(error);
			});
		}

		return this;		

	}]);

	app.controller("HomeCtrl", ['$scope', 'AuthFactory', 
		function($scope, AuthFactory) {

		var vm = this;

		

		return this;		

	}]);

	module.exports = app;

})();

