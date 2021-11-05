let app = {};
app.state = {
	dt: 0,
	lastTimestamp: 0,
	targetDT: 0,
	canvas: {},
	cx: {}
};
app.win = {};
app.params = {};
app.sObjs = {
	bounds: {
		min: {x:0,y:0},
		max :{x:0,y:0},
		pad: 30,
		initBounds: () => {
			app.sObjs.bounds.min.x = app.sObjs.bounds.pad;
			app.sObjs.bounds.min.y = app.sObjs.bounds.pad;
			app.sObjs.bounds.max.x = app.win.x - app.sObjs.bounds.pad;
			app.sObjs.bounds.max.y = app.win.y - app.sObjs.bounds.pad;
		},
		updateBoundsUser: (mouseY) => {
			app.sObjs.bounds.min.y = mouseY;
		},
		updateBounds: () => {
			app.sObjs.bounds.max.x = app.win.x - app.sObjs.bounds.pad;
			app.sObjs.bounds.max.y = app.win.y - app.sObjs.bounds.pad;
		}
	},
	dot1: {
		location: {
			x: 0,
			y: 0
		},
		size: 8,
		speed: 0,
		color: '#FFF',
		dir: {x:0,y:0},
		getVelocity: () => {return {
			x: app.sObjs.dot1.dir.x * app.sObjs.dot1.speed,
			y: app.sObjs.dot1.dir.y * app.sObjs.dot1.speed
		}; },
		updateLocation: () => {
			let nv = app.sObjs.dot1.getVelocity();
			app.sObjs.dot1.location.x += nv.x;
			app.sObjs.dot1.location.y += nv.y;
		},
		updateDirection: () => {
			app.sObjs.dot1.dir = app.fn.getUnitVectorFromDir(Math.random()*(Math.PI*2));
		},
		updateSpeed: () => {
			app.sObjs.dot1.speed = Math.random()*5;
		}
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
		x: app.fn.clamp(location.x,min.x,max.x),
		y: app.fn.clamp(location.y,min.y,max.y)
	}
}

app.fn.getUnitVectorFromDir = (dir) => {
	return {x: Math.cos(dir),y: Math.sin(dir)};
}

app.ufn.resize = () => {
	console.log('resize');
	let boundsRatio = app.sObjs.bounds.min.y / app.win.y;
	app.win.x = window.innerWidth * 1;
	app.win.y = window.innerHeight * 1;
	app.state.canvas.width = app.win.x;
	app.state.canvas.height = app.win.y;
	app.sObjs.bounds.updateBounds();
	app.sObjs.bounds.updateBoundsUser(boundsRatio * app.win.y);
}

app.ufn.clearCanvas = () => {
	app.state.cx.clearRect(0, 0, app.win.x, app.win.y);
}

app.in.mouse.mousedown = () => {
	// set min bound to mouse y.
	//app.sObjs.bounds.min.y = app.in.mouse.pos.y;
	app.sObjs.bounds.updateBoundsUser(app.in.mouse.pos.y);
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

app.setup = () => {
	app.state.canvas = document.getElementById('app');
	app.state.cx = app.state.canvas.getContext('2d');

	window.onresize = app.ufn.resize;
	app.ufn.resize();

	app.sObjs.bounds.initBounds();
	app.sObjs.dot1.location.y = app.win.y - 100;

	app.mainLoop(0);
	app.dirLoop();
	app.speedLoop();
}

app.update = (deltaTime) => {
	app.sObjs.dot1.updateLocation();

	// constrain dot location:
	app.sObjs.dot1.location = app.fn.getConstrainedCoords(
		app.sObjs.dot1.location,
		app.sObjs.bounds.min,
		app.sObjs.bounds.max);
}

app.draw = () => {
	app.ufn.clearCanvas();
	let dot = new Path2D();
	dot.arc(app.sObjs.dot1.location.x,
	        app.sObjs.dot1.location.y,
	        app.sObjs.dot1.size,
	        0,2*Math.PI,false);

	app.state.cx.fillStyle = app.sObjs.dot1.color;
	app.state.cx.fill(dot);
}

app.mainLoop = (timestamp) => {
	app.state.dt = timestamp - app.state.lastTimestamp;

	app.update(app.state.dt);
	app.draw();

	app.state.targetDT = 33.3333 - app.state.dt;
	//setTimeout(() => {
		window.requestAnimationFrame(app.mainLoop);
	//},app.state.targetDT);
	app.state.lastTimestamp = timestamp;
}

app.dirLoop = () => {
	app.sObjs.dot1.updateDirection();
	setTimeout(() => {
		app.dirLoop();
	},2000);
}

app.speedLoop = () => {
	app.sObjs.dot1.updateSpeed();
	setTimeout(() => {
		app.speedLoop();
	},1000);
}

document.addEventListener('DOMContentLoaded', app.setup);
document.addEventListener('mousedown', app.in.mouse.mousedown);
document.addEventListener('mouseup', app.in.mouse.mouseup);
document.addEventListener('mousemove', app.in.mouse.mousemove);