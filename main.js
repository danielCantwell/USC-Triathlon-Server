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

/*
	Events
*/


// TODO
app.get('/api/loadEvents', function(req, res) {
	console.log("Events / Load Events");
	res.type('text/plain');
	res.send('events / load events');
});

// COMPLETE
app.post('/api/createEvent', function(req, res) {
	console.log("Events / Create Event")
	if (req.body.name == null || req.body.date == null || req.body.details == null
		|| req.body.type == null || req.body.carpooling == null || req.body.cycling == null
		|| req.body.meetingLocation == null || req.body.eventLocation == null) {
		var response = { status: errorStatus, error: 'parameters missing' };
		res.json(response);
	} else {
		api.createEvent(req, res);
	}
});

// COMPLETE
app.post('/api/rsvp', function(req, res) {
	console.log("Events / RSVP");
	if (req.body.eventId == null || req.body.memberId == null || req.body.going == null
		|| req.body.drivingSelf == null || req.body.hasCar == null || req.body.passengerCapacity == null
		|| req.body.bikeCapacity == null || req.body.needsRack == null || req.body.needsBike == null || req.body.comment == null) {
		var response = { status: errorStatus, error: 'parameters missing' };
		res.json(response);
	} else {
		api.rsvp(req, res);
	}
});

// COMPLETE
app.get('/api/createCarpools', function(req, res) {
	console.log("Events / Create Carpools")
	var carpools = api.createCarpools();
	res.json(carpools);
	// if (carpools != null) {
	// 	res.json('status: success');
	// } else {
	// 	res.json('status: failure')
	// }
});

/*
	News and Chat
*/

// COMPLETE
app.post('/api/addNews', function(req, res) {
	console.log("Chat / Add News");
	if (req.body.author == null || req.body.subject == null || req.body.message == null) {
		var response = { status: errorStatus, error: 'parameters missing' };
		res.json(response);
	} else {
		api.addNews(req, res);
	}
});

// COMPLETE
app.post('/api/addChat', function(req, res) {
	console.log("Chat / Add News");
	if (req.body.author == null || req.body.message == null) {
		var response = { status: errorStatus, error: 'parameters missing' };
		res.json(response);
	} else {
		api.addChat(req, res);
	}
});

// TODO
app.get('/api/loadNews', function(req, res) {
	console.log("Chat / Load News");
	res.type('text/plain');
	res.send('chat / load news');
});

// TODO
app.get('/api/loadChat', function(req, res) {
	console.log("Chat / Load Chat");
	res.type('text/plain');
	res.send('chat / load chat');
});


/*
	Authentication
*/


// COMPLETE
app.post('/api/createUser', function(req, res) {
	console.log("Create User");
	if (req.body.email == null || req.body.password == null || req.body.firstName == null || req.body.lastName == null) {
		var response = { status: errorStatus, error: 'parameters must contain email and password, firstName and lastName' };
		res.json(response);
	}
	api.createUser(req, res);
});

// TODO
app.post('/api/promoteUserToOfficer', function(req, res) {
	console.log("Promote User to Officer")
	if (req.body.uid == null || req.body.ocode == null) {
		var response = { status: errorStatus, error: 'parameters must contain user id and officer code' };
		res.json(response);
	} else {
		api.promoteUserToOfficer(req, res);
	}
});

// COMPLETE
app.get('/api/login/:email/:password', function(req, res) {
	console.log("Login")
	api.loginUser(req, res);
});

app.listen(process.env.PORT || 5000);
console.log("app running on port 5000");