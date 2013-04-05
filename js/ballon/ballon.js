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

    this.lifes = 1;
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

    this.states = [
        
        // Falling down
        {
            name : 'decline',
            onStart : true,
            beforeFn : 'initDecline',
            updateFn : 'updateDecline',
            sprite : {
                frame : 0
            }
        },

        // Flying Up
        {
            name : 'rise',
            beforeFn : 'initRise',
            updateFn : 'updateRise',
            sprite : {
                frame : 1
            }
        },

        // Crashing
        {
            name : 'crashing',
            beforeFn : 'initCrashing',
            updateFn : 'updateCrashing',
            sprite : {
                frame : 0
            }
        },

        // landed
        {
            name : 'landed',
            updateFn : 'updateLanded',
            sprite : {
                frame : 0
            }
        },

        // Dead
        {
            name : 'dead',
            updateFn : 'setDead',
            sprite : {
                frame : 0
            }
        }
    ];

    this.drawFunction = this.drawImage;
    this.registerEvents();

    this.stateManager = new StateManager(this.states);
    this.updateFn = this.stateManager.currentState['updateFn'];
};

Ballon.prototype = new Graphic();

Ballon.prototype.registerEvents = function() {
    var self = this;

    jQuery(GameEngine.canvas).mousedown(function() {
        self.setState.call(self, 'rise');
    });

    jQuery(GameEngine.canvas).mouseup(function() {
        self.setState.call(self, 'decline');
    });

    var ARROW_UP = 38,
        ARROW_DOWN = 40;

    jQuery(document).keydown(function(e) {

        if (e.keyCode === ARROW_UP)
            self.setState.call(self, 'rise');

    });

    jQuery(document).keyup(function(e) {
        self.setState.call(self, 'decline');
    });

    return this;
};

Ballon.prototype.update = function() {

    if (this.doWiggle) {
        this.wiggle();
    }

    // Collided with bottom
    if (this.collideWithBottom() && !this.isUp && !this.isCrashed) {

        this.setState('landed');        
    
    // Collided with top
    } else if (this.collideWithTop() && this.isUp) {
        
        this.cancelWiggle();
        
        return false;
    }
    
    // Update depending on current state
    this[this.updateFn]();
};

Ballon.prototype.updateRise = function() {
    
    if (this.isUp) {
        this.riseUp += this.acceleration;
    }

    this.fly();
};

Ballon.prototype.updateDecline = function() {
    
    if (!this.isUp) {
        
        // Slow down ballon, when falling down and y > 200
        if (this.y > 200) {

            if(this.riseUp < 1.4)
                this.riseUp += 0.04;
        
        }

    }

    this.fly();
};

Ballon.prototype.fly = function() {
    this.doWiggle = true;
    this.y += this.vy * this.gravity - this.riseUp;
};

Ballon.prototype.updateLanded = function() {

    this.cancelWiggle();

    this.x -= this.vx + GameEngine.ENV.speed * 6;

    if (this.leftWorldOnLeft()) {

        this.setState('dead');

    }
};

Ballon.prototype.updateCrashing = function() {

    // Has a crash
    if (this.isCrashed) {
        
        if (this.collideWithBottom()) {
            console.log('now iam dead');
            this.stateManager.change('dead');
            return false;
        }

        this.angle -= 0.1;
        this.vy = 1;
        this.y += this.vy * this.gravity + 2;

    }

};

Ballon.prototype.initCrashing = function() {
    
    this.blockNavigation = true;

    this.initDecline();
    
    this.doWiggle = false;
    this.balancePointY = null;
    this.isCrashed = true;
};

Ballon.prototype.setDead = function() {
    GameEngine.lose();
    GameEngine.stop();
};

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

Ballon.prototype.initRise = function() {

    if (this.blockNavigation) return false;

    this.isUp = true;
    this.riseUp = this.rise;
    this.vy = -1;
    this.wiggleMaxAngle = 10;
    this.wiggleMinAngle = 2;
};

Ballon.prototype.initDecline = function() {
        
    if (this.blockNavigation) return false;

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
        this.setState('crashing');
    }

    this.lastObjectCrash = object;

    if (typeof callback === 'function') {
        callback();
    }
};

Ballon.prototype.selected = function() {
    GameEngine.followObject(this);
};

Ballon.prototype.deselect = function() {
    return;
};