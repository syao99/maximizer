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
		size: 20
	}
};
app.in = {
	mouse: {
		pos: {x:0,y:0},
		b0: false,
		b1: false
	}
};

app.fn = {};
app.ufn = {};
app.fn.clamp = (val,min,max) => {
	return Math.min(Math.max(val, min), max);
}
app.fn.clampAround = (val,min,max) => {
	//return Math.min(Math.max(val, min), max)
	if (val < min) {
		return max - (min - val) % (max - min);
	}
	else if (val > max) {
		return min + (val - min) % (max - min);
	}
	return val;
}
app.fn.getConstrainedCoords = (location,min,max) => {
	return {
		x: app.fn.clampAround(location.x,min.x,max.x),
		y: app.fn.clampAround(location.y,min.y,max.y)
	}
}

app.ufn.resize = () => {
	app.win.x = window.innerWidth * 1;
	app.win.y = window.innerHeight * 1;
	app.state.canvas.width = app.win.x;
	app.state.canvas.height = app.win.y;
}

app.ufn.clearCanvas = () => {
	app.state.cx.clearRect(0, 0, app.win.x, app.win.y);
}

app.in.mouse.mousedown = () => {
	// set min bound to mouse y.
	app.sObjs.bounds.min.y = app.in.mouse.pos.y;
	console.log(app.sObjs.bounds.min.y);
	//app.sObjs.dot1.location = app.in.mouse.pos;
}

app.in.mouse.mouseup = () => {

}

app.in.mouse.mousemove = (mouseEvent) => {
	//console.log(mouseEvent);
	app.in.mouse.pos.x = mouseEvent.x;
	app.in.mouse.pos.y = mouseEvent.y;
	//app.sObjs.dot1.location = app.in.mouse.pos;
	//console.log("mouse location: " + app.sObjs.dot1.location);
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

	// constrain dot location:
	app.sObjs.dot1.location = app.fn.getConstrainedCoords(
		app.sObjs.dot1.location,
		app.sObjs.bounds.min,
		app.sObjs.bounds.max);
	console.log('location: ' + app.sObjs.dot1.location.x);
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

document.addEventListener('DOMContentLoaded', app.fn.setup);
document.addEventListener('mousedown', app.in.mouse.mousedown);
document.addEventListener('mouseup', app.in.mouse.mouseup);
document.addEventListener('mousemove', app.in.mouse.mousemove);