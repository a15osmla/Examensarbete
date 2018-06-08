function runGame() {
    Game.initialize();
    window.onEachFrame(Game.run);
}

function Player(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.orgSpeed = speed;
    this.grounded = false;
    this.jumping = false;
    this.blocking = false;
    this.velY = 0;
    this.velX = 0;
    this.startY = y;
    this.gravity = speed / 2;
    this.hp = 100;
    this.animate = new Animation();
    this.moving = function (dir) {
        if (dir == "right") {
            this.x = this.x + this.speed;
        } else if (dir == "left") {
            this.x = this.x - this.speed;
        }
    }
}
var p1 = new Player(0.01, 0.6, 0.15, 0.35, 0.004);
var p2 = new Player(0.80, 0.6, 0.15, 0.35, 0.004);

players.push(p1);
players.push(p2);

Game.fps = 60;
Game.maxFrameSkip = 10;
Game.skipTicks = 1000 / Game.fps;
Game.oldTick;

/* -------------------------------------------------------------------------- */
Game.drawGFX = function () {
    Game.drawWorld();
    Game.drawPlayers();
    Game.drawUI();
    Game.drawFPS();
};

/* -------------------------------------------------------------------------- */
Game.initialize = function () {
    sprite_sheet.image.src = "img/spritesheet.png";
    canvas = document.getElementById("gamecanvas");

    if (canvas && canvas.getContext) {
        ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
};
/* -------------------------------------------------------------------------- */
Game.update = function (tick) {
    Game.tick = tick;
    Game.input();
    Game.drawGFX();
    thisFrameTime = (thisLoop = new Date) - lastLoop;
    frameTime += (thisFrameTime - frameTime) / filterStrength;
    lastLoop = thisLoop;
}

/* -------------------------------------------------------------------------- */

Game.pause = function () {
    this.paused = (this.paused) ? false : true;
};

/* -------------------------------------------------------------------------- */
Game.run = (function () {
    var loops = 0;
    var nextGameTick = (new Date).getTime();
    var startTime = (new Date).getTime();

    return function () {
        loops = 0;
        while (!Game.paused && (new Date).getTime() > nextGameTick && loops < Game.maxFrameSkip) {
            Game.update(nextGameTick - startTime);
            nextGameTick += Game.skipTicks;
            loops++;
        }
    };
})();

(function () {
    var onEachFrame;
    if (window.requestAnimationFrame) {
        onEachFrame = function (cb) {
            var _cb = function () {
                cb();
                requestAnimationFrame(_cb);
            };
            _cb();
        };
    } else if (window.webkitRequestAnimationFrame) {
        onEachFrame = function (cb) {
            var _cb = function () {
                cb();
                webkitRequestAnimationFrame(_cb);
            };
            _cb();
        };
    } else if (window.mozRequestAnimationFrame) {
        onEachFrame = function (cb) {
            var _cb = function () {
                cb();
                mozRequestAnimationFrame(_cb);
            };
            _cb();
        };
    } else {
        onEachFrame = function (cb) {
            setInterval(cb, Game.skipTicks);
        };
    }

    window.onEachFrame = onEachFrame;
})();
