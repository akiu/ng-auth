(function(){

	var angular = require("angular");

	var app = angular.module("myApp.directives", []);

	app.directive("myComponent1", function() {
		return {
			restrict: "E",
			scope: {
				message: "="
			},
			template: '<input type="text" ng-model="vm.message" />',
			controller: function($scope) {
				var vm = this;
				$scope.message = vm.message;
			},
			controllerAs: "vm"
		}
	});	

	app.directive("myComponent2", function() {
		return {
			restrict: "E",
			scope: {
				message: "="
			},
			template: '<input type="text" ng-model="vm.message" />',
			controller: function($scope) {
				var vm = this;
				vm.message = $scope.message
			},
			controllerAs: "vm"
		}
	});


	module.exports = app;
		
})();

