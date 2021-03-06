/*Vytvoření proměnných*/
let canvas, ship, shipImage, asteroid1Image, asteroid2Image,scrapImage, laserShotImage;
let time = 0;
let asteroids = [];
let rockets = [];
let scrap = [];
let damage = 1;
let hits = 0;
let asteroidsLeft = 50;
let ammo = 40;
let maxAmmo = 30;
let angle = 0;
let timeAlive = 0;
let hp = 3;
/*Tyhle funkle se postarají o obnovování nábojů a přidávání časů*/
function naboje() {
  if (ammo < maxAmmo && ammo != 30){
  ammo++;
  }
}

setInterval(function () {
  naboje()
}, 50);

function timeAliveShip (){
 timeAlive + 1;
 
}

setInterval(function () {
  timeAlive++;
}, 1000);

function preload() {
  shipImage = loadImage("img/ufo.png");
  asteroid1Image = loadImage("img/asteroid1.png");
  asteroid2Image = loadImage("img/asteroid2.jpg");
  backgroundImage = loadImage("img/background.png");
  laserShotImage = loadImage("img/lasershot.png");
  scrapImage = loadImage("img/scrap.png");
}
/*Třída pro Nakreslení/Ovládání/Kolize vesmírné lodi*/
class SpaceShip {
  constructor(posX, posY) {
    this.x = posX;
    this.y = posY;
    this.w = 50;
    this.h = 50;
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
    if (keyIsDown(32) && ammo > 0) {
      if (time % (10 + round(damage / 10)) == 0)
        rockets.push(new Rocket(this.x + this.w / 2, this.y + this.h / 2, this.angle));
       ammo-- ;
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
  detectCollision(scrap) {
    return collideRectRect(
      this.x,
      this.y,
      this.w,
      this.h,
      scrap.x,
      scrap.y,
      scrap.size,
      scrap.size
    );
  }

  draw() {
    this.move();
    push();
    translate(this.x , this.y);
    image(shipImage, -45, 0, 50, 50);
    pop();
  }
}
/*Třída pro Nakreslení/Pohyb/Kolize scrapu který přidá 1 život*/
class Scrap {
  constructor() {
    this.size = 40;
    this.y = random(0,200);
    this.x = -100;
    this.speed = random(2, 4);
    this.angle = random(0, 359);
  }
  move() {
    this.x += this.speed;
    this.y == this.speed;
    this.angle += this.speed;
  }
  draw() {
    this.move();
    push();
    translate(this.x - this.size / 2, this.y + this.size / 2);
    rotate(((2 * PI) / 360) * this.angle);
    image(scrapImage, -this.size / 2, - this.size / 2, this.size, this.size);
    pop();
  }
}
/*Třída pro Nakreslení/Pohyb/Kolize asteroidů které odeberou 1 život*/
class Asteroid {
  constructor() {
    this.size = 40;
    this.y = random(0,200);
    this.x = -100;
    this.speed = random(2, 4);
    this.angle = random(0, 359);
  }
  asteroidHeigh() {
    setInterval(function(){
      this.y += random (-10,10);
    }, 10);
  }
  move() {
    this.x += this.speed;
    this.y == this.speed;
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
    image(asteroid1Image, -this.size / 2, - this.size / 2, this.size, this.size);
    this.asteroidHeigh();
    pop();
  }
}
/*Třída pro Nakreslení/Pohyb/Kolize raketek které jsou vystřeleny z vesmírné lodě a ničí asteroidy*/
class Rocket {
  constructor(x, y, angle) {
    this.size = 5;
    this.y = y;
    this.x = x-20;
    this.angle = angle - 180;
    this.speed = 5;
  }

  move() {
    this.x += this.speed * Math.cos((this.angle * Math.PI) / 180);
    this.y += this.speed * Math.sin((this.angle * Math.PI) / 180);
  }

  draw() {
    this.move();
    push();
    translate(this.x-40 , this.y);
    image(laserShotImage, 0, -2, 40, 5);
    pop();
  }
}
/*Tahle funkce ukazuje a napozicuje všechny důležité informace*/
function statusBar() {
  fill(color(30, 30, 30, 127));
  rect(0, height - 40, width, 40);
  strokeWeight(0);
  textSize(20);
  textStyle(BOLD);
  fill(color(200));
  
  text(`Asteroids Left: ${asteroidsLeft}`, 400, height - 15);
  text(`HP: ${hp} `, 50, height - 15);
  text(`Ammo: ${Math.round(ammo / 6.5)} `, 200, height - 15);
  text(`Time Alive: ${timeAlive} seconds`, 700, height - 15);
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
/*Funkce vykreslí všechny obrázky*/
function draw() {
  time++;
  background(backgroundImage);
  ship.draw();

  if (time % 30 == 0) {
    asteroids.push(new Asteroid());
  }
  /*Zajišťuje aby se každých 15 vteřin objevil scrap který přidá 1 život*/
  if (time % 60 == 0 && timeAlive == 15 || time % 60 == 0 && timeAlive == 30 || time % 60 == 0 && timeAlive == 45) {
    scrap.push(new Scrap());
    
  }
  /*Co se stane když asteroid narazí do vesmírné lodi*/
  asteroids.forEach(function (asteroid, index, array) {
    asteroid.draw();
    if (ship.detectCollision(asteroid)) {
      damage += asteroid.size;
      hp--;
      array.splice(index, 1);
    }

    if (asteroid.y > height) {
      array.splice(index, 1);
    }
/*Co se stane když raketa narazí do asteroidu*/
    rockets.forEach(function (rocket, idx, arr) {
      if (asteroid.detectCollision(rocket)) {
        hits++;
        asteroidsLeft--;
        array.splice(index, 1);
        arr.splice(idx, 1);
      }
    });
  });
/*Co se stane když vesmírná loď narazí do scrapu*/
  scrap.forEach(function(scrap,index1,array1){
    scrap.draw();
    if (ship.detectCollision(scrap)){
      array1.splice(index1, 1);
      hp++;
    }
  })

  rockets.forEach(function (rocket, idx, arr) {
    rocket.draw();
    if (
      rocket.y > height || rocket.y < 0 || rocket.x < 0 || rocket.x > width
    ) {
      arr.splice(idx, 1);
    }
  });
  /*Co se objeví když hráč prohraje/vyhraje*/
  if (round(hp) < 1) {
    noLoop();
    background(100, 0, 0, 200);
    textSize(50);
    fill(255, 0, 0, 200);
    text('GAME OVER', width / 2 - 150, height / 2);
    damage = 0;
    statusBar();
  } else {
    statusBar();
  }
  if (asteroidsLeft == 0 || timeAlive == 60) {
    noLoop();
    background(100, 215, 84, 200);
    textSize(50);
    fill(35, 110, 25, 200);
    text('YOU WON', width / 2 - 135, height / 2);

    statusBar();
  }
}
