var siteBody, hexFigure, screenHeight, screenWidth, uniqueId;
var socket = io.connect(window.location.href);

function generateId() {
	var currentTime = new Date();
	return (currentTime.getMilliseconds() / Math.random()).toFixed(0);
}

var readyFunction = function() {
	siteBody = document.querySelector('body');
	hexFigure = document.querySelector('.hex-figure');
	uniqueId = generateId();

	socket.emit('change mayor', { clientId: uniqueId });
	document.querySelector('.tap-affordance').innerText = uniqueId;

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

if (document.readyState != 'loading') {
	readyFunction();
}
else {
	document.addEventListener('DOMContentLoaded', readyFunction)
}
