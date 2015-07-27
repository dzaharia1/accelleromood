var siteBody, hexFigure, indicator, uniqueId;
var socket = io.connect(window.location.href);

function generateId() {
	var currentTime = new Date();
	return (currentTime.getMilliseconds() / Math.random()).toFixed(0);
}

var readyFunction = function() {
	siteBody = document.querySelector('body');
	hexFigure = document.querySelector('.hex-figure');
	indicator = document.querySelector('.tap-affordance');
	uniqueId = generateId();

	socket.emit('change mayor', { clientId: uniqueId });

	indicator.addEventListener('click', function() {
		socket.emit('change mayor', { clientId: uniqueId });
	});

	window.addEventListener('click', function(event) {
		socket.emit('change mode', { clientId: uniqueId });
	});

	window.addEventListener('deviceorientation', function(event) {
		socket.emit('change color', {
			alpha: event.alpha,
			beta: event.beta,
			gamma: event.gamma,
			clientId: uniqueId
		});
	});
}

socket.on('change color', function(colorString) {
	console.log(colorString);
	siteBody.style.backgroundColor = colorString;
	hexFigure.innerText = colorString;
});

socket.on('change mayor', function(mayorId) {
	if (mayorId === uniqueId) {
		indicator.innerText = 'You\'re controlling the color!';
	}
	else {
		indicator.innerText = mayorId + ' is controlling the color';
	}
});

if (document.readyState != 'loading') {
	readyFunction();
}
else {
	document.addEventListener('DOMContentLoaded', readyFunction)
}
