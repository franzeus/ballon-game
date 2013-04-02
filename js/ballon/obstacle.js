var Obstacle = function(_options) {

    Graphic.apply(this, arguments);

    this.type = 'obstacle';

    this.width = 30;
    this.height = 30;

    this.color = getRandomColor();

    this.vx = -1;
    this.vy = 0;
    this.rotateToDirection = true;

    this.acceleration = 0.04;
    this.speed = 2;

    this.boundingBox = {
        offsetX : 5,
        offsetY : 5,
        width : this.width,
        height : this.height,
        color : '#00FF00'
    };
};

Obstacle.prototype = new Graphic();

Obstacle.prototype.update = function() {

    // Out of World left
    if (this.leftWorldOnLeft()) {

        this.x = World.width;
        this.y = this.initY;
        this.speed = 1;
        this.acceleration = 0.04;
        this.isVisible = true;

        return false;
    
    } else {
        
        if (this.acceleration <= this.maxAcceleration) {
            this.speed += this.acceleration;
        }

        this.x += this.vx * this.speed;
        this.y = sinMove(this.x, this.y, 3);  
    }
};

Obstacle.prototype.hasCollidedWith = function(object, callback) {
    
    if( object.type === 'ballon') {
        this.isVisible = false;
    }

};