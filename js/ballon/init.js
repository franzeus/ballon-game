$(document).ready(function() {

  var debug = false;

  GameEngine.init('canvas', debug);
  GameEngine.maxFollowY = -86;
  GameEngine.scale = 1;

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
    x : 700,
    y : 340,
    vx : -1
  });

  var parallaxOffsetY = -86;

  var parallax1 = new ParallaxPlain({
    x: 0,
    y: parallaxOffsetY,
    width: 960,
    height: 480,
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
  GameEngine.objectManager.addObject(parallax2);

  GameEngine.objectManager.addObject(ballon);
  
  GameEngine.objectManager.addObject(obstacle1);
  GameEngine.objectManager.addObject(obstacle2);
  GameEngine.objectManager.addObject(obstacleLinear);

  //
  //GameEngine.followObject(ballon);

  //jQuery('#parallaxFrame').addClass('parallaxAnimation');
  
  // Start game
  GameEngine.start();
});