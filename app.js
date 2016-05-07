var sharedModule = angular.module('shared', []);
var newsModule = angular.module('news', ['shared']);
var chatModule = angular.module('chat', ['shared', 'luegg.directives']);
var scheduleModule = angular.module('schedule', ['shared']);

var app = angular.module("app", ["ngRoute", "firebase", "news", "chat", "schedule"]);

// Heroku Server API URL
app.constant("API_URL", "http://usctriathlon.herokuapp.com/api/");
app.constant('FIREBASE_URL', 'https://usctriathlon.firebaseio.com');

app.config(function($routeProvider) {
	$routeProvider
		.when('/news', {
			templateUrl: 'News/news.html',
			controller: 'NewsCtrl'
		})
		.when('/add-news', {
			templateUrl: 'News/add-news.html',
			controller: 'AddNewsCtrl'
		})
		.when('/chat', {
			templateUrl: 'Chat/chat.html',
			controller: 'ChatCtrl'
		})
		.when('/schedule', {
			templateUrl: 'Schedule/schedule.html',
			controller: 'ScheduleCtrl'
		})
		.when('/add-event', {
			templateUrl: 'Schedule/add-event.html',
			controller: 'AddEventCtrl'
		})
		.when('/profile', {
			templateUrl: 'Profile/profile.html',
			controller: 'ProfileCtrl'
		})
		.otherwise({
			redirectTo: '/news'
		});
});


/* index.html scripts */

/* nav clicks */

$('nav a').on('click', function(e) {
	$('.nav-active').removeClass('nav-active');
});

/* menu clicks */

$('#cancel').on('click', function(e) {
	$('nav ul').show();
	$('#cancel').hide();
	$('#save').hide();
	$('#nav-hint').hide();

	$('#settings').show();
	$('#new').show();

	$('#header').html("USC Triathlon");
});