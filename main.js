//the start of a top down bullet hell
/* Issues and Errors
	-Holding space sorta breaks the firing system
	-Collisions.exe is not responding
	-Color schemes are hard
*/
/* Fixes
	-Arrays!
	-Bullets aren't rainbow (but coloring needs work)
	-Starts of a category system
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

const cat = {
	player: 0x1,
	bullet: 0x10,
	bulletCount: 0x100,
	mobs: 0x1000,
	reloadTimer: 0x10000,
}

//delete gravity
engine.world.gravity.y = 0;

//player object
let player = Matter.Bodies.rectangle(window.innerWidth/2, window.innerHeight/2, 30, 30, {
	inertia: Infinity,
	collisionFilter: {
		category: cat.player,
		mask: 0
	}
});
World.add(engine.world, player)

//bullet vars
let bulletArr = []

for (let i = 0; i < 5; i++) {
	bulletArr[i] = {
		body: Matter.Bodies.rectangle(player.position.x, player.position.y - 18, 12, 9, {
			frictionAir: 0,
			render: {
				fillStyle: "#e6b800"
			},
			collisionFilter: {
				category: cat.bullet,
				mask: cat.mobs
			},
			inertia: Infinity
		}),
		bool: false
	}
}

let firedInCycle = [];

let bulletCount5 = Matter.Bodies.rectangle(window.innerWidth-50, 50, 6, 12, {
	collisionFilter: {
		category: cat.bulletCount,
		mask: 0
	},
	render: {
		fillStyle: "#e6b800"
	}
});
let bulletCount4 = Matter.Bodies.rectangle(bulletCount5.position.x-20, bulletCount5.position.y, 6, 12, {
	collisionFilter: {
		category: cat.bulletCount,
		mask: 0
	},
	render: {
		fillStyle: "#e6b800"
	}
});
let bulletCount3 = Matter.Bodies.rectangle(bulletCount4.position.x-20, bulletCount4.position.y, 6, 12, {
	collisionFilter: {
		category: cat.bulletCount,
		mask: 0
	},
	render: {
		fillStyle: "#e6b800"
	}
});
let bulletCount2 = Matter.Bodies.rectangle(bulletCount3.position.x-20, bulletCount3.position.y, 6, 12, {
	collisionFilter: {
		category: cat.bulletCount,
		mask: 0
	},
	render: {
		fillStyle: "#e6b800"
	}
});
let bulletCount1 = Matter.Bodies.rectangle(bulletCount2.position.x-20, bulletCount2.position.y, 6, 12, {
	collisionFilter: {
		category: cat.bulletCount,
		mask: 0
	},
	render: {
		fillStyle: "#e6b800"
	}
});

let bulletCountArr = [bulletCount1, bulletCount2, bulletCount3, bulletCount4, bulletCount5]

World.add(engine.world, [bulletCount1, bulletCount2, bulletCount3, bulletCount4, bulletCount5])

let reloadTimer = Matter.Bodies.rectangle(window.innerWidth-110, 50, 100, 12, {
	collisionFilter: {
		category: cat.reloadTimer,
		mask: 0
	},
	render: {
		visible: false
	}
})
let reloadTimer2 = Matter.Bodies.rectangle(window.innerWidth-210, 50, 100, 12, {
	collisionFilter: {
		category: cat.reloadTimer,
		mask: 0
	},
	render: {
		fillStyle: "#18181d",
		visible: false
	}
})

World.add(engine.world, [reloadTimer, reloadTimer2]);

let mobs = [];

for (let i = 0; i < 8; i++) {
	mobs[i] = {
		body: Matter.Bodies.rectangle(window.innerWidth/2, -50, 24, 24, {
			inertia: Infinity,
			collisionFilter: {
				catergory: cat.mobs,
				mask: cat.bullet
			}
		}),
		chasing: false,
		alive: true
	}
	World.add(engine.world, mobs[i].body);
}

let clock = 0, waveTimer = 0;
let waveState = 0, mobToSend = 0;
let reloadTime = 0;

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

	for (let i = 0; i < bulletArr.length; i++) {
		if (!bulletArr[i].bool) {
			bulletCountArr[i].render.visible = true;
		}
		if (bulletArr[i].bool) {
			bulletCountArr[i].render.visible = false;
		}
	}

	clock++;
	reload();
	if (clock >= 400 && mobToSend <= 7) {
		wave1();
		if (clock === 400) {
			waveTimer = 400;
		}
	}

	for (let i = 0; i < mobs.length; i++) {
		if (mobs[i].chasing) {
			Matter.Body.setVelocity(mobs[i].body, {
				x: 2.5 * Math.cos(Math.atan2(player.position.y - mobs[i].body.position.y, player.position.x - mobs[i].body.position.x)),
				y: 2.5 * Math.sin(Math.atan2(player.position.y - mobs[i].body.position.y, player.position.x - mobs[i].body.position.x))
			})
		}
	}
	
}, 1000/60);

function wave1 () {
	waveState = 80;
	if (clock >= waveTimer+waveState) {
		waveTimer = clock;
		mobs[mobToSend].chasing = true;
		mobToSend++;
	}
}

function fireBullet () {
	for (let i = 0; i < bulletArr.length; i++) {
		if (!bulletArr[i].bool && firedInCycle.length === 0) {
			World.add(engine.world, bulletArr[i].body);
			bulletArr[i].bool = true;
			Matter.Body.setPosition(bulletArr[i].body, {
				x: player.position.x,
				y: player.position.y - 30
			})
			Matter.Body.setVelocity(bulletArr[i].body, {
				x: 0,
				y: -10
			})
			firedInCycle.push(bulletArr[i]);
		}
	}
	keys[32] = false;

	firedInCycle = [];
}
function reload () {
	if (keys[82]) {
		keys[82] = false;
		if (bulletArr[0].bool) {
			for (let i = 0; i < bulletArr.length; i++) {
				bulletArr[i].bool = true;
			}
		}
	}
	if (bulletArr[0].bool && bulletArr[1].bool && bulletArr[2].bool && bulletArr[3].bool && bulletArr[4].bool) {
		reloadTimer.render.visible = true;
		reloadTimer2.render.visible = true;

		Matter.Body.setPosition(reloadTimer2, {
			x: (window.innerWidth-210)+(1/2*(clock-reloadTime)),
			y: 50
		})

		if (clock >= reloadTime+200) {
			for (let i = 0; i < bulletArr.length; i++) {
				World.remove(engine.world, bulletArr[i].body)
				bulletArr[i].bool = false;
			}
		}
	}
	if (!bulletArr[0].bool || !bulletArr[1].bool || !bulletArr[2].bool || !bulletArr[3].bool || !bulletArr[4].bool) {
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

	for (let i = 0; i < bulletArr.length; i++) {
		if (bulletArr[i].body.velocity.y <= -10) {
			Matter.Body.setVelocity(bulletArr[i].body, {
				x: 0,
				y: -10
			})
		}
	}
}

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);