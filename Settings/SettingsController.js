/*
	Controller for Settings Module
*/

settingsModule.controller('SettingsCtrl', ["Auth", "$scope", "$location",
	function(Auth, $scope, $location){

	console.log("Settings Controller Loaded");
	$('#nav-settings').addClass("nav-active");

	$scope.user = Auth.currentUser();

	$scope.logout = function() {
		console.log("logout");

		Auth.logout();
		$location.path("/login");
	}
}]);