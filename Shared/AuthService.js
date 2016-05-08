// Authentication Service

sharedModule.factory('Auth', ["$firebaseArray", "$firebaseObject", "$firebaseAuth", "$rootScope", "$location", "FIREBASE_URL", 
	function($firebaseArray, $firebaseObject, $firebaseAuth, $rootScope, $location, FIREBASE_URL) {

	var currentUser;

	var ref = new Firebase(FIREBASE_URL);
	var auth = $firebaseAuth(ref);

	auth.$onAuth(function(authUser) {
		if (authUser) {
			var ref = new Firebase(FIREBASE_URL + '/member/' + authUser.uid);
			var user = $firebaseObject(ref);
			currentUser = user;
		} else {
			currentUser = '';
		}
	});

	//Temporary object
	var Auth = {

		currentUser: function() {
			return currentUser;
		},

		getUser: function(id) {
			var ref = new Firebase(FIREBASE_URL + '/member/' + id);
			return $firebaseObject(ref);
		},

		login: function(user) {
			console.log("auth login");
			return auth.$authWithPassword({
				email: user.email,
				password: user.password
			}); //authWithPassword
		}, //login

		logout: function(user) {
			return auth.$unauth();
		}, //login

		register: function(user) {
			return auth.$createUser({
				email: user.email,
				password: user.password
			}).then(function(regUser) {

				var usersRef = ref.child("member/" + regUser.uid);

				usersRef.set({
					createdAt : Firebase.ServerValue.TIMESTAMP,
					firstName: user.firstName,
					lastName : user.lastName,
					officer : false
				});

			// usersRef.push(userInfo);
			}); //promise
		}, //register

		requireAuth: function() {
			return auth.$requireAuth();
		}, //require Authentication

		waitForAuth: function() {
			return auth.$waitForAuth();
		} //Wait until user is Authenticated


	}; //myObject
	return Auth;
}]); //myApp Factory
