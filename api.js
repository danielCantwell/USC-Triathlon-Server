var Firebase    = require('firebase');
var rootRef		= new Firebase("https://usctriathlon.firebaseio.com/"),
	memberRef	= rootRef.child('member'),
	eventRef	= rootRef.child('event'),
	rsvpRef		= rootRef.child('rsvp'),
	carpoolRef	= rootRef.child('carpool'),
	chatRef		= rootRef.child('chat'),
	newsRef		= rootRef.child('news'),
	profileRef	= rootRef.child('profile');

var errorStatus = 'error';
var successStatus = 'success';

/*

member  = { uid, createdAt, firstName, lastName, officer }
event   = { id, name, date, details, type, meetingLocation, eventLocation, carpooling, cycling }
rsvp    = { eventId { memberId, going, drivingSelf, hasCar, passengerCapacity, bikeCapacity, needsRack, needsBike, comment } }
carpool = { id, driver, passengerCapacity, bikeCapacity, passengers { }, bikes { } }
chat    = { id, createdAt, memberName, message }
news    = { id, createdAt, memberName, message, subject, linkType, linkId }

*/

// write data - ref.push( { a : 'b' } )

// read data - ref.child( 'a' ).on( 'value', function(snapshot) { snapshot.val() } )

/*
	News and Chat
*/

exports.addNews = function(req, res) {
	var createdAt = Firebase.ServerValue.TIMESTAMP;
	var author = req.body.author;
	var message = req.body.message;
	var subject = req.body.subject;

	var newsItem = {
		createdAt: createdAt,
		author: author,
		subject: subject,
		message: message
	};

	var newDataRef = newsRef.push();
	console.log("Pushing data to " + newDataRef);
	newDataRef.set(newsItem, function(error) {
		if (error) {
			console.log("Add News : Error");
			res.json({
				status: errorStatus,
				error: error
			});
		} else {
			console.log("Add News : Success");
			res.json({
				status: successStatus
			});
		}
	});
}

exports.addChat = function(req, res) {
	var createdAt = Firebase.ServerValue.TIMESTAMP;
	var author = req.body.author;
	var message = req.body.message;

	var chatItem = {
		createdAt: createdAt,
		author: author,
		message: message
	};

	var newDataRef = chatRef.push();
	console.log("Pushing data to " + newDataRef);
	newDataRef.set(chatItem, function(error) {
		if (error) {
			res.json({
				status: errorStatus,
				error: error
			});
		} else {
			res.json({
				status: successStatus
			});
		}
	});
}

exports.loadNews = function(req, res) {
	newsRef.once('value', function(snapshot) {
		if (snapshot.val() != null) {
			console.log("Successfully loaded news");
			res.json({
				status: successStatus,
				news: snapshot.val()
			});
		} else {
			console.log("Error loading news");
			res.json({
				status: errorStatus,
				error: "No news was loaded"
			});
		}
	});
}

exports.loadChat = function(req, res) {
	chatRef.once('value', function(snapshot) {
		if (snapshot.val() != null) {
			console.log("Successfully loaded chat");
			res.json({
				status: successStatus,
				chat: snapshot.val()
			});
		} else {
			console.log("Error loading chat");
			res.json({
				status: errorStatus,
				error: "No chat was loaded"
			});
		}
	});
}

/*
	Events
*/

exports.createEvent = function(req, res) {
	var date 			= req.body.date,
		details			= req.body.details,
		type 			= req.body.type,
		carpooling		= req.body.carpooling == '1',
		cycling			= req.body.cycling == '1',
		meetingLocation	= req.body.meetingLocation,
		reqRsvp			= req.body.reqRsvp == '1';

	var e = {
		date: date,
		details: details,
		carpooling: carpooling,
		cycling: cycling,
		meetingLocation: meetingLocation,
		reqRsvp: reqRsvp
	};

	var eventDataRef = eventRef.child(type).push();
	console.log("Pushing data to " + eventDataRef);
	eventDataRef.set(e, function(error) {
		var response = {};
		if (error) {
			response.status = errorStatus;
			response.error = error;
		} else {
			response.status = successStatus;
		}
		res.json(response);
	});
}

exports.removeEvent = function(req, res) {
	var type = req.body.type;
	var id = req.body.id;

	rsvpRef.child(id).remove();

	eventRef.child(type).child(id).remove(function(error) {
		var response = {};
		if (error) {
			response.status = errorStatus;
			response.error = error;
		} else {
			response.status = successStatus;
		}
		res.json(response);
	});
}

exports.loadEvents = function(req, res) {
	var type = req.params.etype;
	
	eventRef.child(type).once('value', function(snapshot) {
		if (snapshot.val() != null) {
			console.log("Successfully loaded events");
			res.json({
				status: successStatus,
				events: snapshot.val()
			});
		} else {
			console.log("Failed loading events");
			res.json({
				status: errorStatus,
				error: "No events were loaded"
			});
		}
	});
}

exports.rsvp = function(req, res) {

	var eventId = req.body.eventId;
	var uid = req.body.uid;

	var rsvp = {};
	if (req.body.comment != null) {
		rsvp.comment = req.body.comment;
	}

	memberRef.child(uid).once('value', function(snapshot) {
		var name = snapshot.val().firstName + " " + snapshot.val().lastName;
		rsvp.name = name;

		rsvpRef.child(eventId).child(req.body.method).child(uid).set(rsvp, function(error) {
			if (error) {
				res.json({
					status: errorStatus,
					error: error
				});
			} else {
				res.json({
					status: successStatus
				});
			}
		});
	});

	
}

exports.loadRSVPs = function(req, res) {

	var id = req.body.eventId;

	rsvpRef.child(id).once('value', function(snapshot) {
		if (snapshot.val() != null) {
			console.log("Successfully loaded rsvps");
			res.json({
				status: successStatus,
				rsvps: snapshot.val()
			});
		} else {
			console.log("Failed loading rsvps");
			res.json({
				status: errorStatus,
				error: "No rsvps were loaded"
			});
		}
	});
}


/*
	Authentication
*/

exports.createUser = function(req, res) {
	var userEmail = req.body.email;
	var userPassword = req.body.password;
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var isOfficer = (req.body.officer === '1');

	rootRef.createUser({
		email: userEmail,
		password: userPassword
	}, function(error, userData) {
		if (error) {
			res.json({
				status: errorStatus,
				error: error
			});
		} else {

			memberRef.child(userData.uid).set({
	            createdAt : Firebase.ServerValue.TIMESTAMP,
	            firstName: firstName,
	            lastName : lastName,
	            officer : isOfficer
	        }, function(error) {
	        	if (error) {
	        		res.json({
	        			status: errorStatus,
	        			error: error
	        		});
	        	} else {
	        		res.json({
						status: successStatus,
						uid: userData.uid
					});
	        	}
	        });
		}
	});
}

exports.loginUser = function(req, res) {
	var userEmail = req.body.email;
	var userPassword = req.body.password;

	rootRef.authWithPassword({
		email: userEmail,
		password: userPassword
	}, function(error, authData) {
		var result = {};
		if (error) {
			console.log("error");
			result.status =  errorStatus;
			result.error =  error;
			res.json(result);
		} else {
			console.log("success");
			result.status =  successStatus;
			result.authData = authData;
			res.json(result);
		}
	});
}

/* User Profile */

exports.updateCarProfile = function(req, res) {
	var uid = req.body.uid;
	var hasCar = (req.body.hasCar === '1');
	var pCap = req.body.pCap;
	var bCap = req.body.bCap;
	var needRack = (req.body.needRack === '1');

	var carProfile = {
		hasCar: hasCar,
		passengerCapacity: pCap,
		bikeCapacity: bCap,
		needRack: needRack
	};

	profileRef.child(uid).child('car').set(carProfile, function(error) {
		if (error) {
			var response = { status: errorStatus, error: error };
			res.json(response);
		} else {
			res.json( {status: successStatus} );
		}
	});
}

exports.updateMemberInfo = function(req, res) {
	var uid = req.body.uid;
	var email = req.body.email;
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var year = req.body.year;
	var hasBike = (req.body.hasBike === '1');

	memberRef.child(uid).update({ firstName: firstName, lastName: lastName });

	var info = {
		email: email,
		year: year,
		hasBike: hasBike
	};

	profileRef.child(uid).child('info').set(info, function(error) {
		if (error) {
			var response = { status: errorStatus, error: error };
			res.json(response);
		} else {
			res.json( { status: successStatus } );
		}
	});
}


exports.getCarProfile = function(req, res) {
	var uid = req.body.uid;

	profileRef.child(uid).child('car').once('value', function(snapshot) {
		if (snapshot.val() != null) {
			console.log("Successfully loaded car profile");
			res.json({
				status: successStatus,
				carInfo: snapshot.val()
			});
		} else {
			console.log("Failed loading car profile");
			res.json({
				status: errorStatus,
				error: "Could not load car information"
			});
		}
	});
}

exports.promoteToOfficer = function(req, res) {
	var id = req.body.uid;
	var code = req.body.ocode;

	rootRef.child('officerCode').once('value', function(snapshot) {
		var actualCode = snapshot.val();

		if (code == actualCode) {
			// set member officer status to true
			memberRef.child(id).update({officer: true}, function(error) {
				if (error) {
					var response = { status: errorStatus, error: 'unable to promote to officer at this time' };
					res.json(response);
				} else {
					res.json({ status: successStatus });
				}
			});

		} else {
			// alert for wrong code
			var response = { status: errorStatus, error: 'officer code is incorrect' };
			res.json(response);
		}
	});
}

/* FUNCTION */

exports.createPersonCarpools = function(req, res) {
	var eventId = req.body.eventId;

	rsvpRef.child(eventId).once('value', function(snapshot) {
		var rsvps = snapshot.val();
		var availableCars = [];
		var people = [];

		for (var key in rsvps) {
			if (rsvps.hasOwnProperty(key)) {
			    var r = rsvps[key];
			    // add all the people going
			    if (r.going) {
			    	people.push(r.memberId);
			    	console.log("added " + r.memberId);

			    	if (r.hasCar) {
			    		var car = {
							driver: r.memberId,
							passengerCapacity: r.passengerCapacity,
							passengers: [],
						};
						availableCars.push(car);
			    	}
			    }
			}
		}

		// sort availableCars in descending order of passenger capacity
		availableCars.sort(function(a, b) {
			return parseFloat(b.passengerCapacity - a.passengerCapacity);
		});

		// select the cars which will be used
		var vehicles = [];

		var tempPasCount = 0;
		var passengerCount = people.length;
		console.log("\nPassengers: " + passengerCount);

		for (var i = 0; tempPasCount < passengerCount; i++) {
			var c = availableCars[i];
			vehicles.push(c);
			tempPasCount += c.passengerCapacity;

			console.log("Using Car: " + c.driver);
			console.log("Current Passanger Capacity: " + tempPasCount);
		}

		// fill the cars with people

		// first place drivers
		for (var i = 0; i < vehicles.length; i++) {
			var v = vehicles[i];

			console.log("Placing driver " + v.driver);
			v.passengers.push(v.driver);
			var driverPeopleIndex = people.indexOf(v.driver);

			people.splice(driverPeopleIndex, 1);
		}

		// then place everyone else
		for (var i = 0; i < vehicles.length; i++) {
			var v = vehicles[i];
			// fill passenger spots
			while(v.passengers.length < v.passengerCapacity && people.length > 0) {
				v.passengers.push(people[0]);
				console.log("Placing passenger " + people[0]);
				people.splice(0, 1);
			}
		}

		res.json(vehicles);
	});
}

exports.createBikeCarpools = function(req, res) {

	var eventId = req.body.eventId;
	rsvpRef.child(eventId).once('value', function(snapshot) {
		var rsvps = snapshot.val();
		var availableCars = [];
		var people = [];
		var bikes = [];

		for (var key in rsvps) {
			if (rsvps.hasOwnProperty(key)) {
			    var r = rsvps[key];
			    // add all the people going
			    if (r.going) {

			    	// push person to people list
					people.push(r.memberId);
					console.log("added " + r.memberId);

					// if the person has a car, push it to the car list
					if (r.hasCar) {
						var car = {
							driver: r.memberId,
							passengerCapacity: r.passengerCapacity,
							bikeCapacity: r.bikeCapacity,
							passengers: [],
							bikes: [],
							carpoolValue: 0
						};
						availableCars.push(car);
						console.log("Car recorded");
						console.log(car);
					}

					// if the person has a bike, push them to the bike list
					if (r.hasBike) {
						bikes.push(r.memberId);
					}
			    }
			}
		}

		// calculate carpool values for availableCars
		for (var i = availableCars.length - 1; i >= 0; i--) {
			var c = availableCars[i];

			var bikeCapacityRatio = c.bikeCapacity / bikes.length;
			var passengerCapacityRatio = c.passengerCapacity / people.length;
			var bikePeopleRatio = c.bikeCapacity / c.passengerCapacity;

			// c.carpoolValue = (c.bikeCapacity / c.passengerCapacity) * (c.bikeCapacity + c.passengerCapacity);
			// c.carpoolValue = ((c.bikeCapacity + c.passengerCapacity) / ((bikes.length - c.bikeCapacity) + (people.length - c.passengerCapacity)));

			c.carpoolValue = (bikeCapacityRatio * passengerCapacityRatio) * (c.bikeCapacity + c.passengerCapacity);

			console.log("Carpool Value: " + c.driver + " b: " + c.bikeCapacity + " p: " + c.passengerCapacity + "  " + c.carpoolValue);
		}

		// sort availableCars in descending order based on carpool values
		availableCars.sort(function(a, b) {
			return parseFloat(b.carpoolValue - a.carpoolValue);
		});

		// now the cars are sorted correctly, we must select which cars will be used
		var vehicles = [];

		var tempPasCount = 0, tempBikeCount = 0;
		var passengerCount = people.length, bikeCount = bikes.length;
		console.log("\nPassengers: " + passengerCount + "   Bikes: " + bikeCount);

		for (var i = 0; tempPasCount < passengerCount || tempBikeCount < bikeCount; i++) {
			var c = availableCars[i];
			vehicles.push(c);
			tempPasCount += c.passengerCapacity;
			tempBikeCount += c.bikeCapacity;

			console.log("Using Car: " + c.driver);
			console.log("Current Passanger Capacity: " + tempPasCount);
			console.log("Current Bike Capacity: " + tempBikeCount);
		}

		// now that we have the vehicles that are actually being used, we can fill those vehicles
		// AT THIS POINT - which cars are going is the most important thing
		// but how to fill the cars is also quite useful

		console.log("\nPlacing drivers in their cars");

		for (var i = 0; i < vehicles.length; i++) {
			var v = vehicles[i];

			console.log("Placing driver " + v.driver);
			console.log("Checking if " + v.driver + " has a bike");
			// first push the driver to the vehicle
			v.passengers.push(v.driver);
			var driverPeopleIndex = people.indexOf(v.driver);
			var driverBikeIndex = bikes.indexOf(v.driver);

			people.splice(driverPeopleIndex, 1);
			if (driverBikeIndex > -1) {
				console.log(v.driver + " does have a bike");
				v.bikes.push(v.driver);
				bikes.splice(driverBikeIndex, 1);
				// bikes.pop(v.driver);
			}
			// people.pop(v.driver);
		}

		console.log("\nPlacing people in vehicles, with their bikes");

		for (var i = 0; i < vehicles.length; i++) {
			var v = vehicles[i];

			console.log("\nPlacing remaining people in " + v.driver);
			var skipCount = 0;
			while( v.passengers.length < v.passengerCapacity && v.bikes.length < v.bikeCapacity && people.length > 0 && bikes.length > 0) {
				// check if this person has a bike
				console.log("Checking if " + people[skipCount] + " has a bike");

				var bikeIndex = bikes.indexOf(people[skipCount]);

				if (bikeIndex > -1) {
					console.log(people[skipCount] + " does have a bike");
					v.passengers.push(people[skipCount]);
					v.bikes.push(people[skipCount]);

					bikes.splice(bikeIndex, 1);
					people.splice(skipCount, 1);
				} else {
					skipCount++;
				}
			}
		}

		console.log("Placing people in vehicles, w/o their bikes\n");

		// at this point, everyone who can be placed in a vehicle WITH their bike, has been
		// we will now place the remaining people and bikes separaretly in the cars
		for (var i = 0; i < vehicles.length; i++) {
			// every vehicle should only have open passenger spots OR open bike spots
			var v = vehicles[i];
			// fill bike spots
			while(v.bikes.length < v.bikeCapacity && bikes.length > 0) {
				v.bikes.push(bikes[0]);
				bikes.splice(0, 1);
			}
			// fill passenger spots
			while(v.passengers.length < v.passengerCapacity && people.length > 0) {
				v.passengers.push(people[0]);
				people.splice(0, 1);
			}
		}

		/* THE ALGORITHM IS COMPLETE AND I WILL TAKE OVER THE WORLD */
		console.log(vehicles);

		res.json(vehicles);
	});
}