let canvas, x0, y0, spaceShip, spaceShiftSprite;
let time = 0;
let asteroids = [];
let rockets = [];

function preload() {
  spaceShiftSprite = loadImage("img/spaceship.png");
}

class SpaceShip {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 80;
    this.angle = 0;
  }

  detectCollision(asteroid) {
    return collideRectRect(
      this.x,
      this.y,
      this.width,
      this.height,
      asteroid.x,
      asteroid.y,
      asteroid.size,
      asteroid.size
    );
  }

  move() {
    if (keyIsDown(LEFT_ARROW)) {
      if (this.x > 0) this.x -= 5;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      if (this.x < width - this.width) this.x += 5;
    }
    if (keyIsDown(UP_ARROW)) {
      if (this.y > 0) this.y -= 5;
    }
    if (keyIsDown(DOWN_ARROW)) {
      if (this.y < height - this.height) this.y += 5;
    }
    if (keyIsDown(33)) {
      this.angle -= 5;
    }
    if (keyIsDown(34)) {
      this.angle += 5;
    }
    if (keyIsDown(32)) {
      if (time % 5 == 0)
        rockets.push(new Rocket(this.x + this.width/2, this.y + this.height/2, this.angle));
    }
  }

  draw() {
    this.move();
    push();
    translate(this.x + 20, this.y + 40);
    rotate(((2 * PI) / 360) * this.angle);
    rect(-20, -40, this.width, this.height);
    image(spaceShiftSprite.get(0, 0, 40, 80), -20, -40);
    pop();
  }
}

class Asteroid {
  constructor() {
    this.size = random(20, 50);
    this.y = -100;
    this.x = random(this.size, width - this.size);
    this.speed = random(1, 5);
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

  move() {
    this.y += this.speed;
  }

  draw() {
    this.move();
    rect(this.x, this.y, this.size, this.size);
  }
}

class Rocket {
  constructor(x, y, angle) {
    this.size = 5;
    this.y = y;
    this.x = x;
    this.angle = angle - 90;
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

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  canvas.position(x, y);
}

function setup() {
  canvas = createCanvas(1000, 600);
  canvas.parent("mycanvas");
  spaceShip = new SpaceShip(width / 2 - 20, height / 2 - 40);
}

function draw() {
  time++;
  background(250);
  spaceShip.draw();
  if (time % 10 == 0) {
    asteroids.push(new Asteroid());
  }
  asteroids.forEach(function (asteroid, index, array) {
    asteroid.draw();
    if (spaceShip.detectCollision(asteroid)) {
      array.splice(index, 1);
    }
    if (asteroid.y > height) {
      array.splice(index, 1);
    }
    rockets.forEach(function(rocket, idx, arr) {
      if (asteroid.detectCollision(rocket)) {
        array.splice(index, 1);
        arr.splice(idx, 1);
      }
    });
  });

  rockets.forEach(function(rocket, idx, arr) {
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
}

function mousePressed() {
  x0 = mouseX;
  y0 = mouseY;
  spaceShip.angle += 15;
}

function mouseMoved() {}
