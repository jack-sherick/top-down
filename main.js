//the start of a top down bullet hell
/* Issues and Errors
	-Firing doesn't work right now, just trying on getting a basic system for shooting
*/
// module aliases
let Engine = Matter.Engine,
	Render = Matter.Render,
	World = Matter.World,
	Bodies = Matter.Bodies,
	Body = Matter.Body,
	Bounds = Matter.Bounds,
	Composites = Matter.Composites,
	Composite = Matter.Composite,
	Vertices = Matter.Vertices,
	Runner = Matter.Runner,
	Constraint = Matter.Constraint,
	Events = Matter.Events,
	Vector = Matter.Vector;

// create an engine
let engine = Engine.create();

// create a renderer
let render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      wireframes: false,
			width: window.innerWidth,
			height: window.innerHeight
    }
});

//keyboard input
const keys = [];
document.onkeydown = event => {
  keys[event.keyCode] = true;
  //console.log(event.keyCode);
};
document.onkeyup = event => {
  keys[event.keyCode] = false;
};

//delete gravity
engine.world.gravity.y = 0;

//player object
let player = Matter.Bodies.rectangle(500, 500, 30, 30);
World.add(engine.world, player)

//bullet vars
let bullet1 = Matter.Bodies.rectangle(player.position.x, player.position.y - 18, 12, 12, {
	frictionAir: 0
});;
let bullet1Bool = false;

let bullet2 = Matter.Bodies.rectangle(player.position.x, player.position.y - 18, 12, 12, {
	frictionAir: 0
});;
let bullet2Bool = false;

let bullet3 = Matter.Bodies.rectangle(player.position.x, player.position.y - 18, 12, 12, {
	frictionAir: 0
});;
let bullet3Bool = false;

let bullet4 = Matter.Bodies.rectangle(player.position.x, player.position.y - 18, 12, 12, {
	frictionAir: 0
});;
let bullet4Bool = false;

let firedInCycle = [];

let bulletCount4 = Matter.Bodies.rectangle(window.innerWidth-50, 50, 6, 12, {
	collisionFilter: {
		group: -1
	}
});
let bulletCount3 = Matter.Bodies.rectangle(bulletCount4.position.x-20, bulletCount4.position.y, 6, 12, {
	collisionFilter: {
		group: -1
	}
});
let bulletCount2 = Matter.Bodies.rectangle(bulletCount3.position.x-20, bulletCount3.position.y, 6, 12, {
	collisionFilter: {
		group: -1
	}
});
let bulletCount1 = Matter.Bodies.rectangle(bulletCount2.position.x-20, bulletCount2.position.y, 6, 12, {
	collisionFilter: {
		group: -1
	}
});


World.add(engine.world, [bulletCount1, bulletCount2, bulletCount3, bulletCount4])

let clock = 0;
let reloadTime = 0;

let reloadTimer = Matter.Bodies.rectangle(window.innerWidth-110, 50, 100, 12, {
	collisionFilter: {
		group: -1
	}
})
let reloadTimer2 = Matter.Bodies.rectangle(window.innerWidth-210, 50, 100, 12, {
	collisionFilter: {
		group: -1
	},
	render: {
		fillStyle: "#18181d"
	}
})

World.add(engine.world, [reloadTimer, reloadTimer2])

setInterval(function () {
	
	player.velocity.x*.7;
	player.velocity.y*.7;
	
	//movement - WASD
	if (keys[87]) {
		Matter.Body.setVelocity(player, {
			x: player.velocity.x,
			y: player.velocity.y-.7
		});
	}
	if (keys[83]) {
		Matter.Body.setVelocity(player, {
			x: player.velocity.x,
			y: player.velocity.y+.7
		});
	}
	if (keys[65]) {
		Matter.Body.setVelocity(player, {
			x: player.velocity.x-.7,
			y: player.velocity.y
		});
	}
	if (keys[68]) {
		Matter.Body.setVelocity(player, {
			x: player.velocity.x+.7,
			y: player.velocity.y
		})
	}
	
	//canvas collision	
	if (player.position.x <= 0) {
		Matter.Body.setVelocity(player, {
			x: player.velocity.x * -1,
			y: player.velocity.y
		})
	}
	if (player.position.y <= 0) {
		Matter.Body.setVelocity(player, {
			x: player.velocity.x,
			y: player.velocity.y * -1
		})
	}
	if (player.position.x >= window.innerWidth) {
		Matter.Body.setVelocity(player, {
			x: player.velocity.x * -1,
			y: player.velocity.y
		})
	}
	if (player.position.y >= window.innerHeight) {
		Matter.Body.setVelocity(player, {
			x: player.velocity.x,
			y: player.velocity.y * -1
		})
	}

	if (keys[32]) {
		fireBullet();
		keys[32] = false;
	}
	capSpeed();

	if (!bullet1Bool) {
		bulletCount1.render.visible = true
	}
	if (bullet1Bool) {
		bulletCount1.render.visible = false
	}
	if (!bullet2Bool) {
		bulletCount2.render.visible = true
	}
	if (bullet2Bool) {
		bulletCount2.render.visible = false
	}
	if (!bullet3Bool) {
		bulletCount3.render.visible = true
	}
	if (bullet3Bool) {
		bulletCount3.render.visible = false
	}
	if (!bullet4Bool) {
		bulletCount4.render.visible = true
	}
	if (bullet4Bool) {
		bulletCount4.render.visible = false
	}

	clock++;
	reload();
	
}, 1000/60)

function fireBullet () {
	if (!bullet1Bool && firedInCycle.length === 0) {
		World.add(engine.world, bullet1);
		bullet1Bool = true;
		Matter.Body.setPosition(bullet1, {
			x: player.position.x,
			y: player.position.y - 30
		})
		Matter.Body.setVelocity(bullet1, {
			x: 0,
			y: -10
		})
		firedInCycle.push(bullet1);
		console.log(firedInCycle.length)
	}
	if (!bullet2Bool && firedInCycle.length === 0) {
		World.add(engine.world, bullet2);
		bullet2Bool = true;
		Matter.Body.setPosition(bullet2, {
			x: player.position.x,
			y: player.position.y - 30
		})
		Matter.Body.setVelocity(bullet2, {
			x: 0,
			y: -10
		})
		firedInCycle.push(bullet2);
	}
	if (!bullet3Bool && firedInCycle.length === 0) {
		World.add(engine.world, bullet3);
		bullet3Bool = true;
		Matter.Body.setPosition(bullet3, {
			x: player.position.x,
			y: player.position.y - 30
		})
		Matter.Body.setVelocity(bullet3, {
			x: 0,
			y: -10
		})
		firedInCycle.push(bullet3);		}
	if (!bullet4Bool && firedInCycle.length === 0) {
		World.add(engine.world, bullet4);
		bullet4Bool = true;
		Matter.Body.setPosition(bullet4, {
			x: player.position.x,
			y: player.position.y - 30
		})
		Matter.Body.setVelocity(bullet4, {
			x: 0,
			y: -10
		})
		firedInCycle.push(bullet4);
	}

	firedInCycle = [];
}
function reload () {
	if (bullet1Bool && bullet2Bool && bullet3Bool && bullet4Bool) {
		reloadTimer.render.visible = true;
		reloadTimer2.render.visible = true;

		Matter.Body.setPosition(reloadTimer2, {
			x: (window.innerWidth-210)+(1/2*(clock-reloadTime)),
			y: 50
		})

		if (clock >= reloadTime+200) {
			World.remove(engine.world, [bullet1, bullet2, bullet3, bullet4])
			bullet1Bool = false;
			bullet2Bool = false;
			bullet3Bool = false;
			bullet4Bool = false;
		}
	}
	if (!bullet1Bool || !bullet2Bool || !bullet3Bool || !bullet4Bool) {
		reloadTime = clock;

		reloadTimer.render.visible = false;
		reloadTimer2.render.visible = false;

		Matter.Body.setPosition(reloadTimer2, {
			x: window.innerWidth-210,
			y: 50
		})
	}
}

function capSpeed () {
	if (player.velocity.x > 5.6) {
		Matter.Body.setVelocity(player, {
			x: 5.6,
			y: player.velocity.y
		})
	}
	if (player.velocity.x < -5.6) {
		Matter.Body.setVelocity(player, {
			x: -5.6,
			y: player.velocity.y
		})
	}
	if (player.velocity.y < -5.6) {
		Matter.Body.setVelocity(player, {
			x: player.velocity.x,
			y: -5.6
		})
	}
	if (player.velocity.y > 5.6) {
		Matter.Body.setVelocity(player, {
			x: player.velocity.x,
			y: 5.6
		})
	}

	magnitude = Math.sqrt(player.velocity.x*player.velocity.x + player.velocity.y*player.velocity.y);
	angle = Math.atan2(player.velocity.y, player.velocity.x)

	if (magnitude >= 5.6) {
		Matter.Body.setVelocity(player, {
			x: magnitude * Math.cos(angle),
			y: magnitude * Math.sin(angle)
		})
	}

	if (bullet1.velocity.y <= -5) {
		Matter.Body.setVelocity(bullet1, {
			x: 0,
			y: -10
		})
	}
	if (bullet2.velocity.y <= -5) {
		Matter.Body.setVelocity(bullet2, {
			x: 0,
			y: -10
		})
	}
	if (bullet3.velocity.y <= -5) {
		Matter.Body.setVelocity(bullet3, {
			x: 0,
			y: -10
		})
	}
	if (bullet4.velocity.y <= -5) {
		Matter.Body.setVelocity(bullet4, {
			x: 0,
			y: -10
		})
	}
}

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);