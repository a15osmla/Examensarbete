var ctx, width, height, canvas;
var Game = {};
var Player = {};
var keys = {};

Game.width = $(window).width();
Game.height = $(window).height();
Game.fps = 60;
Game.maxFrameSkip = 10;
Game.skipTicks = 1000 / Game.fps;


/* -------------------------------------------------------------------------- */

Game.initialize = function() {
    canvas = document.getElementById("gamecanvas");
    if (canvas && canvas.getContext) {
        ctx = canvas.getContext("2d");
        canvas.width = Game.width;
        canvas.height = Game.height;
    }
};

/* -------------------------------------------------------------------------- */

Game.update = function(tick) {
    Game.tick = tick;
}

/* -------------------------------------------------------------------------- */

Game.draw = function() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();
};

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
        Game.draw();
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