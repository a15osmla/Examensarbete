Game.fps = 60;
Game.maxFrameSkip = 10;
Game.skipTicks = 1000 / Game.fps;
Game.oldTick;

/* -------------------------------------------------------------------------- */
Game.drawGFX = function () {
    Game.drawWorld();
    Game.drawPlayer();
    Game.drawUI();
    //Game.drawFPS();
};

/* -------------------------------------------------------------------------- */
resize = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

window.addEventListener("resize", resize);

/* -------------------------------------------------------------------------- */
Game.initialize = function () {
    sprite_sheet.image.src = "img/spritesheet.png";
    canvas = document.getElementById("gamecanvas");

    if (canvas && canvas.getContext) {
        animation = new Animation();
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
