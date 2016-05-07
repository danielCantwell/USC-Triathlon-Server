app.controller('AddEventCtrl', function ($scope, $rootScope, $location, API_URL) {

		console.log("Add Event Controller Loaded");
		$('nav ul').hide();
		$('#new').hide();
		$('#settings').hide();

		$('#cancel').show();
		$('#save').show();
		$('#nav-hint').show();

		$('#header').html("Add Event");

		$scope.cancelClick = function() {
			$rootScope.$apply(function() {
				$location.path("/schedule");
			});
		}
	}
);