/*
	Controller for Login Module
*/

loginModule.controller('LoginCtrl', ["Auth", "$scope", "$location",
	function(Auth, $scope, $location){

	console.log("Login Controller Loaded");

	$('body > nav').hide();

	$scope.login = function(userParam) {
		console.log("login");
		Auth.login(userParam).then(function(user) {
			$('body > nav').show();
			$location.path("/news");
		}).catch(function(error) {
			$('#login-error-message').html(error.message);
		});
	}
}]);