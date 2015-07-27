var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var handlebars = require('express-handlebars');

var localport = '3333';
var localhost = 'http://localhost';

var currMayor = 0;

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('hbs', handlebars({ extname: 'hbs', defaultLayout: 'layout.hbs' }));
app.set('view engine', 'hbs');

io.on('connection', function(socket) {
	console.log('received connection');

	socket.on('change mayor', function(data) {
		currMayor = data.clientId;
		console.log('The new mayor is ' + currMayor);
	});

	socket.on('change mode', function(data) {
		if (data.clientId = currMayor) {
			socket.emit('change mode', data);
			console.log('Mode changed to ' + data.mode + ' by ' + data.clientId);
		}
	});

	socket.on('change color', function(data) {
		if (data.clientId = currMayor) {
			socket.emit('change color', data);
			console.log('color changed by ' + data.clientId);
		}
	});
});

app.host = app.set('host', process.env.HOST || localhost);
app.port = app.set('port', process.env.PORT || localport);



app.get('/', function(req, res) {
	res.render('index');
});

server.listen(app.get('port'), function() {
  app.address = app.get('host') + ':' + server.address().port;
  console.log('Listening at ' + app.address);
});
