var ctx, width, height, canvas;
var Game = {};  
var keys = {};
var filterStrength = 20;
var frameTime = 0, lastLoop = new Date, thisLoop, thisFrameTime;
var lastDir;

Game.width = window.innerWidth;
Game.height = window.innerHeight;
Game.fps = 60;
Game.maxFrameSkip = 10;
Game.skipTicks = 1000 / Game.fps;
Game.oldTick;

var sprite_sheet = {
    // P1
    frame_sets:[[0],// set 0: Stand right
                [1,2,3,4,5,6],// set 1: Walk right
                [7,8,9], // set 2: jump right
                [10], // set 3: block right
                [13,12], // set 4: punch right
                [14], // set 5: stand left
                [20,19,18,17,16,15], // set 6: walk left
                [25,26], // set 7: punch left
                [24], // set 8: block left
                [23,22,21] // set 9: block left
                ],
    // P2
    frame_sets2:[[28] //  
    ],
    image:new Image()
  };

/* -------------------------------------------------------------------------- */
document.addEventListener("keydown", function (e) {
        keys[e.keyCode] = true;
});

document.addEventListener("keyup", function (e) {
        keys[e.keyCode] = false;
});

/* -------------------------------------------------------------------------- */

 /* Each sprite sheet tile is 16x16 pixels in dimension. */
  var SPRITE_SIZE = 50;

  /* The Animation class manages frames within an animation frame set. The frame
  set is an array of values that correspond to the location of sprite images in
  the sprite sheet. For example, a frame value of 0 would correspond to the first
  sprite image / tile in the sprite sheet. By arranging these values in a frame set
  array, you can create a sequence of frames that make an animation when played in
  quick succession. */
  var Animation = function(frame_set, delay) {
    this.count = 0;// Counts the number of game cycles since the last frame change.
      
    this.delay = delay;// The number of game cycles to wait until the next frame change.
    this.frame = 0;// The value in the sprite sheet of the sprite image / tile to display.
    this.frame_index = 0;// The frame's index in the current animation frame set.
    this.frame_set = frame_set;// The current animation frame set that holds sprite tile values.
  };

  Animation.prototype = {
      

    /* This changes the current animation frame set. For example, if the current
    set is [0, 1], and the new set is [2, 3], it changes the set to [2, 3]. It also
    sets the delay. */
    change:function(frame_set, delay = 5) {

      if (this.frame_set != frame_set) {// If the frame set is different:
        this.count = 0;// Reset the count.
        this.delay = delay;// Set the delay.
        this.frame_index = 0;// Start at the first frame in the new frame set.
        this.frame_set = frame_set;// Set the new frame set.
        this.frame = this.frame_set[this.frame_index];// Set the new frame value.
      }
        

    },

    /* Call this on each game cycle. */
    update:function() {

      this.count ++;// Keep track of how many cycles have passed since the last frame change.
            
      if (this.count >= this.delay) {// If enough cycles have passed, we change the frame.

        this.count = 0;// Reset the count.
        /* If the frame index is on the last value in the frame set, reset to 0.
        If the frame index is not on the last value, just add 1 to it. */
        this.frame_index = (this.frame_index == this.frame_set.length - 1) ? 0 : this.frame_index + 1;
        this.frame = this.frame_set[this.frame_index];// Change the current frame value.
      }

    },
      
    // Get the current frame_index
    getFrame:function() {
        return this.frame_index;
    }
}

function Player(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.grounded = false;
    this.jumping = false;
    this.blocking = false;
    this.velY = 0;
    this.velX = 0;
    this.startY = y;
    this.gravity = 2;
    this.hp = 100;
    this.animate = new Animation();
    this.moving = function(dir) {
        if(dir == "right") {
            this.x = this.x+this.speed;
        } 
        else if(dir == "left") {
            this.x = this.x-this.speed;
        } 
    }
}


var p1 = new Player(Game.width * 0.01, Game.height * 0.5, Game.width * 0.1, Game.height * 0.4, 5);
var p2 = new Player(Game.width * 0.10, Game.height * 0.5, Game.width * 0.1, Game.height * 0.4, 5);

/* -------------------------------------------------------------------------- */
Game.drawGFX = function() {
    Game.drawWorld();
    Game.drawPlayer(p1);
    Game.drawUI();
    Game.drawFPS();
};

/* -------------------------------------------------------------------------- */
Game.drawWorld = function() {
    ctx.fillStyle = "brown";
    ctx.fillRect(0, canvas.height * 0.8, canvas.width, canvas.height*0.9);
    
    ctx.fillStyle = "#a2a2ff";
    ctx.fillRect(0, canvas.height * 0.0, canvas.width, canvas.height*0.8);
}

/* ----------------------------------------------------------------------- */
Game.drawPlayer = function(player) {
    ctx.drawImage(sprite_sheet.image, p1.animate.frame * SPRITE_SIZE, 0, 45, 50,
    p1.x, p1.y, canvas.width * 0.2, canvas.height * 0.4);
    
    ctx.drawImage(sprite_sheet.image, p2.animate.frame * SPRITE_SIZE, 0, 45, 50,
    p2.x, p2.y, canvas.width * 0.2, canvas.height * 0.4);
}

/* --------------------------------------------------------------------- */
Game.drawUI = function(){
    var hp1 = p1.hp/10 * 0.1;
    var hp2 = p2.hp/10 * 0.1;
    
    ctx.fillStyle = "gray";
    ctx.fillRect(canvas.width * 0.05, canvas.height * 0.05, canvas.width * 0.4, canvas.height*0.05);
    ctx.fillStyle = "gray";
    ctx.fillRect(canvas.width * 0.55, canvas.height * 0.05, canvas.width * 0.4, canvas.height*0.05);
    
    
    if(p1.hp >= 50) {
        ctx.fillStyle = "green";
        
    } else if(p1.hp <= 50 && p2.hp >= 40) {
        ctx.fillStyle = "yellow";
    }
    
    else if(p1.hp < 40) {
        ctx.fillStyle = "red";
    }
    
    if(hp1 >=0 && hp1 <= 100) {
        ctx.fillRect(canvas.width * 0.05, canvas.height * 0.05, canvas.width * 0.4 * hp1, canvas.height*0.05);
    }

    if(p2.hp >= 50) {
        ctx.fillStyle = "green";
        
    } else if(p2.hp <= 50 && p2.hp >= 40) {
        ctx.fillStyle = "yellow";
    }
    
    
    
    else if(p2.hp < 40) {
        ctx.fillStyle = "red";
    }
    
    if(hp2 >=0 && hp2 <= 100) {
        ctx.fillRect(canvas.width * 0.55, canvas.height * 0.05, canvas.width * 0.4 * hp2, canvas.height*0.05);
    }
    
    ctx.font = (0.03 * canvas.height + "px Arial");
    ctx.fillStyle = "black";
    ctx.fillText("HP: " + p2.hp,canvas.width * 0.71, canvas.height * 0.14);
    
    ctx.font = (0.03 * canvas.height + "px Arial");
    ctx.fillStyle = "black";
    ctx.fillText("HP: " + p1.hp,canvas.width * 0.22, canvas.height * 0.14);
    
    ctx.font = (0.05 * canvas.height + "px Arial");
    ctx.fillStyle = "green";
    ctx.fillText("P1", p1.x+154, p1.y);
    
    ctx.font = (0.05 * canvas.height + "px Arial");
    ctx.fillStyle = "black";
    ctx.fillText("P2", p2.x+154, p2.y);
    

    
}

/* -------------------------------------------------------------------------- */
Game.drawFPS = function(){
    ctx.font = (0.05 * canvas.height + "px Roboto Condensed");
    ctx.strokeText((1000/frameTime).toFixed(1) + " FPS", canvas.width * 0.005 , canvas.height * 0.04 );
}


/* -------------------------------------------------------------------------- */
Game.initialize = function() {
    sprite_sheet.image.src = "img/spritesheet.png";
    canvas = document.getElementById("gamecanvas");
    
    if (canvas && canvas.getContext) {
        ctx = canvas.getContext("2d");
        canvas.width = Game.width;
        canvas.height = Game.height;
       
    }
};

resize = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    Game.width = window.innerWidth;
    Game.height = window.innerHeight;
};
    
window.addEventListener("resize", resize);
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
    p2.animate.change(sprite_sheet.frame_sets2[0], 8);
    
   
    if (keys[87]) {
            if(!p1.jumping) {
                    p1.jumping = true;
                    p1.velY = -p1.speed * 5;
            }
            if(lastDir == "left") {
                p1.animate.change(sprite_sheet.frame_sets[9], 8);  
            } else {
                p1.animate.change(sprite_sheet.frame_sets[2], 8);  
            } 
    }
    
    // Move right - d   
    if (keys[68]) {
        p1.moving("right");
        p1.animate.change(sprite_sheet.frame_sets[1], 15);
        lastDir = "right";
        
        if (keys[87]) {
            if(!p1.jumping) {
                    p1.jumping = true;
                    p1.velY = -p1.speed * 5;
            }
            if(lastDir == "left") {
                p1.animate.change(sprite_sheet.frame_sets[9], 8);  
            } else {
                p1.animate.change(sprite_sheet.frame_sets[2], 8);  
            } 
        }
    } 
  
    // Move left - a
    else if (keys[65]) {
        p1.moving("left");
        p1.animate.change(sprite_sheet.frame_sets[6], 15);
        lastDir = "left";
        
        if (keys[87]) {
            if(!p1.jumping) {
                    p1.jumping = true;
                    p1.velY = -p1.speed * 5;
            }
            if(lastDir == "left") {
                p1.animate.change(sprite_sheet.frame_sets[9], 8);  
            } else {
                p1.animate.change(sprite_sheet.frame_sets[2], 8);  
            } 
        }
    } 
    
    // Punch - space
    else if(keys[32]){
        if(lastDir == "left") {
            p1.animate.change(sprite_sheet.frame_sets[7], 15); 
        } else {
            p1.animate.change(sprite_sheet.frame_sets[4], 15);
        }
        
        
        var contact = colCheck(p2,p1);
        var currentFrame = p1.animate.getFrame();
  
        if (contact == "r"  && p2.hp > 10 || contact == "l" && p2.hp > 10) {
                if(contact == "r" || contact == "l") {
                      if(currentFrame == 0) {
                        p2.hp -= 5;
                        console.log("hit R");   
                      }
                }
        }   
        
    }
    
   // Block - shift
   else if (keys[16]) {
       if(lastDir == "left") {
            p1.animate.change(sprite_sheet.frame_sets[8], 15); 
        } else {
            p1.animate.change(sprite_sheet.frame_sets[3], 15);
        }
   }

    else{ 
        if(lastDir == "left") {
            p1.animate.change(sprite_sheet.frame_sets[5], 15);   
        }else {
            p1.animate.change(sprite_sheet.frame_sets[0], 15);
        }    
    }
    
    // If player is jumping change player y position and reduce velocity based on gravity
    if(p1.jumping) {
        p1.y += p1.velY;
        p1.velY += p1.gravity; 
    }
    
    // Check if player is on the ground
    if(p1.y >= p1.startY){
        p1.jumping = false;
        p1.grounded = true;
        p1.velY = 0;
    }
    
    
    //
    if(p1.x >= canvas.width - 220){    
        if(lastDir == "right") {
            p1.speed = 0 ;
        } else {
            p1.speed = 5;
        }
    } 
    if (p1.x <= -130) {
       if(lastDir == "left") {
            p1. speed = 0 ;
        } else {
            p1.speed = 5;
        }
    }
    
    p1.animate.update();
    p2.animate.update();  
    Game.drawGFX();
}

/* -------------------------------------------------------------------------- */
Game.pause = function() {
   this.paused = (this.paused) ? false : true;
};

/* -------------------------------------------------------------------------- */
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