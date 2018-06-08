socket.on("players", function (data) {
    var parsedData = JSON.parse(data);
    players = parsedData.players;
    lastRecievedUpdate = Date.now();
    for (var x = 0; x < players.length; x++) {
        var sid = socket.id;
        if (players[x].pid != sid) {
            otherId = players[x].pid;
            index = player.index;
        }
        if (players[x].pid == sid) {
            player = players[x];
            index = player.index;
        }

        if (animations.length < players.length) {
            animations.push(new Animation());
        } 
    }
});

/* -------------------------------------------------------------------------- */
Game.fps = 60;
Game.maxFrameSkip = 10;
Game.skipTicks = 1000 / Game.fps;

/* -------------------------------------------------------------------------- */
Game.drawGFX = function () {
    Game.drawWorld();
    Game.drawPlayer();
    Game.drawUI();
    //Game.draw FPS(); 
};

/* -------------------------------------------------------------------------- */
Game.pause = function () {
    this.paused = (this.paused) ? false : true;
};

Game.update = function (tick) {
    Game.tick = tick;
    Game.drawGFX();
    Game.input();
}

/* -------------------------------------------------------------------------- */

resize = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

window.addEventListener("resize", resize);

/* -------------------------------------------------------------------------- */
Game.initialize = function () {
    sprite_sheet.image.src = "/img/spritesheet.png";
    canvas = document.getElementById("gamecanvas");

    if (canvas && canvas.getContext) {
        animation = new Animation();
        ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
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

/* -------------------------------------------------------------------------- */
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