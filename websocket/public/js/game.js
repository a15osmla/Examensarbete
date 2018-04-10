var Game = {};
var keys = {};
var socket = io.connect();
var player = {};
var animation;
var lastDir;
var set;
var index;
var players = [];
var action;

Game.width = window.innerWidth;
Game.height = window.innerHeight;
Game.fps = 60;
Game.maxFrameSkip = 10;
Game.skipTicks = 1000 / Game.fps;

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
                [23,22,21] // set 9: jump left
                ],
    // P2
    frame_sets2:[[28],// set 0: Stand right
                [29,30,31,32,33,34],// set 1: Walk right
                [35,36,37], // set 2: jump right
                [38], // set 3: block right
                [40,41], // set 4: punch right
                [42], // set 5: stand left
                [48,47,46,45,44,43], // set 6: walk left
                [55,54], // set 7: punch left
                [52], // set 8: block left
                [49,51,50] // set 9: jump left
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
/* -------------------------------------------------------------------------- */
Game.drawGFX = function() {
    Game.drawWorld();
    Game.drawPlayer();
    //sGame.drawUI();
    //Game.drawFPS(); 
};  

/* -------------------------------------------------------------------------- */
Game.drawWorld = function() {
    ctx.fillStyle = "brown";
    ctx.fillRect(0, canvas.height * 0.8, canvas.width, canvas.height*0.9);
    
    ctx.fillStyle = "#a2a2ff";
    ctx.fillRect(0, canvas.height * 0.0, canvas.width, canvas.height*0.8);
}

Game.drawPlayer = function() { 
    for(var x = 0; x < players.length; x++) {
        var player = players[x];
        ctx.drawImage(sprite_sheet.image, animation.frame * SPRITE_SIZE, 0, 45, 50,
        player.x, player.y, canvas.width * 0.2, canvas.height * 0.4);
    }
    /*
    if(player) {
        if(player.player == "p1") {
            ctx.drawImage(sprite_sheet.image, animation.frame * SPRITE_SIZE, 0, 45, 50,
            player.x, player.y, canvas.width * 0.2, canvas.height * 0.4);
        } else if(player.player == "p2"){
            ctx.drawImage(sprite_sheet.image, animation.frame * SPRITE_SIZE, 0, 45, 50,
            player.x, player.y, canvas.width * 0.2, canvas.height * 0.4);   
        }
    }
    */  
}

    

/* -------------------------------------------------------------------------- 
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
Game.pause = function() {
   this.paused = (this.paused) ? false : true;
};

Game.update = function(tick) {
    Game.tick = tick; 
    Game.input();
}

var jumping;
function jump() {
  if (!jumping) {
      console.log("jump");
    jumping = true;
      
    socket.emit("movement", {action: "jump", index: index, dir:lastDir, canvas:canvas.width, time:new Date().getTime()});
    setTimeout(function(){ jumping = false;}, 500);
  }
}

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
Game.input = function() { 
    
    if(player.player == "p1") {
        set = sprite_sheet.frame_sets;
        if(!lastDir) {
               lastDir = "right"; 
            }

    } else if (player.player == "p2") {
        if(!lastDir) {
           lastDir = "left"; 
        }
        set = sprite_sheet.frame_sets2;
    }
    
    if(set) {
        // Move right - d   
        if(keys[68] || action == "right") {
            animation.change(set[1], 15);
            lastDir = "right";
            socket.emit("movement", {action: "right", index: index, dir:lastDir, canvas:canvas.width, time:new Date().getTime() });

            if (keys[87] || action == "jump") {
                jump();
                if(lastDir == "left") {
                    animation.change(set[9], 8);  
                } else {
                    animation.change(set[2], 8);  
                } 
            }
        } 

        // Move left - a
        else if (keys[65] || action == "left") {
            animation.change(set[6], 15);
            lastDir = "left";
            socket.emit("movement", {action: "left", index: index, dir:lastDir, canvas:canvas.width, time:new Date().getTime()});
            
            if (keys[87] || action == "jump") {
             jump();
                if(lastDir == "left") {
                   
                    animation.change(set[9], 8);  
                } else {
                    animation.change(set[2], 8);  
                } 
            } 
        } 
        
        else if (keys[87] || action == "jump") {
            jump();
            if(lastDir == "left") {
                animation.change(set[9], 8); 
            } else {
                animation.change(set[2], 8);  
            } 
        }

        // Punch - space
        else if(keys[32] || action == "punch"){
            if(lastDir == "left") {
                animation.change(set[7], 15); 
            } else {
                animation.change(set[4], 15);
            }
        }

        // Block - shift
        else if (keys[16] || action == "block") {
           if(lastDir == "left") {
                animation.change(set[8], 15); 
            } else {
                animation.change(set[3], 15);
            }
        }

        else{ 
            if(lastDir == "left") {
                animation.change(set[5], 15);   
            } else {
                animation.change(set[0], 15);
            }    
        }
    }
   
    animation.update(); 
    Game.drawGFX();
}
/* -------------------------------------------------------------------------- */
Game.initialize = function() {
    sprite_sheet.image.src = "/img/spritesheet.png";
    canvas = document.getElementById("gamecanvas");  
    
    if (canvas && canvas.getContext) {
        animation = new Animation();
        ctx = canvas.getContext("2d");
        canvas.width = Game.width;
        canvas.height = Game.height;
        
        socket.on("players", function(data) {
            players = data.players;
            var startTime = data.time;
            var ms = new Date().getTime() - startTime;
            console.log(ms + " ms");
            
            console.log(players);
            for(var x = 0; x < players.length; x++) {
                var sid = socket.io.engine.id;
                console.log(player)
                if(players[x].pid == sid ) {
                    player = players[x];
                    index = player.index;
                    
                }
            }
        });
    
    }
};

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