/*
	Controller for News Module
*/

newsModule.controller('NewsCtrl', ["News", "$scope",
	function(News, $scope){

	console.log("News Controller Loaded");
	$('#new').show();
	$('#nav-news').addClass("nav-active");

	$scope.news = News.all;

	$scope.newsDate = function(timestamp) {
		var date = new Date(timestamp);
		return date.toString();
	}

	$scope.createNews = function(subject, message) {
		News.create(subject, message).then(function() { $scope.subject = ''; $scope.message = ''; });
	}

	$scope.newClick = function() {
		console.log("new click");
		$rootScope.$apply(function() {
			$location.path("/add-news");
		});
	}
}]);