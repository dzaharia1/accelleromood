var siteBody, hexFigure, mode;

var readyFunction = function() {
	mode = 'hsl';
	siteBody = document.querySelector('body');
	hexFigure = document.querySelector('.hex-figure');
	var screenWidth = window.innerWidth;
	var screenHeight = window.innerHeight;

	window.addEventListener('resize', function(event) {
		screenWidth = window.innerWidth;
		screenHeight = window.innerHeight;
	});

	window.addEventListener('click', function(event) {
		if (mode === 'hsl') { mode = 'rgb'; }
		else { mode = 'hsl'; }
	});

	window.addEventListener('deviceorientation', function(event) {
		var colorString = mode + '(';
		var i, j, k;
		if (mode === 'hsl') {
			i = ((event.alpha / 360) * 360).toFixed(0);
			j = (((event.beta + 180) / 360) * 100).toFixed(0);
			k = (((event.gamma + 90) / 180) * 100).toFixed(0); // nothing very intetional here
			if (k > 100) { k = 100; }
			j = j + '%';
			k = k + '%';
		}
		else if (mode === 'rgb') {
			i = (event.alpha).toFixed(0);
			j = (((event.beta + 180) / 360) * 256).toFixed(0);
			k = (((event.gamma + 90) / 180) * 256).toFixed(0);
		}

		colorString = colorString + i + ', ' + k + ', ' + j + ')';
		console.log(colorString);

		siteBody.style.backgroundColor = colorString;
		hexFigure.style.color = 'hsl(0, 0%, ' + (100 - ((event.y / screenHeight) * 100)) + '%)';
		hexFigure.innerText = colorString;

	});
}

if (document.readyState != 'loading') {
	readyFunction();
}
else {
	document.addEventListener('DOMContentLoaded', readyFunction)
}
