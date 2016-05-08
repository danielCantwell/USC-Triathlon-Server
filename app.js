var sharedModule = angular.module('shared', []);
var loginModule = angular.module('login', ['shared']);
var newsModule = angular.module('news', ['shared']);
var chatModule = angular.module('chat', ['shared', 'luegg.directives']);
var scheduleModule = angular.module('schedule', ['shared']);
var settingsModule = angular.module('settings', ['shared'])

var app = angular.module("app", ["ngRoute", "firebase", "shared", "login", "news", "chat", "schedule", "settings"]);

// Heroku Server API URL
// app.constant("API_URL", "http://usctriathlon.herokuapp.com/api/");
app.constant('FIREBASE_URL', 'https://usctriathlon.firebaseio.com');

app.run(["$rootScope", "$location", function($rootScope, $location) {
	$rootScope.$on("$routeChangeError", function(event, next, previous, error) {
		// We can catch the error thrown when the $requireAuth promise is rejected
		// and redirect the user back to the home page
		if (error === "AUTH_REQUIRED") {
			event.preventDefault();
			$location.path("/login");
		}
	});
}]);

app.config(function($routeProvider) {
	$routeProvider
		.when('/login', {
			templateUrl: 'Login/login.html',
			controller: 'LoginCtrl'
		})
		.when('/news', {
			templateUrl: 'News/news.html',
			controller: 'NewsCtrl',
			resolve: {
			    "currentAuth": ["Auth", function(Auth) {
				    return Auth.requireAuth();
			    }]
			}
		})
		.when('/add-news', {
			templateUrl: 'News/add-news.html',
			controller: 'AddNewsCtrl',
			resolve: {
			    "currentAuth": ["Auth", function(Auth) {
				    return Auth.requireAuth();
			    }]
			}
		})
		.when('/chat', {
			templateUrl: 'Chat/chat.html',
			controller: 'ChatCtrl',
			resolve: {
			    "currentAuth": ["Auth", function(Auth) {
				    return Auth.requireAuth();
			    }]
			}
		})
		.when('/schedule', {
			templateUrl: 'Schedule/schedule.html',
			controller: 'ScheduleCtrl',
			resolve: {
			    "currentAuth": ["Auth", function(Auth) {
				    return Auth.requireAuth();
			    }]
			}
		})
		.when('/add-event', {
			templateUrl: 'Schedule/add-event.html',
			controller: 'AddEventCtrl',
			resolve: {
			    "currentAuth": ["Auth", function(Auth) {
				    return Auth.requireAuth();
			    }]
			}
		})
		.when('/settings', {
			templateUrl: 'Settings/settings.html',
			controller: 'SettingsCtrl',
			resolve: {
			    "currentAuth": ["Auth", function(Auth) {
				    return Auth.requireAuth();
			    }]
			}
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