"use strict";

var gameWidth = 1500;
var gameHeight = 700;
var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'my-game', {preload: preload, create: create, update: update});
var platforms;
var player;
var cursors;
var scale = 1;
var playerSize = 44;
var cans;
var goals;
var score = 0;
var sizeText;
var spikes;
var winGoal = 5;
var winCount = 0;
var emitter;
var music;
var goalText;
var speed;
var xspeed;
var yspeed;
var timeText;
var yourtimeText;
var resultText;
var newTime;
var timeHelp = 0;
var plop;
var spedex;
var spedey;
var gameEnd;

function preload() {

  game.load.image("brick", "assets/taso.png");
  game.load.image("background", "assets/tausta.png");
  game.load.spritesheet("green", "assets/droppi.png", 15, 15);
  game.load.spritesheet("red", "assets/maaleja.png", 23, 23);
  game.load.image("spike", "assets/object3.png");
  game.load.spritesheet("hahmo", "assets/hahmo_pieni.png", 23, 23);
  game.load.image("lima1", "assets/lima1.png");
  game.load.image("lima2", "assets/lima2.png");
  game.load.image("lima3", "assets/lima3.png");
  game.load.image("lima4", "assets/lima4.png");
  game.load.image("lima5", "assets/lima5.png");
  game.load.audio('music', 'assets/CDream.ogg');
  game.load.audio('plop', 'assets/plop.wav');

  cursors = game.input.keyboard.createCursorKeys();
}

function create() {
  // Game music
  game.physics.startSystem(Phaser.Physics.ARCADE);
  music = game.add.audio('music');
  plop = game.add.audio('plop');
  music.loop = true;
  music.play();

  // background and platforms
  game.add.tileSprite(0,0, 1500, 700, "background");

  platforms = game.add.group();

  platforms.enableBody = true;

  var ground = platforms.create(-100, 636, "brick");
  ground.scale.setTo(14,2);
  ground.body.immovable = true;

  var ledge = null;

  ledge = platforms.create(-150, 250, "brick");
  ledge.body.immovable =true;
  ledge = platforms.create(150, 400, "brick");
  ledge.body.immovable =true;
  ledge = platforms.create(850, 450, "brick");
  ledge.body.immovable =true;
  ledge = platforms.create(600, 550, "brick");
  ledge.body.immovable =true;
  ledge = platforms.create(950, 300, "brick");
  ledge.body.immovable =true;
  ledge = platforms.create(1200, 240, "brick");
  ledge.body.immovable =true;
  ledge = platforms.create(400, 500, "brick");
  ledge.body.immovable =true;
  ledge = platforms.create(300, 250, "brick");
  ledge.body.immovable =true;
  ledge = platforms.create(500, 200, "brick");
  ledge.body.immovable =true;

  // player is created using a fuction
  playerCreate();

  // cans in the game are collectible small black dots
  cans = game.add.group();
  cans.enableBody = true;

  // collectible creation
  // give them random speed
	for(var i = 0; i < (gameWidth / 70); i++) {
		var can = cans.create(i*70, 0, "green");
    can.physicsBodyType = Phaser.Physics.ARCADE;
		speed = 100;
		xspeed = game.rnd.integerInRange(-speed, speed);
		yspeed = game.rnd.integerInRange(-speed, speed);
    while (xspeed === 0) {
      xspeed = game.rnd.integerInRange(-speed, speed);
    };
    while (yspeed === 0) {
      yspeed = game.rnd.integerInRange(-speed, speed);
    };

	  game.physics.arcade.enable(can);
  	can.body.velocity.x = xspeed;
  	can.body.velocity.y =yspeed;
    can.body.bounce.set(1)
  	can.body.collideWorldBounds = true;
    can.body.maxVelocity.x= speed;
    can.body.maxVelocity.y= speed;
  }

  // Goals creation (red circles)
  goals = game.add.group();
  goals.enableBody = true;

  var goal = null;
  // moon
  goal = goals.create(85,235, "red");
  goal.wantedSize = 1.4;
  goal.scale.setTo(goal.wantedSize);
  // eye
  goal = goals.create(475,460, "red");
  goal.wantedSize = 2;
  goal.scale.setTo(goal.wantedSize);
  // fisheye
  goal = goals.create(220,135, "red");
  goal.wantedSize = 1.2;
  goal.scale.setTo(goal.wantedSize);
  // flower
  goal = goals.create(1005,205, "red");
  goal.wantedSize = 1.5;
  goal.scale.setTo(goal.wantedSize);
  // nine
  goal = goals.create(1349,62, "red");
  goal.wantedSize = 1.0;
  goal.scale.setTo(goal.wantedSize);

  // Game texts
  sizeText = game.add.text(5,20, "Your size: 1.0" , {fontSize: "32px;", fill: "red"});
  goalText = game.add.text(gameHeight,20, "Places to go: 5" , {fontSize: "50px;", fill: "red"});
  timeText = game.add.text(gameHeight,100, "Elapsed time: " + timeHelp + " seconds", {fontSize: "50px;", fill: "red"});

  if (myVue.scores.length !== 0) {
    resultText = game.add.text(gameHeight,200, "High score: " + myVue.scores[0].points, {fontSize: "50px;", fill: "red"});
  } else {
    resultText = game.add.text(gameHeight,200, "", {fontSize: "50px;", fill: "red"});
  }

  // Barrel slime emitter #1 (behind)
  emitter = game.add.emitter(1230, 560);
  emitter.width = 50;
  emitter.makeParticles(["lima1","lima2","lima3","lima4","lima5"]);
  emitter.start(false, 500, 200);

  // Spike(actually barrel) creation
  spikes = game.add.group();
  spikes.enableBody=true;

  var spike = spikes.create(1200,560, "spike");
  spike.body.immovable = true;
  spike.scale.setTo(1);
  spike.body.immovable =true;

  // Barrel slime emitter #2 (front)
  emitter = game.add.emitter(1230, 560);
  emitter.width = 50;
  emitter.makeParticles(["lima1","lima2","lima3","lima4","lima5"]);
  emitter.start(false, 500, 200);

  // Fullscreen mode
  game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.refresh();

  game.input.onDown.add(gofull, this);

}


function update() {

  // Make Chat and Scoreboard "real-time" with every ten second updates
  if (Math.floor(this.game.time.totalElapsedSeconds()) !== timeHelp) {
    timeHelp = Math.floor(this.game.time.totalElapsedSeconds())
    if (timeHelp % 10 === 0) {
      myVue.getThings();
      myVue.getScores();
    }
    timeText.text = "Elapsed time: " + timeHelp + " seconds";
  }

  game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(cans, platforms);
  game.physics.arcade.overlap(player, cans, collectCan, null, this);
  game.physics.arcade.overlap(player, goals, collectGoal, null, this);
  game.physics.arcade.collide(player, spikes, takeDamage, null, this);

  // Loop through collectibles and give them random acceleration (make them wander aimlessly)
  for (var i = 0, len = cans.children.length; i < len; i++) {
    cans.children[i].body.acceleration.x = game.rnd.integerInRange(-1000, 1000);
    cans.children[i].body.acceleration.y = game.rnd.integerInRange(-1000, 1000);
  }

  // Player controls using acceleration
  if (player.body.velocity.x < 0) {
    player.body.acceleration.x = 200;
  } else if(player.body.velocity.x > 0) {
    player.body.acceleration.x = -200;
  }
  if(cursors.left.isDown) {
    player.body.acceleration.x = -300;
    player.animations.play("left");
  }
  else if(cursors.right.isDown) {
    player.body.acceleration.x = 300;
    player.animations.play("right");
  }
  else {
    player.animations.stop();
    player.frame = 4;
  }
  if(cursors.up.isDown && player.body.touching.down) {
    player.body.velocity.y = -400;
  }
}

// Collecting dots scales up the player
// Scaling ruins player velocities, so player speed needs to be saved and body reset
function collectCan(player, can) {
	  spedex = player.body.velocity.x;
	  spedey = player.body.velocity.y;
    score +=5;
    scale += .1;
    playerSize = 44*scale;
    player.scale.setTo(scale);
    player.body.setSize(23,23);
    player.body.reset(player.x, player.y);
  	player.body.velocity.x = spedex;
  	player.body.velocity.y = spedey;
    can.destroy();
    // sound
    plop.play();
    sizeText.text = "Your size: " + scale.toFixed(1);
}

// Collecting a goal if scale matches
// I think wantedSize may be an unnecessary custom property, could just use scale
function collectGoal(player, goal) {
  if (scale.toFixed(1) == goal.wantedSize) {
    // player.x=85;
    // player.y=230;
    player.destroy();
    // Filling the goal with "done"
    var done = game.add.sprite(goal.world.x, goal.world.y, "hahmo");
    done.scale.setTo(goal.wantedSize);
    goal.destroy();
    plop.play();
    // counter for ending the game
    winCount += 1;
    if (winCount >= winGoal) {
      gameEnd = game.add.text(gameWidth/15, gameHeight / 2, "YOU WON!", {font: 'bold 50pt Arial' , fill: "#fff"});

      // // Using localstorage to save a high score
      // if (parseInt(window.localStorage.getItem( 'BallgameHighscore' )) > Math.floor(this.game.time.totalElapsedSeconds()) || window.localStorage.getItem( 'BallgameHighscore' )===null) {
      //   window.localStorage.setItem( 'BallgameHighscore', Math.floor(this.game.time.totalElapsedSeconds()));
      //   resultText.text = "High score: " + window.localStorage.getItem( 'BallgameHighscore' );
      //   gameEnd.text = "YOU WON! NEW HIGH SCORE!";
      // }else{
      //   // Nothing
      // }

      // Using database
      newTime = timeHelp;
      if (myVue.scores.length === 0 || myVue.scores[0].points > newTime) {
        resultText.text = "High score: " + newTime;
        gameEnd.text = "YOU WON! NEW HIGH SCORE!";
      }else{
        for (let i=1; i<myVue.scores.length; i++) {
          if (myVue.scores[i].points > newTime) {
            gameEnd.text = "YOU MADE IT TO THE SCOREBOARD!";
          }
        }

      }
      myVue.addScore(newTime);
      yourtimeText = game.add.text(gameHeight,150, "Your time: " + timeHelp + " seconds", {fontSize: "50px;", fill: "red"});
    } else {
      // Create a new player and continue collecting goals
      playerCreate();
      sizeText.text = "Your size: " + scale.toFixed(1);
      goalText.text = "Places to go: " + (winGoal-winCount);

    }
  }
}

// Creating a player to a random location
function playerCreate(){
  player = game.add.sprite(10+Math.random()*1490, 10, 'hahmo');
  game.physics.arcade.enable(player);
  player.body.gravity.y = 500;
  player.body.collideWorldBounds = true;
  player.animations.add("right", null, 7, true);
  player.animations.add("left", [4,3,2,1,0], 7, true);
  player.anchor.x = 0.5;
  player.anchor.y = 1;
  player.body.maxVelocity.x= 200;
  scale = 1;
}


// Hitting the barrel
function takeDamage(player) {
  // We don't want to be too small
  if (scale > 0.8) {
    // Scale the player down
    plop.play();
    scale -= .1;
    playerSize = 44*scale;
    player.scale.setTo(scale);
    player.body.setSize(23,23);
    player.body.reset(player.x, player.y)
    // Create a new can because we just lost one
    // This could be made a function
    var can = cans.create(10+Math.random()*1490, 0, "green");
    can.physicsBodyType = Phaser.Physics.ARCADE;
		speed = 100;
		xspeed = game.rnd.integerInRange(-speed, speed);
		yspeed = game.rnd.integerInRange(-speed, speed);
    while (xspeed === 0) {
      xspeed = game.rnd.integerInRange(-speed, speed);
    };
    while (yspeed === 0) {
      yspeed = game.rnd.integerInRange(-speed, speed);
    };
	  game.physics.arcade.enable(can);
  	can.body.velocity.x = xspeed;
  	can.body.velocity.y =yspeed;
    can.body.bounce.set(1)
  	can.body.collideWorldBounds = true;
    can.body.maxVelocity.x= speed;
    can.body.maxVelocity.y= speed;
  }

  // Barrel gives player a kick
  player.body.velocity.y = -200;
  if(player.body.touching.right) {
    player.body.velocity.x = -200;
  }else if(player.body.touching.left) {
    player.body.velocity.x = 200;
  }

  sizeText.text = "Your size: " + scale.toFixed(1);
}

// Fullscreen function
function gofull() {
  if (!game.scale.isFullScreen) {
    game.scale.startFullScreen(false);
  }
}
