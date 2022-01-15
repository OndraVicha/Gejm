let canvas, ship, shipImage, asteroidImage, blastImage;
let time = 0;
let asteroids = [];
let rockets = [];
let buildings = [];
let damage = 1;
let hits = 0;
let asteroidsLeft = 50;
let ammo = 100;
let maxAmmo = 500;

function naboje() {
  ammo++;
}

setInterval(function () {
  naboje()
}, 50);
function preload() {
  shipImage = loadImage("img/ufo.png");
  asteroidImage = loadImage("img/asteroid.png");
  backgroundImage = loadImage("img/background.png");
}

class SpaceShip {
  constructor(posX, posY) {
    this.x = posX;
    this.y = posY;
    this.w = 150;
    this.h = 100;
    this.angle = 0;
  }

  move() {
    if (keyIsDown(LEFT_ARROW)) {
      if (this.x > 0) this.x -= 5;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      if (this.x < width - this.w) this.x += 5;
    }
    if (keyIsDown(UP_ARROW)) {
      if (this.y > 0) this.y -= 5;
    }
    if (keyIsDown(DOWN_ARROW)) {
      if (this.y < height - 40 - this.h) this.y += 5;
    }
    if (keyIsDown(33)) {
      this.angle -= 10;
    }
    if (keyIsDown()) {
      this.angle += 10;
    }
    if (keyIsDown(32) && ammo > 0) {
      if (time % (10 + round(damage / 10)) == 0)
        rockets.push(new Rocket(this.x + this.w / 2, this.y + this.h / 2, this.angle));
      ammo--;
    }
  }

  detectCollision(asteroid) {
    return collideRectRect(
      this.x,
      this.y,
      this.w,
      this.h,
      asteroid.x,
      asteroid.y,
      asteroid.size,
      asteroid.size
    );
  }

  draw() {
    this.move();
    push();
    translate(this.x + 100, this.y + 60);
    rotate(((2 * PI) / 360) * this.angle);
    image(shipImage, -20, -40, 50, 50);
    pop();
  }
}

class Asteroid {
  constructor() {
    this.size = random(30, 40);
    this.y = 100
    this.x = -100;
    this.speed = random(1, 3);
    this.angle = random(0, 359);
  }

  move() {
    this.x += this.speed;
    this.angle += this.speed;
  }

  detectCollision(rocket) {
    return collideRectCircle(
      this.x,
      this.y,
      this.size,
      this.size,
      rocket.x,
      rocket.y,
      rocket.size
    );
  }

  draw() {
    this.move();
    push();
    translate(this.x - this.size / 2, this.y + this.size / 2);
    rotate(((2 * PI) / 360) * this.angle);
    image(asteroidImage, +this.size / 2, -this.size / 2, this.size, this.size);
    pop();
  }
}

class Rocket {
  constructor(x, y, angle) {
    this.size = 5;
    this.y = y;
    this.x = x;
    this.angle = angle - 180;
    this.speed = 5;
  }

  move() {
    this.x += this.speed * Math.cos((this.angle * Math.PI) / 180);
    this.y += this.speed * Math.sin((this.angle * Math.PI) / 180);
  }

  draw() {
    this.move();
    circle(this.x, this.y, this.size);
  }
}

function statusBar() {
  fill(color(30, 30, 30, 127));
  rect(0, height - 40, width, 40);
  strokeWeight(0);
  textSize(20);
  textStyle(BOLD);
  fill(color(200));
  text(`Hits: ${hits}`, 100, height - 15);
  text(`Asteroids Left: ${asteroidsLeft}`, 700, height - 15);
  text(`HP: ${damage} `, 450, height - 15);

}


function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  canvas.position(x, y);
}

function setup() {
  canvas = createCanvas(1000, 300);
  canvas.parent("mycanvas");
  ship = new SpaceShip(width / 2, height / 2);

}

function draw() {
  time++;
  background(backgroundImage);
  ship.draw();

  if (time % 120 == 0) {
    asteroids.push(new Asteroid());
  }

  asteroids.forEach(function (asteroid, index, array) {
    asteroid.draw();
    if (ship.detectCollision(asteroid)) {
      damage += asteroid.size;
      array.splice(index, 1);
    }

    if (asteroid.y > height) {
      array.splice(index, 1);
    }

    rockets.forEach(function (rocket, idx, arr) {
      if (asteroid.detectCollision(rocket)) {
        hits++;
        asteroidsLeft--;
        array.splice(index, 1);
        arr.splice(idx, 1);
      }
    });
  });

  rockets.forEach(function (rocket, idx, arr) {
    rocket.draw();
    if (
      rocket.y > height ||
      rocket.y < 0 ||
      rocket.x < 0 ||
      rocket.x > width
    ) {
      arr.splice(idx, 1);
    }
  });
  if (round(damage) > 1) {
    noLoop();
    background(100, 0, 0, 200);
    textSize(50);
    fill(255, 0, 0, 200);
    text('GAME IS OVER', width / 2 - 200, height / 2);
    damage = 0;
    statusBar();
  } else {
    statusBar();
  }
  if (asteroidsLeft == 0) {
    noLoop();
    background(100, 215, 84, 200);
    textSize(50);
    fill(35, 110, 25, 200);
    text('YOU WON', width / 2 - 135, height / 2);

    statusBar();
  }
}
