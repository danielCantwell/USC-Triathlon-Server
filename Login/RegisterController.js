/*
	Controller for Register Module
*/

loginModule.controller('RegisterCtrl', ["Auth", "$scope", "$location",
	function(Auth, $scope, $location){

	console.log("Register Controller Loaded");

	$('body > nav').hide();

	$scope.register = function(userParam, officer) {
		console.log("register");
		Auth.register(userParam, officer).catch(function(error) {
			$('#register-error-message').html(error.message);
		});
	}
}]);