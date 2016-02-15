(function() {

	var angular = require("angular");

	var app = angular.module("myApp.controller", []);

	app.controller("AppCtrl", ['AuthFactory', '$rootScope', 'AUTH_EVENTS', '$scope', 'SessionService', 'toastr', '$state', 'USER_ROLES',
		function(AuthFactory, $rootScope, AUTH_EVENTS, $scope, SessionService, toastr, $state, USER_ROLES) {

		$scope.userName = null;
		$scope.userRoles =  USER_ROLES.guest;

		$scope.isAuthorized = AuthFactory.isAuthenticated();

		$scope.setCurrentUser = function () {
    		
    		var userName = SessionService.user().userName;
    		var userRoles = SessionService.user().roles;
			
			if(userName && userRoles) {

				$scope.userName = userName;
				$scope.userRoles = userRoles;
			} 
		};

  		$scope.removeCurrentUser = function() {

  			$scope.userName = null;
  			$scope.userRoles = USER_ROLES.guest;
  		}
		
		$scope.setCurrentUser();

		$scope.$on(AUTH_EVENTS.loginSuccess, function(event, args) {
			
			toastr.success("Login Succeed");

			$scope.setCurrentUser();
		});

		$scope.$on(AUTH_EVENTS.notAuthorized, function(event, args) {

			toastr.error('You are not authorized');
		});

		$scope.$on(AUTH_EVENTS.notAuthenticated, function(event, args) {

			toastr.warning('Please Login first');
		});

		$scope.$on(AUTH_EVENTS.loginFailed, function(event, args) {

			toastr.warning("Login failed");
		});

		$scope.logout = function() {

			SessionService.logout();
			$scope.removeCurrentUser();

			$state.go('login');

			toastr.warning("You are logged out");
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

				SessionService.create(data.id, data.username, data.token, data.roles);

				$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

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

