let app = {};
app.state = {}
app.state.dt = 0;
app.state.lastTimestamp = 0;
app.state.targetDT = 0;
app.state.canvas;
app.state.cx;
app.win = {};
app.params = {};
app.sObjs = {
	bounds: {
		setBounds: () => {
			app.sObjs.bounds.min = {};
			app.sObjs.bounds.max = {};
			app.sObjs.bounds.min.x = 0,
			app.sObjs.bounds.min.y = 0,
			app.sObjs.bounds.max.x = app.win.x,
			app.sObjs.bounds.max.y = app.win.y
		},
		updateBounds: (mouseY) => {
			app.sObjs.bounds.minY = mouseY;
		}
	},
	dot1: {
		location: {
			x: 0,
			y: 0
		},
		size: 10
	}
};

app.fn = {};
app.ufn = {};
app.fn.getConstrainedCoord = (coord,min,max) => {
	if (coord < min) {
		return max + coord;
	}
	else if (coord > max) {
		return coord - max;
	}
	return coord;
}
app.fn.getConstrainedCoords = (location,min,max) => {
	return {
		x: app.fn.getConstrainedCoord(location.x,min.x,max.x),
		y: app.fn.getConstrainedCoord(location.y,min.y,max.y)
	}
}

app.ufn.resize = () => {
	app.win.x = window.innerWidth * 2;
	app.win.y = window.innerHeight * 2;
	app.state.canvas.width = app.win.x;
	app.state.canvas.height = app.win.y;
}

app.ufn.clearCanvas = () => {
	app.state.cx.clearRect(0, 0, app.win.x, app.win.y);
}

app.fn.setup = () => {
	app.state.canvas = document.getElementById('app');
	app.state.cx = app.state.canvas.getContext('2d');

	window.onresize = app.ufn.resize;
	app.ufn.resize();

	app.sObjs.bounds.setBounds();
	app.sObjs.dot1.location.y = app.win.y - 100;

	app.loop(0);
}

app.update = (deltaTime) => {
	app.sObjs.dot1.location.x += 10;
	app.sObjs.dot1.location.y += 5;

	// constrain dot location.
	app.sObjs.dot1.location = app.fn.getConstrainedCoords(app.sObjs.dot1.location,app.sObjs.bounds.min,app.sObjs.bounds.max);
}

app.draw = () => {
	app.ufn.clearCanvas();
	let dot = new Path2D();
	dot.arc(app.sObjs.dot1.location.x,
	        app.sObjs.dot1.location.y,
	        app.sObjs.dot1.size,
	        0,2*Math.PI,false);

	app.state.cx.fillStyle = '#F00';
	app.state.cx.fill(dot);
}

app.loop = (timestamp) => {
	app.state.dt = timestamp - app.state.lastTimestamp;

	app.update(app.state.dt);
	app.draw();

	app.state.targetDT = 33.3333 - app.state.dt;
	//setTimeout(() => {
		window.requestAnimationFrame(app.loop);
	//},app.state.targetDT);
	app.state.lastTimestamp = timestamp;
}

document.addEventListener("DOMContentLoaded", app.fn.setup);