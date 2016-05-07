var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var router = express.Router();

app.use(express.static(__dirname + '/'));

router.get('/', function(req, res, next) {
    res.render('index.html');
});

app.use('/', router);

app.listen(port);
console.log('App running on port', port);