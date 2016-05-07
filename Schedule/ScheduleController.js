/*
	Controller for Schedule Module
*/

scheduleModule.controller('ScheduleCtrl', ["Schedule", "$scope",
	function(Schedule, $scope){

	console.log("Schedule Controller Loaded");
	$('#new').show();
	$('#nav-schedule').addClass("nav-active");
	$('#type-practice').addClass("nav-active");

	$('#schedule-types input').on('click', function(e) {
		$('#schedule-types .nav-active').removeClass('nav-active');
		$(e.target).addClass("nav-active");
	});

	$scope.type = "Practice";

	$scope.events = Schedule.practice;

	$scope.carpooling = true;
	$scope.cycling = true;
	$scope.reqRsvp = true;

	$scope.loadPractice = function() {
		$scope.events = Schedule.practice;
		$scope.type = "Practice";
	}

	$scope.loadRaces = function() {
		$scope.events = Schedule.races;
		$scope.type = "Race";
	}

	$scope.loadOther = function() {
		$scope.events = Schedule.other;
		$scope.type = "Other";
	}

	$scope.createEvent = function(meetingLocation, date, carpooling, cycling, reqRsvp, details) {
		Schedule.create($scope.type, meetingLocation, date.getTime(), carpooling, cycling, reqRsvp, details).then(function() {
			$scope.meetingLocation = '';
			$scope.date = '';
			$scope.time = '';
			$scope.details = '';
		});
	}

	$scope.newClick = function() {
		$rootScope.$apply(function() {
			$location.path("/add-event");
		});
	}
}]);