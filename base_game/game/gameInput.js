document.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});

document.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});

var punching;

function punch() {
    if (!punching) {
        punching = true;
        var contact = colCheck(p2, p1);
        var currentFrame = p1.animate.getFrame();

        if (contact == "r" && p2.hp > 10 || contact == "l" && p2.hp > 10) {
            if (contact == "r" || contact == "l") {
                p2.hp -= 5;
            }
        }

        setTimeout(function () {
            punching = false;
        }, 475);
    }
}

Game.input = function () {
    p2.animate.change(sprite_sheet.frame_sets2[0], 8);

    //Jump - w
    if (keys[87]) {
        if (!p1.jumping) {
            p1.jumping = true;
            p1.velY = -p1.speed * 6;
        }
        if (lastDir == "left") {
            p1.animate.change(sprite_sheet.frame_sets[9], 8);
        } else {
            p1.animate.change(sprite_sheet.frame_sets[2], 8);
        }
    }

    // Move right - d   
    if (keys[68]) {
        p1.moving("right");
        p1.animate.change(sprite_sheet.frame_sets[1], 12);
        lastDir = "right";

        if (keys[87]) {
            if (!p1.jumping) {
                p1.jumping = true;
                p1.velY = -p1.speed;
            }
            if (lastDir == "left") {
                p1.animate.change(sprite_sheet.frame_sets[9], 8);
            } else {
                p1.animate.change(sprite_sheet.frame_sets[2], 8);
            }
        }
    }

    // Move left - a    
    else if (keys[65]) {
        p1.moving("left");
        p1.animate.change(sprite_sheet.frame_sets[6], 12);
        lastDir = "left";

        if (keys[87]) {
            if (!p1.jumping) {
                p1.jumping = true;
            }
            if (lastDir == "left") {
                p1.animate.change(sprite_sheet.frame_sets[9], 8);
            } else {
                p1.animate.change(sprite_sheet.frame_sets[2], 8);
            }
        }
    }

    // Punch - space
    else if (keys[32]) {
        if (lastDir == "left") {
            p1.animate.change(sprite_sheet.frame_sets[7], 15);
        } else {
            p1.animate.change(sprite_sheet.frame_sets[4], 15);
        }

        punch();
    }

    // Block - shift
    else if (keys[16]) {
        if (lastDir == "left") {
            p1.animate.change(sprite_sheet.frame_sets[8], 15);
        } else {
            p1.animate.change(sprite_sheet.frame_sets[3], 15);
        }
    }

    // Player animation is set to standing frame if no key has been pressed
    else {
        if (lastDir == "left") {
            p1.animate.change(sprite_sheet.frame_sets[5], 15);
        } else {
            p1.animate.change(sprite_sheet.frame_sets[0], 15);
        }
    }


    // If player is jumping change player y position and reduce velocity based on gravity
    if (p1.jumping) {
        p1.y += p1.velY;
        p1.velY -= -p1.gravity;
    }

    // Check if player is on the ground
    if (p1.y >= p1.startY) {
        p1.jumping = false;
        p1.grounded = true;
        p1.velY = 0;
    }

    // Add borders to canvas
    if (canvas.width * p1.x >= canvas.width * 0.90) {
        if (lastDir == "right") {
            p1.speed = 0;
        } else {
            p1.speed = p1.orgSpeed;
        }
    }

    if (canvas.width * p1.x <= canvas.width * -0.07) {
        if (lastDir == "left") {
            p1.speed = 0;
        } else {
            p1.speed = p1.orgSpeed;
        }
    }

    p1.animate.update();
    p2.animate.update();
}
