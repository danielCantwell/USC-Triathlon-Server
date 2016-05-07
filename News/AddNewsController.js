app.controller('AddNewsCtrl', function ($scope, $rootScope, $location, API_URL) {

		console.log("Add News Controller Loaded");
		$('nav ul').hide();
		$('#new').hide();
		$('#settings').hide();

		$('#cancel').show();
		$('#save').show();
		$('#nav-hint').show();

		$('#header').html("Add News");

		$scope.cancelClick = function() {
			$rootScope.$apply(function() {
				$location.path("/news");
			});
		}
	}
);