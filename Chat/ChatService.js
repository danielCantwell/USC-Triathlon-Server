/*
	Service for Chat Module
*/

chatModule.factory('Chat', ['$firebase', '$firebaseArray', '$firebaseObject', 'FIREBASE_URL',
	function($firebase, $firebaseArray, $firebaseObject, FIREBASE_URL) {

	var ref = new Firebase(FIREBASE_URL);
	var chatRef = ref.child('chat');
	var messages = $firebaseArray(chatRef);

	var Chat = {
		all: messages,
		send: function(message) {
			var msg = {
				author: "daniel cantwell",
				message: message
			}
			return messages.$add(msg);
		},
		get: function(messageId) {
			return $firebaseObject(chatRef.child(messageId));
		},
		delete: function(message) {
			return messages.$remove(message);
		}
	}

	return Chat;
}]);