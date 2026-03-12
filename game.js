const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const FPS = 30; // frames per second
const SHIP_SIZE = 30; // ship height in pixels
const TURN_SPEED = 360; // turn speed in degrees per second
const THRUST = 5; // acceleration of the ship in pixels per second per second
const FRICTION = 0.7; // friction coefficient of space (0 = no friction, 1 = lots of friction)
const ROIDS_NUM = 3; // starting number of asteroids
const ROIDS_SIZE = 100; // starting size of asteroids in pixels
const ROIDS_SPD = 50; // max starting speed of asteroids in pixels per second
const ROIDS_VERT = 10; // average number of vertices on each asteroid
const ROIDS_JAG = 0.4; // jaggedness of the asteroids (0 = none, 1 = lots)
const LASER_MAX = 10; // maximum number of lasers on screen at once
const LASER_SPD = 500; // speed of lasers in pixels per second
const LASER_DIST = 0.6; // max distance laser can travel as fraction of screen width
const SHOW_BOUNDING = false; // show or hide collision bounding
const TEXT_FADE_TIME = 2.5; // text fade time in seconds
const TEXT_SIZE = 40; // text font height in pixels
const GAME_LIVES = 3; // starting number of lives
const ROIDS_PTS_LGE = 20; // points given for a large asteroid
const ROIDS_PTS_MED = 50; // points given for a medium asteroid
const ROIDS_PTS_SML = 100; // points given for a small asteroid
const SHIP_INV_DUR = 3; // duration of the ship's invulnerability
const SHIP_BLINK_DUR = 0.1; // duration of the ship's blink during invulnerability

var level, lives, score, scoreHigh, text, textAlpha;

// set up the game parameters
level = 0;
lives = GAME_LIVES;
score = 0;
scoreHigh = 0;

const ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    r: SHIP_SIZE / 2,
    a: 90 / 180 * Math.PI, // convert to radians
    rot: 0,
    thrusting: false,
    blinkTime: Math.ceil(SHIP_BLINK_DUR * FPS),
    blinkNum: Math.ceil(SHIP_INV_DUR / SHIP_BLINK_DUR),
    thrust: {
        x: 0,
        y: 0
    }
};

const keys = {};

// set up asteroids
var roids = [];
createAsteroidBelt();

// set up lasers
var lasers = [];

function createAsteroidBelt() {
    roids = [];
    var x, y;
    for (var i = 0; i < ROIDS_NUM + level; i++) {
        do {
            x = Math.floor(Math.random() * canvas.width);
            y = Math.floor(Math.random() * canvas.height);
        } while (distBetweenPoints(ship.x, ship.y, x, y) < ROIDS_SIZE * 2 + ship.r);
        roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 2)));
    }
}

function distBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function newAsteroid(x, y, r) {
    var lvlMult = 1 + 0.1 * level; // increase speed by level
    var roid = {
        x: x,
        y: y,
        xv: Math.random() * ROIDS_SPD * lvlMult / FPS * (Math.random() < 0.5 ? 1 : -1),
        yv: Math.random() * ROIDS_SPD * lvlMult / FPS * (Math.random() < 0.5 ? 1 : -1),
        r: r,
        a: Math.random() * Math.PI * 2, // in radians
        vert: Math.floor(Math.random() * (ROIDS_VERT + 1) + ROIDS_VERT / 2),
        offs: []
    };

    // create the vertex offsets array
    for (var i = 0; i < roid.vert; i++) {
        roid.offs.push(Math.random() * ROIDS_JAG * 2 + 1 - ROIDS_JAG);
    }

    return roid;
}

function destroyAsteroid(index) {
    var x = roids[index].x;
    var y = roids[index].y;
    var r = roids[index].r;

    // split the asteroid in two if necessary
    if (r == Math.ceil(ROIDS_SIZE / 2)) {
        roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 4)));
        roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 4)));
        score += ROIDS_PTS_LGE;
    } else if (r == Math.ceil(ROIDS_SIZE / 4)) {
        roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 8)));
        roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 8)));
        score += ROIDS_PTS_MED;
    } else {
        score += ROIDS_PTS_SML;
    }

    // check high score
    if (score > scoreHigh) {
        scoreHigh = score;
    }

    // destroy the asteroid
    roids.splice(index, 1);

    // new level when no more asteroids
    if (roids.length == 0) {
        level++;
        newLevel();
    }
}

function explodeShip() {
    ship.explodeTime = Math.ceil(0.3 * FPS);
}

function newLevel() {
    text = "LEVEL " + (level + 1);
    textAlpha = 1.0;
    createAsteroidBelt();
}

function gameOver() {
    ship.dead = true;
    text = "GAME OVER";
    textAlpha = 1.0;
    ship.thrusting = false;
    keys['ArrowUp'] = false;
    keys['ArrowLeft'] = false;
    keys['ArrowRight'] = false;
}

function resetGame() {
    level = 0;
    lives = GAME_LIVES;
    score = 0;
    ship.x = canvas.width / 2;
    ship.y = canvas.height / 2;
    ship.a = 90 / 180 * Math.PI;
    ship.thrust.x = 0;
    ship.thrust.y = 0;
    ship.dead = false;
    ship.explodeTime = 0;
    ship.blinkTime = Math.ceil(SHIP_BLINK_DUR * FPS);
    ship.blinkNum = Math.ceil(SHIP_INV_DUR / SHIP_BLINK_DUR);
    lasers = [];
    newLevel();
}

resetGame();

function shootLaser() {
    // create the laser object
    if (lasers.length < LASER_MAX) {
        lasers.push({ // from the nose of the ship
            x: ship.x + 4 / 3 * ship.r * Math.cos(ship.a),
            y: ship.y - 4 / 3 * ship.r * Math.sin(ship.a),
            xv: LASER_SPD * Math.cos(ship.a) / FPS,
            yv: -LASER_SPD * Math.sin(ship.a) / FPS,
            dist: 0
        });
    }
}

// Set up event handlers
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function keyDown(/** @type {KeyboardEvent} */ ev) {
    if (ship.dead || ship.explodeTime > 0) return;
    keys[ev.code] = true;
    if (ev.code === 'Space') shootLaser();
}

function keyUp(/** @type {KeyboardEvent} */ ev) {
    if (ship.dead || ship.explodeTime > 0) return;
    keys[ev.code] = false;
}

function drawShip(x, y, a, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = SHIP_SIZE / 20;
    ctx.beginPath();
    ctx.moveTo( // nose of the ship
        x + 4 / 3 * ship.r * Math.cos(a),
        y - 4 / 3 * ship.r * Math.sin(a)
    );
    ctx.lineTo( // rear left
        x - ship.r * (2 / 3 * Math.cos(a) + Math.sin(a)),
        y + ship.r * (2 / 3 * Math.sin(a) - Math.cos(a))
    );
    ctx.lineTo( // rear right
        x - ship.r * (2 / 3 * Math.cos(a) - Math.sin(a)),
        y + ship.r * (2 / 3 * Math.sin(a) + Math.cos(a))
    );
    ctx.closePath();
    ctx.stroke();
}

function update() {
    // Process input
    if (!ship.dead && !ship.explodeTime) {
        if (keys['ArrowLeft']) {
            ship.rot = TURN_SPEED / 180 * Math.PI / FPS;
        } else if (keys['ArrowRight']) {
            ship.rot = -TURN_SPEED / 180 * Math.PI / FPS;
        } else {
            ship.rot = 0;
        }
        ship.thrusting = keys['ArrowUp'];
    } else {
        ship.thrusting = false;
        ship.rot = 0;
    }

    // draw space
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // thrust the ship
    if (ship.thrusting && !ship.dead && !ship.explodeTime) {
        ship.thrust.x += THRUST * Math.cos(ship.a) / FPS;
        ship.thrust.y -= THRUST * Math.sin(ship.a) / FPS;

        // draw the thruster
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = SHIP_SIZE / 10;
        ctx.beginPath();
        ctx.moveTo( // rear left
            ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + 0.5 * Math.sin(ship.a)),
            ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - 0.5 * Math.cos(ship.a))
        );
        ctx.lineTo( // rear center (behind the ship)
            ship.x - ship.r * 5 / 3 * Math.cos(ship.a),
            ship.y + ship.r * 5 / 3 * Math.sin(ship.a)
        );
        ctx.lineTo( // rear right
            ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - 0.5 * Math.sin(ship.a)),
            ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + 0.5 * Math.cos(ship.a))
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    } else {
        // apply friction (slow the ship down when not thrusting)
        ship.thrust.x -= FRICTION * ship.thrust.x / FPS;
        ship.thrust.y -= FRICTION * ship.thrust.y / FPS;
    }

    // draw the triangular ship
    if (!ship.dead && !ship.explodeTime) {
        drawShip(ship.x, ship.y, ship.a, 'white');

        // handle blinking (invulnerability shield)
        if (ship.blinkNum > 0) {
            ship.blinkTime--;
            if (ship.blinkTime == 0) {
                ship.blinkTime = Math.ceil(SHIP_BLINK_DUR * FPS);
                ship.blinkNum--;
            }

            // Draw invulnerability shield
            var blinkOn = ship.blinkNum % 2 == 0;
            if (blinkOn) {
                ctx.strokeStyle = "cyan";
                ctx.lineWidth = SHIP_SIZE / 20;
                ctx.beginPath();
                ctx.arc(ship.x, ship.y, ship.r * 1.4, 0, Math.PI * 2, false);
                ctx.stroke();
            }
        }
    }

    // draw the asteroids
    var x, y, r, a, vert, offs;
    for (var i = 0; i < roids.length; i++) {
        ctx.strokeStyle = 'slategrey';
        ctx.lineWidth = SHIP_SIZE / 20;

        // get the asteroid properties
        x = roids[i].x;
        y = roids[i].y;
        r = roids[i].r;
        a = roids[i].a;
        vert = roids[i].vert;
        offs = roids[i].offs;

        // draw a path
        ctx.beginPath();
        var j = 0;
        ctx.moveTo(
            x + r * offs[j] * Math.cos(a + j * Math.PI * 2 / vert),
            y + r * offs[j] * Math.sin(a + j * Math.PI * 2 / vert)
        );

        // draw the polygon
        for (j = 1; j < vert; j++) {
            ctx.lineTo(
                x + r * offs[j] * Math.cos(a + j * Math.PI * 2 / vert),
                y + r * offs[j] * Math.sin(a + j * Math.PI * 2 / vert)
            );
        }
        ctx.closePath();
        ctx.stroke();

        // move the asteroid
        roids[i].x += roids[i].xv;
        roids[i].y += roids[i].yv;

        // handle edge of screen
        if (roids[i].x < 0 - roids[i].r) {
            roids[i].x = canvas.width + roids[i].r;
        } else if (roids[i].x > canvas.width + roids[i].r) {
            roids[i].x = 0 - roids[i].r;
        }
        if (roids[i].y < 0 - roids[i].r) {
            roids[i].y = canvas.height + roids[i].r;
        } else if (roids[i].y > canvas.height + roids[i].r) {
            roids[i].y = 0 - roids[i].r;
        }
    }

    // draw the lasers
    for (var i = 0; i < lasers.length; i++) {
        ctx.fillStyle = 'salmon';
        ctx.beginPath();
        ctx.arc(lasers[i].x, lasers[i].y, SHIP_SIZE / 15, 0, Math.PI * 2, false);
        ctx.fill();
    }

    // move the lasers
    for (var i = lasers.length - 1; i >= 0; i--) {
        // check distance
        lasers[i].dist += Math.sqrt(Math.pow(lasers[i].xv, 2) + Math.pow(lasers[i].yv, 2));

        // handle edge of screen
        if (lasers[i].x < 0) {
            lasers[i].x = canvas.width;
        } else if (lasers[i].x > canvas.width) {
            lasers[i].x = 0;
        }
        if (lasers[i].y < 0) {
            lasers[i].y = canvas.height;
        } else if (lasers[i].y > canvas.height) {
            lasers[i].y = 0;
        }

        if (lasers[i].dist > LASER_DIST * canvas.width) {
            lasers.splice(i, 1);
            continue;
        }

        // move the laser
        lasers[i].x += lasers[i].xv;
        lasers[i].y += lasers[i].yv;
    }

    // detect laser hits on asteroids
    var ax, ay, ar, lx, ly;
    for (var i = roids.length - 1; i >= 0; i--) {

        // grab the asteroid properties
        ax = roids[i].x;
        ay = roids[i].y;
        ar = roids[i].r;

        // loop over the lasers
        for (var j = lasers.length - 1; j >= 0; j--) {

            // grab the laser properties
            lx = lasers[j].x;
            ly = lasers[j].y;

            // detect hits
            if (distBetweenPoints(ax, ay, lx, ly) < ar) {

                // remove the laser and the asteroid
                lasers.splice(j, 1);
                destroyAsteroid(i);
                break;
            }
        }
    }

    // check for asteroid collisions (when not exploding)
    if (!ship.explodeTime && !ship.dead && ship.blinkNum == 0) {
        for (var i = 0; i < roids.length; i++) {
            if (distBetweenPoints(ship.x, ship.y, roids[i].x, roids[i].y) < ship.r + roids[i].r) {
                explodeShip();
                destroyAsteroid(i);
                break;
            }
        }
    }

    // draw the text
    if (textAlpha >= 0) {
        ctx.fillStyle = "rgba(255, 255, 255, " + textAlpha + ")";
        ctx.font = "small-caps " + TEXT_SIZE + "px 'DejaVu Sans Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(text, canvas.width / 2, canvas.height * 0.75);
        textAlpha -= (1.0 / TEXT_FADE_TIME / FPS);
    } else if (ship.dead) {
        resetGame();
    }

    // draw the lives
    for (var i = 0; i < lives; i++) {
        drawShip(SHIP_SIZE + i * SHIP_SIZE * 1.2, SHIP_SIZE, 0.5 * Math.PI, 'white');
    }

    // draw the score
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.font = TEXT_SIZE + "px 'DejaVu Sans Mono', monospace";
    ctx.fillText(score, canvas.width - SHIP_SIZE / 2, SHIP_SIZE);

    // draw the high score
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.font = (TEXT_SIZE * 0.75) + "px 'DejaVu Sans Mono', monospace";
    ctx.fillText("BEST " + scoreHigh, canvas.width / 2, SHIP_SIZE);

    if (ship.explodeTime > 0) {
        // draw explosion
        ctx.fillStyle = "darkred";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 1.7, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 1.4, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 1.1, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 0.8, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 0.5, 0, Math.PI * 2, false);
        ctx.fill();

        ship.explodeTime--;

        if (ship.explodeTime == 0) {
            lives--;
            if (lives == 0) {
                gameOver();
            } else {
                ship.x = canvas.width / 2;
                ship.y = canvas.height / 2;
                ship.a = 90 / 180 * Math.PI;
                ship.thrust.x = 0;
                ship.thrust.y = 0;
                ship.blinkTime = Math.ceil(SHIP_BLINK_DUR * FPS);
                ship.blinkNum = Math.ceil(SHIP_INV_DUR / SHIP_BLINK_DUR);
            }
        }
    } else if (!ship.dead) {
        // rotate the ship
        ship.a += ship.rot;

        // move the ship
        ship.x += ship.thrust.x;
        ship.y += ship.thrust.y;
    }

    // handle edge of screen
    if (ship.x < 0 - ship.r) {
        ship.x = canvas.width + ship.r;
    } else if (ship.x > canvas.width + ship.r) {
        ship.x = 0 - ship.r;
    }
    if (ship.y < 0 - ship.r) {
        ship.y = canvas.height + ship.r;
    } else if (ship.y > canvas.height + ship.r) {
        ship.y = 0 - ship.r;
    }

}

// Start the game loop
setInterval(update, 1000 / FPS);
