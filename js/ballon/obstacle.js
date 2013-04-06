// Obstacle Base Object
var Obstacle = function(_options) {

    Graphic.apply(this, arguments);

    this.type = 'obstacle';

    this.vx = -1;
    this.vy = 0;
   
    this.color = getRandomColor();
    this.rotateToDirection = true;
    
    this.boundingBox = {
        offsetX : 5,
        offsetY : 5,
        width : this.width,
        height : this.height,
        color : '#00FF00'
    };
};

Obstacle.prototype = new Graphic();

Obstacle.prototype.reset = function() {
    return;
};

Obstacle.prototype.update = function() {

    // Out of World left
    if (this.leftWorldOnLeft()) {

        this.x = World.width;
        this.y = this.initY;
        this.isVisible = true;

        this.reset();
    
    } else {
        this.updateFn();
    }

};

Obstacle.prototype.updateSinus = function() {

    if (this.acceleration <= this.maxAcceleration) {
        this.speed += this.acceleration;
    }

    this.x += this.vx * this.speed;
    this.y = sinMove(this.x, this.y, 3);
};

Obstacle.prototype.updateCircular = function() {

    this.moveX -= GameEngine.ENV.speed * 6;

    this.x = this.moveX + Math.cos(this.moveAngle) * this.radX;
    this.y = this.moveY + Math.sin(this.moveAngle) * this.radY;

    this.moveAngle += this.orbitSpeed;
};

Obstacle.prototype.updateLinear = function() {
    this.x += this.vx * (this.speed + this.acceleration);
};

Obstacle.prototype.hasCollidedWith = function(object, callback) {
    
    if( object.type === 'ballon') {
        this.isVisible = false;
    }

};

// ---------------------------------------
// Linear moving Obstacle
var ObstacleLinear = function(_options) {
    
    Obstacle.apply(this, arguments);

    this.width = 30;
    this.height = 10;

    this.acceleration = 0.04;
    this.speedMultiplikator = 20;
    this.speed = GameEngine.ENV.speed * this.speedMultiplikator;

    this.updateFn = this.updateLinear;
};
ObstacleLinear.prototype = new Obstacle();

ObstacleLinear.prototype.reset = function() {
    this.speed = GameEngine.ENV.speed * this.speedMultiplikator;
    this.acceleration = 0.04;
};

// ---------------------------------------
// Sinus moving Obstacle
var ObstacleSinus = function(_options) {
    
    Obstacle.apply(this, arguments);

    this.width = 30;
    this.height = 30;

    this.acceleration = 0.04;
    this.speed = 2;

    this.updateFn = this.updateSinus;
};
ObstacleSinus.prototype = new Obstacle();

ObstacleSinus.prototype.reset = function() {
    this.speed = 2;
    this.acceleration = 0.04;
};

// ---------------------------------------
// Circular moving Obstacle
var ObstacleBee = function(_options) {
    
    Obstacle.apply(this, arguments);

    this.width = 20;
    this.height = 20;

    this.rotateToDirection = true;

    this.acceleration = 0.04;
    this.speed = 2;

    this.radX = parseInt(this.width * 2);
    this.radY = parseInt(this.width * 2);
    this.moveAngle = 0;
    this.orbitSpeed = 0.08;
    this.offsetY = 0;
    this.offsetX = 0;

    this.moveX = this.x;
    this.moveY = this.y;

    this.updateFn = this.updateCircular;
};
ObstacleBee.prototype = new Obstacle();

ObstacleBee.prototype.reset = function() {
    this.moveX = this.x;
    this.moveY = this.initY;
};

