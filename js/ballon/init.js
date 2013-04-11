$(document).ready(function() {

  var debug = true;

  GameEngine.init('canvas', debug);
  GameEngine.maxFollowY = -86;
  GameEngine.scale = 1;

  Highscore.init();

  var ballon = new Ballon({
  	x : 200,
  	y : 100
  });

  var obstacle1 = new ObstacleBee({
    x : 500,
    y : 100
  });

  var obstacle2 = new ObstacleSinus({
    x : 500,
    y : 300,
    vy : 1
  });

  var obstacleLinear = new ObstacleLinear({
    x : 900,
    y : 340,
    vx : -1,
    width: 60
  });

  var cow = new ObstacleLinear({
    x : 700,
    y : 340,
    width: 40,
    height: 30,
    img: {
      src : 'assets/cow.gif'
    }
  });

  var cow2 = new ObstacleCow({
    x : 560,
    y : 340
  });

  var parallaxOffsetY = -86;

  var parallax1 = new ParallaxPlain({
    x: 0,
    y: parallaxOffsetY,
    width: 960,
    height: 390,
    vx: 1,
    src: 'assets/parallax_background.jpg'
  });

  var parallax2 = new ParallaxPlain({
    x: World.width + (960 - World.width),
    y: parallaxOffsetY,
    width: 960,
    height: 480,
    vx: 1,
    src: 'assets/parallax_background.jpg'
  });

  // Add objects
  GameEngine.objectManager.addObject(parallax1);
  //GameEngine.objectManager.addObject(parallax2);

  GameEngine.objectManager.addObject(ballon);
  
  GameEngine.objectManager.addObject(obstacle1);
  GameEngine.objectManager.addObject(obstacle2);
  //GameEngine.objectManager.addObject(obstacleLinear);
  GameEngine.objectManager.addObject(cow2);
  //GameEngine.objectManager.addObject(cow2);
  //
  //GameEngine.followObject(ballon, 'x');

  //jQuery('#parallaxFrame').addClass('parallaxAnimation');
  
  // Start game
  GameEngine.start();
  Highscore.start();

  GameEngine.onLose = function() {
    Highscore.stop();
  };
  
});