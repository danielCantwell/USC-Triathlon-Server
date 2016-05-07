/*
	Controller for Chat Module
*/

chatModule.controller('ChatCtrl', ["Chat", "$scope",
	function(Chat, $scope){

	console.log("Chat Controller Loaded");
	$('#new').hide();
	$('#nav-chat').addClass("nav-active");

	$scope.messages = Chat.all;

	$scope.sendMessage = function(message) {
		Chat.send(message).then(function() { $scope.message = ''; });
	}
}]);