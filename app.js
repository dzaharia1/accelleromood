var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var handlebars = require('express-handlebars');

var localport = '3333';
var localhost = 'http://localhost';

var currMayor = 0;
var mode = 'rgb';

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('hbs', handlebars({ extname: 'hbs', defaultLayout: 'layout.hbs' }));
app.set('view engine', 'hbs');

io.set('polling duration', .5);
io.on('connection', function(socket) {
	console.log('received connection');

	socket.on('change mayor', function(data) {
		currMayor = data.clientId;
		console.log('The new mayor is ' + currMayor);
	});

	socket.on('change mode', function(data) {
		if (data.clientId === currMayor) {
			if (mode === 'rgb') {
				mode = 'hsl';
			}
			else {
				mode = 'rgb';
			}
		}
	});

	socket.on('change color', function(data) {
		if (data.clientId === currMayor) {
			var colorString = mode + '(';
			var i, j, k;
			if (mode === 'hsl') {
				i = data.alpha.toFixed(0);
				j = (((data.beta + 180) / 360) * 100).toFixed(0);
				k = (((data.gamma + 90) / 180) * 100).toFixed(0); // nothing very intetional here
				if (k > 100) { k = 100; }
				j = j + '%';
				k = k + '%';
			}
			else if (mode === 'rgb') {
				i = ((data.alpha / 360) * 256).toFixed(0);
				j = (((data.beta + 180) / 360) * 256).toFixed(0);
				k = (((data.gamma + 90) / 180) * 256).toFixed(0);
			}

			colorString = colorString + i + ', ' + k + ', ' + j + ')';
			// console.log(data.clientId);
			socket.emit('change color', colorString);
			socket.broadcast.emit('change color', colorString);
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
