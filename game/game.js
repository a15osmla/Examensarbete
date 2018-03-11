var ctx, width, height, canvas;
var Game = {};
var Player = {};    
var keys = {};
var filterStrength = 20;
var frameTime = 0, lastLoop = new Date, thisLoop, thisFrameTime;

Game.width = window.innerWidth;
Game.height = window.innerHeight;
Game.fps = 60;
Game.maxFrameSkip = 10;
Game.skipTicks = 1000 / Game.fps;

Player.x = Game.width / 10;
Player.y = Game.height- (Game.height/2);
Player.width = Game.width / 13;
Player.height = Game.height / 2.5;

/* -------------------------------------------------------------------------- */
document.addEventListener("keydown", function (e) {
        keys[e.keyCode] = true;
});

document.addEventListener("keyup", function (e) {
        keys[e.keyCode] = false;
});

/* -------------------------------------------------------------------------- */
Game.drawGFX = function() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(Player.x, Player.y, Player.width, Player.height);
};

/* -------------------------------------------------------------------------- */
Game.initialize = function() {
    canvas = document.getElementById("gamecanvas");
    if (canvas && canvas.getContext) {
        ctx = canvas.getContext("2d");
        canvas.width = Game.width;
        canvas.height = Game.height;
        Game.drawGFX();
    }
};

/* -------------------------------------------------------------------------- */
Game.update = function(tick) {
    Game.tick = tick; 
    Game.input();
   
    thisFrameTime = (thisLoop=new Date) - lastLoop;
    frameTime+= (thisFrameTime - frameTime) / filterStrength;
    lastLoop = thisLoop;
}

/* -------------------------------------------------------------------------- */
Game.input = function() {
    if (keys[68]) {
        Player.x = Player.x+2;
        Game.drawGFX();
    }
    if (keys[65]) {
        Player.x = Player.x-2;
        Game.drawGFX();
    }
}

/* -------------------------------------------------------------------------- */
Game.pause = function() {
   this.paused = (this.paused) ? false : true;
};

Game.run = (function() {
    var loops = 0;
    var nextGameTick = (new Date).getTime();
    var startTime = (new Date).getTime();
    
    return function() {
        loops = 0;
        while (!Game.paused && (new Date).getTime() > nextGameTick && loops < Game.maxFrameSkip) {
            Game.update(nextGameTick - startTime);
            nextGameTick += Game.skipTicks;
            loops++;
        }
    };
})();

/* -------------------------------------------------------------------------- */
(function() {
    var onEachFrame;
    if (window.requestAnimationFrame) {
       onEachFrame = function(cb) {
          var _cb = function() {
                cb();
             requestAnimationFrame(_cb);
          };
          _cb();
       };
    } else if (window.webkitRequestAnimationFrame) {
       onEachFrame = function(cb) {
          var _cb = function() {
             cb();
             webkitRequestAnimationFrame(_cb);
          };
          _cb();
       };
    } else if (window.mozRequestAnimationFrame) {
        onEachFrame = function(cb) {
            var _cb = function() {
                cb();
                mozRequestAnimationFrame(_cb);
            };
            _cb();
        };
    } else {
        onEachFrame = function(cb) {
            setInterval(cb, Game.skipTicks);
        };
    }

    window.onEachFrame = onEachFrame;
})();

/* -------------------------------------------------------------------------- */
setInterval(function(){
  console.log((1000/frameTime).toFixed(1) + " fps");
},1000);