chatModule.directive('messageList', function() {

	return {
		restrict: 'EA',
		scope: {
			messages: '='
		},
		templateUrl: '/Chat/messageList.html',
		link: function(scope, element, attrs) {

			scope.initials = function(name) {
				var words = name.split(" ");
				var initials = "";
				for (var i = 0; i < words.length; i++) {
					initials += words[i].charAt(0);
				}
				return initials;
			}
		}
	};
});