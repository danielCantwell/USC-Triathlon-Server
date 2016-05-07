chatModule.directive('messageList', function() {

	return {
		restrict: 'EA',
		scope: {
			messages: '='
		},
		templateUrl: '/Chat/messageList.html',
		link: function(scope, element, attrs) {
		}
	};
});