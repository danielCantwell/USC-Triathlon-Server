/*
	Service for News Module
*/

newsModule.factory('News', ['$firebase', '$firebaseArray', '$firebaseObject', 'FIREBASE_URL',
	function($firebase, $firebaseArray, $firebaseObject, FIREBASE_URL) {

	var ref = new Firebase(FIREBASE_URL);
	var newsRef = ref.child('news');
	var news = $firebaseArray(newsRef);

	var News = {
		all: news,
		create: function(subject, message) {
			var msg = {
				author: "daniel cantwell",
				createdAt: Firebase.ServerValue.TIMESTAMP,
				subject: subject,
				message: message
			}
			return news.$add(msg);
		},
		get: function(newsId) {
			return $firebaseObject(chatRef.child(newsId));
		},
		delete: function(newsObject) {
			return messages.$remove(newsObject);
		}
	}

	return News;
}]);