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
<<<<<<< HEAD
})();
=======
})();


        socket.on("connect", function(){
            sessionId = socket.io.engine.id;
        });

        socket.on("dataTest", function(dataz) {
            startDataTest();
            console.log("datatest");
        });
        
        socket.on("testdata", function(dataz) {
            var parsedData = JSON.parse(dataz);
        });
        
        /*
        socket.on("ping", function(dataz) {
            console.log("ping");
            var parsedData = JSON.parse(dataz);
            //var msg = {action:"pong", start: parsedData.start, testdata: parsedData.testdata, idd:otherId};
            var msg = {action:"pong", start: parsedData.start, id:parsedData.id};
            socket.emit("message", JSON.stringify(msg));
        });
        */
        
        socket.on("pong", function(dataz){
            
            var parsedData = JSON.parse(dataz);
            var e = Date.now();
            var ms = (e - parsedData.start);
            //setTimeout (console.log.bind (console, ms));
            var logger = document.getElementById("logger");
            logger.append(ms + "\n");  
            
        });

        socket.on("players", function(data) {
            var parsedData = JSON.parse(data);
            players = parsedData.players;
            
            for(var x = 0; x < players.length; x++) {
                var sid = socket.id;
                if(players[x].pid != sid ) {
                    otherId = players[x].pid;
                    index = player.index; 
                    
                } 
                if(players[x].pid == sid ) {
                    player = players[x];
                    index = player.index;  
                } 
 
                if(animations.length < players.length) {
                    animations.push(new Animation());
                }
                else if(animations.length > players.length) {
                    
                }
            }
        });
        
        socket.on("test", function(datas) {
            var data = JSON.parse(datas);
            var s = data.start;
            var n = Date.now();
            var ms = n - s ;
            
            console.log("s: " + s + " n: " + n);
            console.log(ms);
            
            /*
            var old = localStorage.getItem("ms");
            var news = old + ms + "\n";
            localStorage.setItem("ms", news);
            */
        });

var textFile = null;
  makeTextFile = function (text) {
    var data = new Blob([text], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    return textFile;
  };


  var create = document.getElementById('create');

  create.addEventListener('click', function () {
    var link = document.getElementById('downloadlink');
    link.href = makeTextFile(logger.value);
    link.style.display = 'block';
  }, false);
>>>>>>> d809175e7854f181c182e72f4dd9c50cb25d8931
