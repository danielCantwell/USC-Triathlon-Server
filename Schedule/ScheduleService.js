/*
	Service for Schedule Module
*/

scheduleModule.factory('Schedule', ['$firebase', '$firebaseArray', '$firebaseObject', 'FIREBASE_URL',
	function($firebase, $firebaseArray, $firebaseObject, FIREBASE_URL) {

	var ref = new Firebase(FIREBASE_URL);
	var scheduleRef = ref.child('event');

	var practiceRef = scheduleRef.child('practice');
	var practice = $firebaseArray(practiceRef);

	var raceRef = scheduleRef.child('race');
	var races = $firebaseArray(raceRef);

	var otherRef = scheduleRef.child('other');
	var other = $firebaseArray(otherRef);

	var Schedule = {
		practice: practice,
		races: races,
		other: other,
		create: function(type, meetingLocation, date, carpooling, cycling, reqRsvp, details) {

			var event = {
				meetingLocation: meetingLocation,
				date: date,
				carpooling: carpooling,
				cycling: cycling,
				reqRsvp: reqRsvp,
				details: details
			}

			if (type == "Practice") {
				return practice.$add(event);
			} else if (type == "Race") {
				return races.$add(event);
			} else {
				return other.$add(event);
			}

			
		}
		// },
		// get: function(newsId) {
		// 	return $firebaseObject(chatRef.child(newsId));
		// },
		// delete: function(newsObject) {
		// 	return messages.$remove(newsObject);
		// }
	}

	return Schedule;
}]);