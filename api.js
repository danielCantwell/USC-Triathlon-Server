var Firebase    = require('firebase');
var rootRef		= new Firebase("https://usctriathlon.firebaseio.com/"),
	memberRef	= rootRef.child('member'),
	eventRef	= rootRef.child('event'),
	rsvpRef		= rootRef.child('rsvp'),
	carpoolRef	= rootRef.child('carpool'),
	chatRef		= rootRef.child('chat'),
	newsRef		= rootRef.child('news');

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

	var newsId = newsRef.push(newsItem, function(error) {
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

exports.addChat = function(req, res) {
	var createdAt = Firebase.ServerValue.TIMESTAMP;
	var author = req.body.author;
	var message = req.body.message;

	var chatItem = {
		createdAt: createdAt,
		author: author,
		message: message
	};

	var messageId = chatRef.push(chatItem, function(error) {
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

}

exports.loadChat = function(req, res) {

}

/*
	Events
*/

exports.createEvent = function(req, res) {
	var name 			= req.body.name,
		date 			= req.body.date,
		details			= req.body.details,
		type 			= req.body.type,
		carpooling		= req.body.carpooling,
		cycling			= req.body.cycling,
		meetingLocation	= req.body.meetingLocation,
		eventLocation	= req.body.eventLocation;

	var e = {
		name: name,
		date: date,
		details: details,
		type: type,
		carpooling: carpooling,
		cycling: cycling,
		meetingLocation: meetingLocation,
		eventLocation: eventLocation
	};

	var eventId = eventRef.push(e, function(error) {
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

exports.rsvp = function(req, res) {
	req.body.eventId == null || req.body.memberId == null || req.body.going == null
		|| req.body.drivingSelf == null || req.body.hasCar == null || req.body.passengerCapacity == null
		|| req.body.bikeCapacity == null || req.body.needsRack == null || req.body.needsBike == null || req.body.comment == null

	var eventId 		= req.body.eventId,
		memberId		= req.body.memberId,
		going 			= req.body.going,
		drivingSelf 	= req.body.drivingSelf,
		hasCar			= req.body.hasCar,
		passengerCapacity = req.body.passengerCapacity,
		bikeCapacity 	= req.body.bikeCapacity,
		needsRack 		= req.body.needsRack,
		needsBike 		= req.body.needsBike,
		comment 		= req.body.comment;

	var rsvp = {
		memberId: memberId,
		going: going,
		drivingSelf: drivingSelf,
		hasCar: hasCar,
		passengerCapacity: passengerCapacity,
		bikeCapacity: bikeCapacity,
		needsRack: needsRack,
		needsBike: needsBike,
		comment: comment
	};

	var rsvpId = rsvpRef.child(eventId).push(rsvp, function(error) {
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


/*
	Authentication
*/

exports.createUser = function(req, res) {
	var userEmail = req.body.email;
	var userPassword = req.body.password;
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;

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
	            officer : false
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
	var userEmail = req.params.email;
	var userPassword = req.params.password;

	rootRef.authWithPassword({
		email: userEmail,
		password: userPassword
	}, function(error, authData) {
		var result = {};
		if (error) {
			console.log("error");
			result.status =  'failure';
			result.error =  error;
			res.json(result);
		} else {
			console.log("success");
			result.status =  'success';
			result.authData = authData;
			res.json(result);
		}
	});
}

exports.promoteUserToOfficer = function(req, res) {

}

var r1 = {
	personname: "r1",
	hasBike: true,
	hasCar: false,
	passengerCapacity: 0,
	bikeCapacity: 0
}

var r2 = {
	personname: "r2",
	hasBike: false,
	hasCar: false,
	passengerCapacity: 0,
	bikeCapacity: 0
}

var r3 = {
	personname: "r3",
	hasBike: true,
	hasCar: true,
	passengerCapacity: 5,
	bikeCapacity: 4
}

var r4 = {
	personname: "r4",
	hasBike: false,
	hasCar: true,
	passengerCapacity: 2,
	bikeCapacity: 3
}

var r5 = {
	personname: "r5",
	hasBike: true,
	hasCar: true,
	passengerCapacity: 5,
	bikeCapacity: 3
}

var r6 = {
	personname: "r6",
	hasBike: true,
	hasCar: false,
	passengerCapacity: 4,
	bikeCapacity: 2
}

var r7 = {
	personname: "r7",
	hasBike: true,
	hasCar: true,
	passengerCapacity: 4,
	bikeCapacity: 4
}

var r8 = {
	personname: "r8",
	hasBike: false,
	hasCar: true,
	passengerCapacity: 4,
	bikeCapacity: 5
}

var r9 = {
	personname: "r9",
	hasBike: true,
	hasCar: true,
	passengerCapacity: 4,
	bikeCapacity: 3
}

var r10 = {
	personname: "r10",
	hasBike: true,
	hasCar: false,
	passengerCapacity: 2,
	bikeCapacity: 2
}

var r11 = {
	personname: "r11",
	hasBike: true,
	hasCar: true,
	passengerCapacity: 1,
	bikeCapacity: 6
}

var r12 = {
	personname: "r12",
	hasBike: true,
	hasCar: false,
	passengerCapacity: 0,
	bikeCapacity: 0
}

var r13 = {
	personname: "r13",
	hasBike: true,
	hasCar: false,
	passengerCapacity: 0,
	bikeCapacity: 0
}

var r14 = {
	personname: "r14",
	hasBike: true,
	hasCar: false,
	passengerCapacity: 0,
	bikeCapacity: 0
}

var r15 = {
	personname: "r15",
	hasBike: true,
	hasCar: false,
	passengerCapacity: 0,
	bikeCapacity: 0
}

var rsvps = [
	r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15
];

exports.createCarpools = function() {
	var availableCars = [];
	var people = []; // strings - names of the people
	var bikes = []; // strings - names of the people who own the bike

	// initialize variables
	for (var i = rsvps.length - 1; i >= 0; i--) {
		var rsvp = rsvps[i];

		// push person to people list
		people.push(rsvp.personname);
		console.log(rsvp.personname);

		// if the person has a car, push it to the car list
		if (rsvps[i].hasCar) {
			var car = {
				driver: rsvp.personname,
				passengerCapacity: rsvp.passengerCapacity,
				bikeCapacity: rsvp.bikeCapacity,
				passengers: [],
				bikes: [],
				carpoolValue: 0
			};
			availableCars.push(car);
			console.log("Car recorded");
			console.log(car);
		}

		// if the person has a bike, push them to the bike list
		if (rsvp.hasBike) {
			bikes.push(rsvp.personname);
		}
	};

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
	};

	// sort availableCars in descending order based on carpool values
	availableCars.sort(function(a, b) {
		return parseFloat(b.carpoolValue - a.carpoolValue);
	});

	// with no carpool value - this is no longer necessary
	// among availableCars with equal bike capacity, sort in by passenger capacity in descending order

	// var sortedAvailableCars = [];
	// var tempCars = [];
	// var prevBikeCapacity = availableCars[0].bikeCapacity;
	// var currentBikeCapacity = availableCars[0].bikeCapacity;
	// tempCars.push(availableCars[0]);

	// for (var i = 1; i < availableCars.length; i++) {
	// 	currentBikeCapacity = availableCars[i].bikeCapacity;
	// 	// if the current car has the same capacity as the previous car, group it
	// 	if (currentBikeCapacity == prevBikeCapacity) {
	// 		tempCars.push(availableCars[i]);
	// 	} else {
	// 		// if the current car has a different capacity, sort the previous cars
	// 		prevBikeCapacity = currentBikeCapacity;
	// 		tempCars.sort(function(a, b) {
	// 			return parseFloat(b.passengerCapacity - a.passengerCapacity);
	// 		});
	// 		// and push the previous grouping to the list
	// 		for (var j = 0; j < tempCars.length; j++) {
	// 			sortedAvailableCars.push(tempCars[j]);
	// 		}
	// 		// start a new grouping
	// 		tempCars = [];
	// 		tempCars.push(availableCars[i]);
	// 	}
	// };

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
	// document.getElementById("json").innerHTML = JSON.stringify(vehicles, null, 2);
	// document.getElementById("json").innerHTML = JSON.stringify(people, null, 2);

	return vehicles;
}

// createCarpools(rsvps);