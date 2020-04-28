//the start of a top down bullet hell
/* Issues and Errors
	-Holding space sorta breaks the firing system
	-Collision with the bullet counter and the timers and stuff, depending on how I do bullet/mob collisions, the system works right now, but I dont know what Im going to do
	-Haven't started with coloring or styling, so the bullets are rainbow
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
let player = Matter.Bodies.rectangle(window.innerWidth/2, window.innerHeight/2, 30, 30, {
	inertia: Infinity,
	collisionFilter: {
		category: 0x0001,
		mask: 0
	}
});
World.add(engine.world, player)

//bullet vars
let bullet1 = Matter.Bodies.rectangle(player.position.x, player.position.y - 18, 12, 9, {
	frictionAir: 0,
	render: {
		fillStyle: "#e6b800"
	},
	collisionFilter: {
		category: 0x1,
		mask: 0
	},
	inertia: Infinity
});
let bullet1Bool = false;

let bullet2 = Matter.Bodies.rectangle(player.position.x, player.position.y - 18, 12, 9, {
	frictionAir: 0,
	render: {
		fillStyle: "#e6b800"
	},
	collisionFilter: {
		category: 0x1,
		mask: 0
	},
	inertia: Infinity
});
let bullet2Bool = false;

let bullet3 = Matter.Bodies.rectangle(player.position.x, player.position.y - 18, 12, 9, {
	frictionAir: 0,
	render: {
		fillStyle: "#e6b800"
	},
	collisionFilter: {
		category: 0x1,
		mask: 0
	},
	inertia: Infinity
});
let bullet3Bool = false;

let bullet4 = Matter.Bodies.rectangle(player.position.x, player.position.y - 18, 12, 9, {
	frictionAir: 0,
	render: {
		fillStyle: "#e6b800"
	},
	collisionFilter: {
		category: 0x1,
		mask: 0
	},
	inertia: Infinity
});
let bullet4Bool = false;

let bullet5 = Matter.Bodies.rectangle(player.position.x, player.position.y - 18, 12, 9, {
	frictionAir: 0,
	render: {
		fillStyle: "#e6b800"
	},
	collisionFilter: {
		category: 0x1,
		mask: 0
	},
	inertia: Infinity
});
let bullet5Bool = false;

let firedInCycle = [];

let bulletCount5 = Matter.Bodies.rectangle(window.innerWidth-50, 50, 6, 12, {
	collisionFilter: {
		category: 0x01,
		mask: 0
	},
	render: {
		fillStyle: "#e6b800"
	}
});
let bulletCount4 = Matter.Bodies.rectangle(bulletCount5.position.x-20, bulletCount5.position.y, 6, 12, {
	collisionFilter: {
		category: 0x01,
		mask: 0
	},
	render: {
		fillStyle: "#e6b800"
	}
});
let bulletCount3 = Matter.Bodies.rectangle(bulletCount4.position.x-20, bulletCount4.position.y, 6, 12, {
	collisionFilter: {
		category: 0x01,
		mask: 0
	},
	render: {
		fillStyle: "#e6b800"
	}
});
let bulletCount2 = Matter.Bodies.rectangle(bulletCount3.position.x-20, bulletCount3.position.y, 6, 12, {
	collisionFilter: {
		category: 0x01,
		mask: 0
	},
	render: {
		fillStyle: "#e6b800"
	}
});
let bulletCount1 = Matter.Bodies.rectangle(bulletCount2.position.x-20, bulletCount2.position.y, 6, 12, {
	collisionFilter: {
		category: 0x01,
		mask: 0
	},
	render: {
		fillStyle: "#e6b800"
	}
});

World.add(engine.world, [bulletCount1, bulletCount2, bulletCount3, bulletCount4, bulletCount5])

let clock = 0;
let reloadTime = 0;

let reloadTimer = Matter.Bodies.rectangle(window.innerWidth-110, 50, 100, 12, {
	collisionFilter: {
		category: 0x001,
		mask: 0
	}
})
let reloadTimer2 = Matter.Bodies.rectangle(window.innerWidth-210, 50, 100, 12, {
	collisionFilter: {
		category: 0x001,
		mask: 0
	},
	render: {
		fillStyle: "#18181d"
	}
})

World.add(engine.world, [reloadTimer, reloadTimer2])

let mobs = [];

for (let i = 0; i < 8; i++) {
	mobs[i] = Matter.Bodies.rectangle(window.innerWidth/2, -50, 24, 24, {
		inertia: Infinity,
		collisionFilter: {
			catergory: 0x00001,
			mask: 0
		}
	});
	World.add(engine.world, mobs[i])
}

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
		keys[32] = false;
		fireBullet();
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
	if (!bullet5Bool) {
		bulletCount5.render.visible = true
	}
	if (bullet5Bool) {
		bulletCount5.render.visible = false
	}

	clock++;
	reload();
	if (clock >= 400) {
		wave1();
	}
	
}, 1000/60);

function wave1 () {
	let waveTimer = clock;
	for (let i = 0; i < mobs.length; i++) {
		i--;
		if (clock >= waveTimer+100) {
			Matter.Body.setVelocity(mobs[i], {
				x: 3 * Math.cos(Math.atan2(player.position.y - mobs[i].position.y, player.position.x - mobs[i].position.x)),
				y: 3 * Math.sin(Math.atan2(player.position.y - mobs[i].position.y, player.position.x - mobs[i].position.x))
			})
			i++;
			waveTimer = clock;
		}
	}
}

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
	if (!bullet5Bool && firedInCycle.length === 0) {
		World.add(engine.world, bullet5);
		bullet5Bool = true;
		Matter.Body.setPosition(bullet5, {
			x: player.position.x,
			y: player.position.y - 30
		})
		Matter.Body.setVelocity(bullet5, {
			x: 0,
			y: -10
		})
		firedInCycle.push(bullet5);
	}
	keys[32] = false;

	firedInCycle = [];
}
function reload () {
	if (keys[82]) {
		keys[82] = false;
		if (bullet1Bool) {
			bullet1Bool = true;
			bullet2Bool = true;
			bullet3Bool = true;
			bullet4Bool = true;
			bullet5Bool = true;
		}
	}
	if (bullet1Bool && bullet2Bool && bullet3Bool && bullet4Bool && bullet5Bool) {
		reloadTimer.render.visible = true;
		reloadTimer2.render.visible = true;

		Matter.Body.setPosition(reloadTimer2, {
			x: (window.innerWidth-210)+(1/2*(clock-reloadTime)),
			y: 50
		})

		if (clock >= reloadTime+200) {
			World.remove(engine.world, [bullet1, bullet2, bullet3, bullet4, bullet5])
			bullet1Bool = false;
			bullet2Bool = false;
			bullet3Bool = false;
			bullet4Bool = false;
			bullet5Bool = false;
		}
	}
	if (!bullet1Bool || !bullet2Bool || !bullet3Bool || !bullet4Bool || !bullet5Bool) {
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
	if (bullet5.velocity.y <= -5) {
		Matter.Body.setVelocity(bullet5, {
			x: 0,
			y: -10
		})
	}
}

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);