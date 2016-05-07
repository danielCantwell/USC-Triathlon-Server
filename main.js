var express = require('express');
var WebSocketServer = require('ws').Server;
var http = require('http');
var api = require('./api.js');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
	res.type('text/plain');
	res.send('usc triathlon server');
});

function resParamError(res, error) {
	res.status = 400;
	res.json(error);
}

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
		resParamError(res, { error: 'type must be practice, race, or other' });
	} else {
		api.loadEvents(req, res);
	}
});

// COMPLETE
app.post('/api/createEvent', function(req, res) {
	console.log("Events / Create Event");
	if (req.body.date == null || req.body.details == null || req.body.type == null || req.body.reqRsvp == null
		|| req.body.carpooling == null || req.body.cycling == null || req.body.meetingLocation == null) {
		console.log("Create Event : Invalid Parameters");
		resParamError(res, { error: 'parameters missing' });
	} else {
		api.createEvent(req, res);
	}
});

// COMPLETE
app.post('/api/removeEvent', function(req, res) {
	console.log("Events / Remove Event");
	if (req.body.type == null || req.body.id == null) {
		resParamError(res, { error: 'event type or id parameters missing' });
	} else {
		api.removeEvent(req, res);
	}
});

// COMPLETE
app.post('/api/rsvp', function(req, res) {
	console.log("Events / RSVP");
	if (req.body.eventId == null || req.body.uid == null || req.body.method == null) {
		resParamError(res, { error: 'parameters missing' });
	} else {
		api.rsvp(req, res);
	}
});

// COMPLETE
app.post('/api/loadRSVPs', function(req, res) {
	console.log("Events / Load RSVPs");
	if (req.body.eventId == null) {
		resParamError(res, { error: 'eventId parameter missing' });
	} else {
		api.loadRSVPs(req, res);
	}
});

// COMPLETE
app.post('/api/createCarpools/:type', function(req, res) {
	console.log("Events / Create Carpools");
	var type = req.params.type;
	if (req.body.eventId == null) {
		resParamError(res, { error: 'eventId parameter missing' });
	} else if (type == 'person') {
		console.log("Events / Create Person Carpools");
		api.createPersonCarpools(req, res);
	} else if (type == 'bike') {
		console.log("Events / Create Bike Carpools")
		api.createBikeCarpools(req, res);
	} else {
		resParamError(res, { error: 'eventId parameter must be person or bike' });
	}
});

/*
	News and Chat
*/

// COMPLETE
app.post('/api/addNews', function(req, res) {
	console.log("Add News");
	if (req.body.author == null || req.body.subject == null || req.body.message == null) {
		console.log("Add News : Invalid parameters");
		resParamError(res, { error: 'parameters missing' });
	} else {
		api.addNews(req, res);
	}
});

// COMPLETE
app.post('/api/addChat', function(req, res) {
	console.log("Add Chat");
	if (req.body.author == null || req.body.message == null) {
		console.log("Add Chat : Invalid parameters");
		resParamError(res, { error: 'parameters missing' });
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
		console.log("Sign Up : Invalid Parameters");
		resParamError(res, { error: 'parameters must contain email and password, firstName, lastName and officer status' });
	} else {
		api.createUser(req, res);
	}
});

// COMPLETE
app.post('/api/login', function(req, res) {
	console.log("Login");
	if (req.body.email == null || req.body.password == null) {
		console.log("Login : Invalid Parameters");
		resParamError(res, { error: 'parameters must contain email and password' });
	} else {
		api.loginUser(req, res);
	}
});

/* USER PROFILE */

// COMPLETE
app.post('/api/promoteToOfficer', function(req, res) {
	console.log("Promote User to Officer");
	if (req.body.uid == null || req.body.ocode == null) {
		console.log("Promote to Officer : Invalid Parameters");
		resParamError(res, { error: 'parameters must contain user id and officer code' });
	} else {
		api.promoteToOfficer(req, res);
	}
});

// COMPLETE
app.post('/api/updateCarProfile', function(req, res) {
	console.log("Update Car Profile");
	if (req.body.uid == null || req.body.hasCar == null ||
		req.body.pCap == null || req.body.bCap == null || req.body.needRack == null) {
		console.log("Update Car Profile : Invalid Parameters");
		resParamError(res, { error: 'parameters must contain uid, hasCar, pCap, bCap, and needRack' });
	} else {
		api.updateCarProfile(req, res);
	}
});

// COMPLETE
app.post('/api/updateMemberInfo', function(req, res) {
	console.log("Update Member Info");
	if (req.body.uid == null || req.body.email == null || req.body.firstName == null || req.body.lastName == null ||
		req.body.year == null || req.body.hasBike == null) {
		console.log("Update Member Info : Invalid Parameters");
		resParamError(res, { error: 'parameters must contain email, firstName, lastName, year, and hasBike' });
	} else {
		api.updateMemberInfo(req, res);
	}
});

// COMPLETE
app.post('/api/getCarProfile', function(req, res) {
	console.log("Get Car Profile");
	if (req.body.uid == null) {
		console.log("Get Car Profile : Invalid Parameters");
		resParamError(res, { error: 'uid parameter missing' });
	} else {
		api.getCarProfile(req, res);
	}
});

/* Start Server */

app.listen(port);
console.log("app running on port 5000");