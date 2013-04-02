// ----------------------------------
var Ballon = function(_options) {

    Graphic.apply(this, arguments);

    this.type = 'ballon';

    this.width = 31;
    this.height = 60;

    this.src = 'assets/balloon_sprite.png';
    this.img = new Image();
    this.img.src = this.src;
    this.currentFrame = 0;
    this.frames = 1;
    this.interval = 0;

    this.vx = 0;
    this.vy = 1;
    this.angle = degreeToRadian(0);

    this.isUp = false;
    this.rise = 1;
    this.riseUp = 0;
    this.gravity = 2;
    this.acceleration = 0.02;

    this.doWiggle = true;
    this.wiggleDirection = 1;
    this.wiggleAngleSpeed = degreeToRadian(0.3);
    this.wiggleMaxAngle = 1;
    this.wiggleMinAngle = -1;

    this.lifes = 3;
    this.isCrashed = false;
    this.blockNavigation = false;
    this.lastObjectCrash = null;

    this.boundingBox = {
        offsetX : 5,
        offsetY : 5,
        width : this.width,
        height : this.height,
        color : '#00FF00'
    };

    this.drawFunction = this.drawImage;
    this.registerEvents();
};

Ballon.prototype = new Graphic();

Ballon.prototype.registerEvents = function() {
    var self = this;

    jQuery(GameEngine.canvas).mousedown(function() {
        self.setDirectionUp.call(self);
    });

    jQuery(GameEngine.canvas).mouseup(function() {
        self.setRelease.call(self);
    });

    var ARROW_UP = 38,
        ARROW_DOWN = 40;

    jQuery(document).keydown(function(e) {

        if (e.keyCode === ARROW_UP)
            self.setDirectionUp.call(self);

    });

    jQuery(document).keyup(function(e) {
        self.setRelease.call(self);
    });

    return this;
};

Ballon.prototype.update = function() {

    // Has a crash
    if (this.isCrashed) {
        this.updateCrash();
        return false;
    }

    if (this.doWiggle) {
        this.wiggle();
    }

    // Collided with bottom
    if (this.collideWithBottom() && !this.isUp) {
        this.cancelWiggle();

        this.x -= this.vx + GameEngine.ENV.speed * 6;

        if (this.leftWorldOnLeft()) {

            GameEngine.stop();

        }

        return false;
    
    // Collided with top
    } else if (this.collideWithTop() && this.isUp) {
        this.cancelWiggle();
        return false;

    // Apply gravity
    } else {
        this.doWiggle = true;
        this.y += this.vy * this.gravity - this.riseUp;
    
    }

    // Flying up
    if (this.isUp) {
        this.riseUp += this.acceleration;
    
    // Flying down
    } else {

        // Slow down ballon, when falling down and y > 200
        if (this.y > 200) {

            if(this.riseUp < 1.4)
                this.riseUp += 0.04;
        
        }
    }

}

Ballon.prototype.wiggle = function() {

    this.balancePointY = this.y + 10;

    var currentAngleInDegree = Math.round(radionToDegree(this.angle));
    
    if (currentAngleInDegree > this.wiggleMaxAngle) {
        this.wiggleDirection = -1;
    } else if( currentAngleInDegree < this.wiggleMinAngle) {
        this.wiggleDirection = 1;
    }

    this.angle += this.wiggleAngleSpeed * this.wiggleDirection;
};

Ballon.prototype.cancelWiggle = function() {
    this.balancePointY = null;
    this.doWiggle = false;
};

Ballon.prototype.setDirectionUp = function() {

    if (this.blockNavigation) return false;
    
    this.currentFrame = 1;
    this.isUp = true;
    this.riseUp = this.rise;
    this.vy = -1;
    this.wiggleMaxAngle = 10;
    this.wiggleMinAngle = 2;
};

Ballon.prototype.setRelease = function() {
        
    if (this.blockNavigation) return false;

    this.currentFrame = 0;
    this.riseUp = 0;
    this.vy = 1;
    this.isUp = false;
    this.wiggleMaxAngle = 1;
    this.wiggleMinAngle = -2;
};

Ballon.prototype.hasCollidedWith = function(object, callback) {

    // Not already crashed
    if (this.isCrashed) return false;

    if (this.lastObjectCrash === object) {
        return false;
    }

    this.lifes--;

    if (this.lifes <= 0) {
        this.initCrashing();
    }

    this.lastObjectCrash = object;

    if (typeof callback === 'function') {
        callback();
    }
};

Ballon.prototype.initCrashing = function() {
    this.setRelease();
    this.doWiggle = false;
    this.balancePointY = null;
    this.isCrashed = true;
    this.blockNavigation = true;
};

Ballon.prototype.updateCrash = function() {

    if (this.collideWithBottom()) {
        GameEngine.lose();
        GameEngine.stop();
        return false;
    }

    this.angle -= 0.1;
    this.vy = 1;
    this.y += this.vy * this.gravity + 2;
};

Ballon.prototype.selected = function() {
    GameEngine.followObject(this);
};

Ballon.prototype.deselect = function() {
    return;
};
