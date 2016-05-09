/*
	Service for Chat Module
*/

chatModule.factory('Chat', ['Auth', '$firebase', '$firebaseArray', '$firebaseObject', 'FIREBASE_URL',
	function(Auth, $firebase, $firebaseArray, $firebaseObject, FIREBASE_URL) {

	var ref = new Firebase(FIREBASE_URL);
	var chatRef = ref.child('chat');
	var messages = $firebaseArray(chatRef);

	var Chat = {
		all: messages,
		send: function(message) {
			var user = Auth.currentUser();
			var author = `${user.firstName} ${user.lastName}`;
			var msg = {
				author: author,
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