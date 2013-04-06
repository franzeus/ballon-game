var Highscore = {
  
  score: 0,
  wrapperObj: null,
  scoreObj: null,
  scoreTimeout : null,
  isStop : false,

  init : function() {
    
    this.wrapperObj = jQuery("#highscore");
    this.scoreObj = jQuery('#highscore #score');
    
    
  },

  reset : function() {
    this.isStop = false;
    this.score = 0;
    this.updateScoreElement();
  },

  start : function() {

    var self = this;

    if (this.isStop) {
        return false;
    }
    
    this.scoreTimeout = setTimeout(function() {

        self.addPoint(1);
        self.updateScoreElement();
        self.isStop = false;
        self.start();

    }, 100);

  },

  stop : function() {
    clearTimeout(this.scoreTimeout);
    this.isStop = true;
  },

  addPoint : function(_value) {
    
    if(!_value || _value < 0) return false;
    
    this.score += _value;

  },

  updateScoreElement : function() {
    this.scoreObj.html(this.score);
  },

  hasLocalStorage : function() {

    if (!window.localStorage)
      return false
    
    return true;
  }

};