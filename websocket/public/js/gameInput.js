/* ----------------------------------- Touch controllers --------------------------------------- */
function handleStart(evt) {
    evt.preventDefault();
    switch (evt.target.id) {
        case "right":
            action = "right";
            break;
        case "up":
            action = "jump";
            logger.innerHTML = "";
            break;
        case "left":
            action = "left";
            break;
        case "punch":
            action = "punch";
            //or
            break;
        case "block":
            action = "block";
            break;
    }
}

function handleEnd(evt) {
    action = null;
}

var r = document.getElementById("right");
var u = document.getElementById("up");
var l = document.getElementById("left");
var p = document.getElementById("punch");
var b = document.getElementById("block");

r.addEventListener("touchend", handleEnd, false);
r.addEventListener("touchmove", handleStart, false);

u.addEventListener("touchstart", handleStart, false);
u.addEventListener("touchend", handleEnd, false);

l.addEventListener("touchstart", handleStart, false);
l.addEventListener("touchend", handleEnd, false);

p.addEventListener("touchstart", handleStart, false);
p.addEventListener("touchend", handleEnd, false);

b.addEventListener("touchstart", handleStart, false);
b.addEventListener("touchend", handleEnd, false);

/* --------------------------------- Global listeners for keyboard----------------------------------------- */
document.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});

document.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});

/* -------------------------------------------------------------------------------------------------------- */


function jump() {
    if (!jumping) {
        jumping = true;
        msg = {
            action: "jump",
            index: index,
            dir: lastDir
        };
        socket.emit("message", JSON.stringify(msg));
        setTimeout(function () {
            jumping = false;
        }, 500);
    }
}

function punch() {
    if (!punching) {
        punching = true;
        var msg = {
            action: "punch",
            index: index,
            dir: lastDir,
            canvas: canvas.width,
            time: new Date().getTime()
        };
        socket.emit("message", JSON.stringify(msg));
        setTimeout(function () {
            punching = false;
        }, 475);
    }
}

Game.input = function () {

    if (player.player == "p1") {
        set = sprite_sheet.frame_sets;
        if (!lastDir) {
            lastDir = "right";
        }
    } else if (player.player == "p2") {
        set = sprite_sheet.frame_sets2;
        if (!lastDir) {
            lastDir = "left";
        }
    }

    if (set) {
        // Block - shift
        if (keys[16] || action == "block") {
            if (lastDir == "left") {
                animation.change(set[8], 15);
            } else {
                animation.change(set[3], 15);
            }
            var msg = {
                action: "block",
                index: index,
                dir: lastDir,
                canvas: canvas.width
            };
            socket.emit("message", JSON.stringify(msg));
        }

        // Punch - space
        else if (keys[32] || action == "punch") {
            if (lastDir == "left") {
                animation.change(set[7], 15);
            } else {
                animation.change(set[4], 15);
            }
            punch();
        }

        // Move right - d   
        else if (keys[68] || action == "right") {
            animation.change(set[1], 15);
            lastDir = "right";
            var msg = {
                action: "right",
                index: index,
                dir: lastDir,
                canvas: canvas.width
            };
            socket.emit("message", JSON.stringify(msg));

            if (keys[87] || action == "jump") {
                jump();
                if (lastDir == "left") {
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
            var msg = {
                action: "left",
                index: index,
                dir: lastDir,
                canvas: canvas.width
            };
            socket.emit("message", JSON.stringify(msg));

            if (keys[87] || action == "jump") {
                jump();
                if (lastDir == "left") {
                    animation.change(set[9], 8);
                } else {
                    animation.change(set[2], 8);
                }
            }
        } else if (keys[87] || action == "jump") {
            jump();
            if (lastDir == "left") {
                animation.change(set[9], 8);
            } else {
                animation.change(set[2], 8);
            }
        } else {
            if (lastDir == "left") {
                animation.change(set[5], 15);
            } else {
                animation.change(set[0], 15);
            }
        }
    }
    animation.update();
}