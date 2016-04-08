var express = require('express');
var api = require('./api.js');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
	res.type('text/plain');
	res.send('usc triathlon server');
});

var errorStatus = 'error';
var successStatus = 'success';

// TODO for everything, even "complete" functions - in addition to paremeter checking, to type checking on paremeters

/*
	Events
*/


// COMPLETE
app.get('/api/loadEvents/:etype', function(req, res) {
	console.log("Events / Load Events");
	console.log(req.params.etype);
	if (!(req.params.etype == 'practice' || req.params.etype == 'race' || req.params.etype == 'other')) {
		console.log("Load Events : Invalid Parameters")
		var response = { status: errorStatus, error: 'type must be practice, race, or other' };
		res.json(response);
	} else {
		api.loadEvents(req, res);
	}
});

// COMPLETE
app.post('/api/createEvent', function(req, res) {
	console.log("Events / Create Event");
	if (req.body.date == null || req.body.details == null || req.body.type == null || req.body.reqRsvp == null
		|| req.body.carpooling == null || req.body.cycling == null || req.body.meetingLocation == null) {
		var response = { status: errorStatus, error: 'parameters missing' };
		res.json(response);
	} else {
		api.createEvent(req, res);
	}
});

// COMPLETE
app.post('/api/removeEvent', function(req, res) {
	console.log("Events / Remove Event");
	if (req.body.type == null || req.body.id == null) {
		var response = { status: errorStatus, error: 'event type or id parameters missing' };
		res.json(response);
	} else {
		api.removeEvent(req, res);
	}
});

// COMPLETE
app.post('/api/rsvp', function(req, res) {
	console.log("Events / RSVP");
	if (req.body.eventId == null || req.body.memberId == null || req.body.going == null
		|| req.body.drivingSelf == null || req.body.hasCar == null || req.body.hasBike == null || req.body.passengerCapacity == null
		|| req.body.bikeCapacity == null || req.body.needsRack == null || req.body.needsBike == null || req.body.comment == null) {
		var response = { status: errorStatus, error: 'parameters missing' };
		res.json(response);
	} else {
		api.rsvp(req, res);
	}
});

// COMPLETE
app.post('/api/createCarpools/:type', function(req, res) {
	console.log("Events / Create Carpools");
	var type = req.params.type;
	if (req.body.eventId == null) {
		var response = { status: errorStatus, error: 'eventId required' };
		res.json(response);
	} else if (type == 'person') {
		console.log("Events / Create Person Carpools");
		api.createPersonCarpools(req, res);
	} else if (type == 'bike') {
		console.log("Events / Create Bike Carpools")
		api.createBikeCarpools(req, res);
	} else {
		var response = { status: errorStatus, error: 'carpool type must be either person or bike' };
		res.json(response);
	}
});

/*
	News and Chat
*/

// COMPLETE
app.post('/api/addNews', function(req, res) {
	console.log("Add News");
	if (req.body.author == null || req.body.subject == null || req.body.message == null) {
		var response = { status: errorStatus, error: 'parameters missing' };
		console.log("Invalid parameters");
		res.json(response);
	} else {
		console.log("Valid parameters");
		api.addNews(req, res);
	}
});

// COMPLETE
app.post('/api/addChat', function(req, res) {
	console.log("Add Chat");
	if (req.body.author == null || req.body.message == null) {
		var response = { status: errorStatus, error: 'parameters missing' };
		res.json(response);
	} else {
		api.addChat(req, res);
	}
});

// COMPLETE
app.get('/api/loadNews', function(req, res) {
	console.log("Load News");
	api.loadNews(req, res);
});

// COMPLETE
app.get('/api/loadChat', function(req, res) {
	console.log("Load Chat");
	api.loadChat(req, res);
});


/*
	Authentication
*/


// COMPLETE
app.post('/api/signup', function(req, res) {
	console.log("Sign Up");
	if (req.body.email == null || req.body.password == null || req.body.firstName == null || req.body.lastName == null || req.body.officer == null) {
		var response = { status: errorStatus, error: 'parameters must contain email and password, firstName, lastName and officer status' };
		res.json(response);
	} else {
		api.createUser(req, res);
	}
});

// COMPLETE
app.post('/api/login', function(req, res) {
	console.log("Login");
	if (req.body.email == null || req.body.password == null) {
		var response = { status: errorStatus, error: 'parameters must contain email and password' };
		res.json(response);
	} else {
		api.loginUser(req, res);
	}
});

/* USER PROFILE */

// COMPLETE
app.post('/api/promoteToOfficer', function(req, res) {
	console.log("Promote User to Officer");
	if (req.body.uid == null || req.body.ocode == null) {
		var response = { status: errorStatus, error: 'parameters must contain user id and officer code' };
		res.json(response);
	} else {
		api.promoteToOfficer(req, res);
	}
});

// TODO
app.post('/api/updateCarProfile', function(req, res) {
	console.log("Update Car Profile");
	if (req.body.uid == null || req.body.profile == null ||
		req.body.profile.hasCar == null || req.body.profile.pCap == null || req.body.profile.bCap == null) {
		var response = { status: errorStatus, error: 'profile json object must contain hasCar, pCap, bCap' };
		res.json(response);
	} else {
		api.updateCar(req, res);
	}
});

// TODO
app.post('/api/updateBikeProfile', function(req, res) {
	console.log("Update Bike Profile");
	if (req.body.uid == null || req.body.profile == null) {
		var response = { status: errorStatus, error: 'profile json object missing' };
		res.json(response);
	} else {
		api.updateCar(req, res);
	}
});

/* Start Server */

app.listen(process.env.PORT || 5000);
console.log("app running on port 5000");