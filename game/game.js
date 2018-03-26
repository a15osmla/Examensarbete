var ctx, width, height, canvas;
var Game = {};  
var keys = {};
var filterStrength = 20;
var frameTime = 0, lastLoop = new Date, thisLoop, thisFrameTime;

Game.width = window.innerWidth;
Game.height = window.innerHeight;
Game.fps = 60;
Game.maxFrameSkip = 10;
Game.skipTicks = 1000 / Game.fps;

function Player(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.grounded = false;
    this.jumping = false;
    this.velY = 8;
    this.velX = 8;
    this.startY = y;
    this.gravity = 0.1;
    this.moving = function(dir) {
        if(dir == "right") {
            this.x = this.x+this.speed;
        } 
        else if(dir == "left") {
            this.x = this.x-this.speed;
        } 
    }
}

var p1 = new Player(Game.width * 0.2, Game.height * 0.5, Game.width * 0.1, Game.height * 0.4, 5);
var p2 = new Player(Game.width * 0.8, Game.height * 0.5, Game.width * 0.1, Game.height * 0.4, 5);

/* -------------------------------------------------------------------------- */
document.addEventListener("keydown", function (e) {
        keys[e.keyCode] = true;
});

document.addEventListener("keyup", function (e) {
        keys[e.keyCode] = false;
});

/* -------------------------------------------------------------------------- */
Game.drawGFX = function() {    
    ctx.fillStyle = "green";
    ctx.fillRect(0, canvas.height * 0.8, canvas.width, canvas.height*0.9);
    
    ctx.fillStyle = "#a2a2ff";
    ctx.fillRect(0, canvas.height * 0.0, canvas.width, canvas.height*0.8);
    
    p1.image = new Image();
    p1.image.src = 'img/tempplayer.png';
    ctx.drawImage(p1.image, 
    p1.x,
    p1.y,
    p1.width, p1.height);
    
    p2.image = new Image();
    p2.image.src = 'img/tempplayer.png';
    ctx.drawImage(p2.image, 
    p2.x,
    p2.y,
    p2.width, p2.height);
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
    
    var contact = colCheck(p2,p1);
    if(contact == "l") {
        console.log("Hit right");
        p1.grounded = true;
    }
}

/* -------------------------------------------------------------------------- */
Game.input = function() {
    if (keys[68]) {
        p1.moving("right");
        Game.drawGFX();
    }
    if (keys[65]) {
        p1.moving("left");
        Game.drawGFX();
    }
    
    if (keys[87]) {
       p1.jumping = true;
    }
    
    if(p1.jumping === true) {
        p1.y = p1.y - p1.velY;
        p1.velY -= p1.gravity; 
        Game.drawGFX();
    } 
    
    if(p1.y === p1.startY){
        p1.jumping = false;
        Game.drawGFX();
    }
    
    console.log(p1.startY);
    console.log(p1.y);
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
function colCheck(shapeA, shapeB) {
    // get the vectors to check against
    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
        vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
        // add the half widths and half heights of the objects
        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
        colDir = null;
    /*
    console.log(vX);
    console.log(vY);
    console.log(hWidths);
    console.log(hHeights);
    
    */
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {

        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                shapeA.y += oY;
            } else {
                colDir = "b";
                shapeA.y -= oY;
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                shapeA.x += oX;
            } else {
                colDir = "r";
                shapeA.x -= oX;
            }
        }
    }
    return colDir;
}

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