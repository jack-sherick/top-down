//the start of a top down bullet hell
/* Issues and Errors
	-Holding space sorta breaks the firing system
	-Corner canvas collisions are broken
	-The player doesn't move faster if they move diagonally, but they accelerate faster
/* Fixes
	-Arrays!
	-The wave ends properly
	-Bullets aren't rainbow (but coloring needs work)
	-Categories work now
	-Bullet/mob collisions work
	-Player can take damage by collision with mobs
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
	wall: 0x100000
}

//delete gravity
engine.world.gravity.y = 0;

//player object
let player = Matter.Bodies.rectangle(window.innerWidth/2, window.innerHeight/2, 30, 30, {
	health: 100,
	hurt: false,
	inertia: Infinity,
	collisionFilter: {
		category: cat.player,
		mask: cat.mobs | cat.wall
	},
	render: {
		fillStye: "#3364d6"
	}
});

World.add(engine.world, [player]);

let hpBar = Matter.Bodies.rectangle(120, 50, 200, 12, {
	inertia: Infinity,
	collisionFilter: {
		category: cat.reloadTimer,
		mask: 0
	},
	render: {
		fillStyle: "#d91a1a"
	}
});
let hpBar2 = Matter.Bodies.rectangle(320, 50, 200, 12, {
	inertia: Infinity,
	render: {
		fillStyle: "#18181d"
	},
	collisionFilter: {
		category: cat.reloadTimer,
		mask: 0
	}
});

World.add(engine.world, [hpBar, hpBar2])

let leftWall = Matter.Bodies.rectangle(0, window.innerHeight/2, 2, window.innerHeight, {
	render: {
		visible: false
	},
	isStatic: true,
	inertia: Infinity,
	collisionFilter: {
		category: cat.wall,
		mask: cat.player
	}
});
let rightWall = Matter.Bodies.rectangle(window.innerWidth, window.innerHeight/2, 2, window.innerHeight, {
	render: {
		visible: false
	},
	isStatic: true,
	inertia: Infinity,
	collisionFilter: {
		category: cat.wall,
		mask: cat.player
	}
});
let bottomWall = Matter.Bodies.rectangle(window.innerWidth/2, window.innerHeight, window.innerWidth, 2, {
	render: {
		visible: false
	},
	isStatic: true,
	inertia: Infinity,
	collisionFilter: {
		category: cat.wall,
		mask: cat.player
	}
});
let topWall = Matter.Bodies.rectangle(window.innerWidth/2, 0, window.innerWidth, 2, {
	render: {
		visible: false
	},
	isStatic: true,
	inertia: Infinity,
	collisionFilter: {
		category: cat.wall,
		mask: cat.player
	}
});

World.add(engine.world, [leftWall, rightWall, bottomWall, topWall])

//bullet bodies
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

//bullet counters
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

//create reload timer bodies, rT2 is the color of the canvas and overlaps the first one
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

//mob bodies
let mobs = [];

for (let i = 0; i < 8; i++) {
	mobs[i] = {
		body: Matter.Bodies.rectangle(100+(i*120), -50, 24, 24, {
			inertia: Infinity,
			render: {
				fillStyle: "#d10e00"
			},
			collisionFilter: {
				category: cat.mobs,
				mask: cat.bullet | cat.mobs | cat.player
			}
		}),
		chasing: false,
		alive: false,
		spawnPos: {
			x: 100+(i*120),
			y: -50
		}
	}
	World.add(engine.world, mobs[i].body);
}


//clocks
let clock = 0, waveTimer = 0;
let waveState = 0, mobToSend = 0, currentWave = 0;
let reloadTime = 0, hurtTimer = 0;

let waveEnd = true, mobWaveSent = false;

//recursive function
setInterval(function () {

	Matter.Body.setPosition(hpBar2, {
		x: 320-(2*(100-player.health)),
		y: hpBar2.position.y
	})

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
	waves();
	mobBehavior();
	playerHurt();

	if (player.health <= 0) {
		dead()
	}

	if (clock === 400) {
		waveTimer = 400;
		waveEnd = false;
		for (let i = 0; i < mobs.length; i++) {
			mobs[i].alive = true;
		}
		//console.log(mobs)
	}
	if (!waveEnd) {
		for (let i = 0; i < mobs.length; i++) {
			if (mobs[i].alive) {
				break;
			}
			if (i === mobs.length-1) {
				waveEnd = true;
				waveTimer = clock;
			}
			if (mobs[mobs.length-1].chasing) {
				mobWaveSent = true;
			}
		}
	}

}, 1000/60);

function dead () {
	window.location.href = "start.html"
}

//sends out mobs periodically based on waveState
function waves () {
	if (waveEnd && currentWave !== 5) {
		if (clock > waveTimer+150 && clock > 400) {
			waveEnd = false;
			mobToSend = 0;
			mobWaveSent = false;
			for (let i = 0; i < mobs.length; i++) {
				Matter.Body.setVelocity(mobs[i].body, {
					x: 0,
					y: 0
				})
				World.add(engine.world, mobs[i].body)
				mobs[i].alive = true;
			}
			currentWave++;
			console.log(currentWave)
		}
	}
	if (currentWave === 5) {
		console.log("I plan to have some sort of power up choice for every five waves")
	}
	if (!waveEnd && !mobWaveSent) {
		waveState = 80;
		if (clock >= waveTimer+waveState) {
			waveTimer = clock;
			mobs[mobToSend].chasing = true;
			//console.log(mobs);
			mobToSend++;
		}
	}
}

function mobBehavior () {
	for (let i = 0; i < mobs.length; i++) {
		if (mobs[i].chasing) {
			Matter.Body.setVelocity(mobs[i].body, {
				x: 2 * Math.cos(Math.atan2(player.position.y - mobs[i].body.position.y, player.position.x - mobs[i].body.position.x)),
				y: 2 * Math.sin(Math.atan2(player.position.y - mobs[i].body.position.y, player.position.x - mobs[i].body.position.x))
			})
		}
		if (!mobs[i].alive) {
			Matter.Body.setPosition(mobs[i].body, {
				x: mobs[i].spawnPos.x,
				y: mobs[i].spawnPos.y
			})
		}
	}
}

//space fires a bullet - holding space breaks it
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

//either mag is empty of r is pressed post a bullet being fired allows for a timer to appear, and the bullets to be refilled
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

//cap speed for bullets and player
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

function playerHurt () {
	if (player.hurt) {
		player.render.fillStyle = "#b81c1c"
		if (clock >= hurtTimer+20) {
			player.hurt = false;
		}
	}
	if (!player.hurt) {
		player.render.fillStyle = "#3364d6"
		hurtTimer = clock;
	}
}

Events.on(engine, "collisionStart", function (event) {
	const pairs = event.pairs;
	for (let i = 0, j = pairs.length; i != j; ++i) {
		//bullet/anything(bullets only collide with mobs) collision
		for (let x = 0; x < bulletArr.length; x++) {
			if (bulletArr[x].body === pairs[i].bodyA) {
				World.remove(engine.world, pairs[i].bodyB);
				World.remove(engine.world, bulletArr[x].body);

				for (let y = 0; y < mobs.length; y++) {
					if (mobs[y].body === pairs[i].bodyB) {
						mobs[y].chasing = false
						mobs[y].alive = false;
					}
				}
			}
			else if (bulletArr[x].body === pairs[i].bodyB) {
				World.remove(engine.world, pairs[i].bodyA);
				World.remove(engine.world, bulletArr[x].body);

				for (let y = 0; y < mobs.length; y++) {
					if (mobs[y].body === pairs[i].bodyA) {
						mobs[y].chasing = false
						mobs[y].alive = false;
					}
				}
			}
		}
		if (pairs[i].bodyB === player) {
			if (pairs[i].bodyA !== leftWall && pairs[i].bodyA !== rightWall && pairs[i].bodyA !== bottomWall && pairs[i].bodyA !== topWall) {
				player.health -= 10;
				player.hurt = true;
				World.remove(engine.world, pairs[i].bodyA);

				for (let y = 0; y < mobs.length; y++) {
					if (mobs[y].body === pairs[i].bodyA) {
						mobs[y].chasing = false
						mobs[y].alive = false;
					}
				}
			}
			if (pairs[i].bodyA === bottomWall || pairs[i].bodyA === topWall) {
				Matter.Body.setVelocity(player, {
					x: player.velocity.x,
					y: player.velocity.y * -.8
				})
			}
			if (pairs[i].bodyA === leftWall || pairs[i].bodyA === rightWall) {
				Matter.Body.setVelocity(player, {
					x: player.velocity.x * -.8,
					y: player.velocity.y
				})
			}
		}
		if (pairs[i].bodyA === player) {
			if (pairs[i].bodyB !== leftWall && pairs[i].bodyB !== rightWall && pairs[i].bodyB !== bottomWall && pairs[i].bodyB !== topWall) {
				player.health -= 10;
				player.hurt = true;
				World.remove(engine.world, pairs[i].bodyB)

				for (let y = 0; y < mobs.length; y++) {
					if (mobs[y].body === pairs[i].bodyB) {
						mobs[y].chasing = false
						mobs[y].alive = false;
					}
				}
			}
			if (pairs[i].bodyB === bottomWall || pairs[i].bodyB === topWall) {
				Matter.Body.setVelocity(player, {
					x: player.velocity.x,
					y: player.velocity.y * -.8
				})
			}
			if (pairs[i].bodyB === leftWall || pairs[i].bodyB === rightWall) {
				Matter.Body.setVelocity(player, {
					x: player.velocity.x * -.8,
					y: player.velocity.y
				})
			}
		}
	}
})

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);