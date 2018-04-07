var Game = {};
var keys = {};
var socket = io.connect();
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
Game.drawGFX = function() {
    Game.drawWorld();
    //Game.drawPlayer(p1);
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
/*Game.input = function() { 
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
            *
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
}*/

/* -------------------------------------------------------------------------- */
Game.pause = function() {
   this.paused = (this.paused) ? false : true;
};

Game.update = function(tick) {
    Game.tick = tick; 
    //Game.input();
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
Game.initialize = function() {
    sprite_sheet.image.src = "/img/spritesheet.png";
    canvas = document.getElementById("gamecanvas");
    
    
    if (canvas && canvas.getContext) {
        ctx = canvas.getContext("2d");
        canvas.width = Game.width;
        canvas.height = Game.height;
        Game.drawGFX();
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