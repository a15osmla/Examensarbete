var sprite_sheet = {
    // P1
    frame_sets: [[0], // set 0: Stand right
                [1, 2, 3, 4, 5, 6], // set 1: Walk right
                [7, 8, 9], // set 2: jump right
                [10], // set 3: block right
                [13, 12], // set 4: punch right
                [14], // set 5: stand left
                [20, 19, 18, 17, 16, 15], // set 6: walk left
                [25, 26], // set 7: punch left
                [24], // set 8: block left
                [23, 22, 21] // set 9: jump left
                ],
    // P2
    frame_sets2: [[28], // set 0: Stand right
                [29, 30, 31, 32, 33, 34], // set 1: Walk right
                [35, 36, 37], // set 2: jump right
                [38], // set 3: block right
                [41, 40], // set 4: punch right
                [42], // set 5: stand left
                [48, 47, 46, 45, 44, 43], // set 6: walk left
                [55, 54], // set 7: punch left
                [52], // set 8: block left
                [49, 51, 50] // set 9: jump left
                ],
    image: new Image()
};


/* -------------------------------------------------------------------------- */

/* Each sprite sheet tile is 16x16 pixels in dimension. */
var SPRITE_SIZE = 50;

/* The Animation class manages frames within an animation frame set. The frame
set is an array of values that correspond to the location of sprite images in
the sprite sheet. For example, a frame value of 0 would correspond to the first
sprite image / tile in the sprite sheet. By arranging these values in a frame set
array, you can create a sequence of frames that make an animation when played in
quick succession. */
var Animation = function (frame_set, delay) {
    this.count = 0; // Counts the number of game cycles since the last frame change.

    this.delay = delay; // The number of game cycles to wait until the next frame change.
    this.frame = 0; // The value in the sprite sheet of the sprite image / tile to display.
    this.frame_index = 0; // The frame's index in the current animation frame set.
    this.frame_set = frame_set; // The current animation frame set that holds sprite tile values.
};

Animation.prototype = {

    /* This changes the current animation frame set. For example, if the current
    set is [0, 1], and the new set is [2, 3], it changes the set to [2, 3]. It also
    sets the delay. */
    change: function (frame_set, delay = 5) {

        if (this.frame_set != frame_set) { // If the frame set is different:
            this.count = 0; // Reset the count.
            this.delay = delay; // Set the delay.
            this.frame_index = 0; // Start at the first frame in the new frame set.
            this.frame_set = frame_set; // Set the new frame set.
            this.frame = this.frame_set[this.frame_index]; // Set the new frame value.
        }
    },

    /* Call this on each game cycle. */
    update: function () {

        this.count++; // Keep track of how many cycles have passed since the last frame change.

        if (this.count >= this.delay) { // If enough cycles have passed, we change the frame.

            this.count = 0; // Reset the count.
            /* If the frame index is on the last value in the frame set, reset to 0.
            If the frame index is not on the last value, just add 1 to it. */
            this.frame_index = (this.frame_index == this.frame_set.length - 1) ? 0 : this.frame_index + 1;
            this.frame = this.frame_set[this.frame_index]; // Change the current frame value.
        }

    },

    // Get the current frame_index
    getFrame: function () {
        return this.frame_index;
    }
}

/* -------------------------------------------------------------------------- */
Game.drawWorld = function () {
    ctx.fillStyle = "green";
    ctx.fillRect(0, canvas.height * 0.8, canvas.width, canvas.height * 0.9);

    ctx.fillStyle = "#a2a2ff";
    ctx.fillRect(0, canvas.height * 0.0, canvas.width, canvas.height * 0.8);
}

Game.drawPlayer = function () {

    if (player) {
        ctx.drawImage(sprite_sheet.image, animation.frame * SPRITE_SIZE, 0, 45, 50,
            canvas.width * player.x, canvas.height * player.y, canvas.width * player.width, canvas.height * player.height);
    }

    for (var x = 0; x < players.length; x++) {
        var currentTime = Date.now();

        if (players[x].pid != sessionId) {
            var playerz = players[x];
            lastDirz = playerz.dir;
            actionz = playerz.action;

            /*
                }
            
                console.log(playerz.index);
                console.log(players);*/

            var difference = currentTime - lastRecievedUpdate;
            if (actionz != "idle" && actionz == "punch") {
                if (difference > 500) {
                    var msg = {
                        type: "input",
                        action: "idle",
                        index: playerz.index
                    };
                    dataChannel.send(JSON.stringify(msg));
                }
            }
            if (actionz != "idle" && actionz != "punch" && actionz != "jump") {
                if (difference > 50) {
                    var msg = {
                        type: "input",
                        action: "idle",
                        index: playerz.index
                    };
                    dataChannel.send(JSON.stringify(msg));
                }
            }

            if (playerz.player == "p1") {
                set = sprite_sheet.frame_sets;
            } else if (playerz.player == "p2") {
                set = sprite_sheet.frame_sets2;
            }

            if (actionz == "block") {
                if (lastDirz == "left") {
                    animations[x].change(set[8], 15);
                } else {
                    animations[x].change(set[3], 15);
                }
            }

            // Punch - space
            else if (actionz == "punch") {
                if (lastDirz == "left") {
                    animations[x].change(set[7], 15);
                } else {
                    animations[x].change(set[4], 15);
                }
            }

            // Move right - d   
            else if (actionz == "right") {
                if (action == "jump") {
                    if (lastDirz == "left") {
                        animations[x].change(set[9], 8);
                    } else {
                        animations[x].change(set[2], 8);
                    }
                } else {
                    animations[x].change(set[1], 15);
                }
            }

            // Move left - a
            else if (actionz == "left") {
                animations[x].change(set[6], 15);
                if (actionz == "jump") {
                    if (lastDirz == "left") {
                        animations[x].change(set[9], 8);
                    } else {
                        animations[x].change(set[2], 8);
                    }
                }
            } else if (actionz == "jump") {
                if (lastDirz == "left") {
                    animations[x].change(set[9], 8);
                } else {
                    animations[x].change(set[2], 8);
                }
            } else {
                if (lastDirz == "left") {
                    animations[x].change(set[5], 15);
                } else {
                    animations[x].change(set[0], 15);
                }
            }

            ctx.drawImage(sprite_sheet.image, animations[x].frame * SPRITE_SIZE, 0, 45, 50,
                canvas.width * playerz.x, canvas.height * playerz.y, canvas.width * playerz.width, canvas.height * playerz.height);
        }
        animations[x].update();
    }
}


/*--------------------------------------------------------------------------  */
Game.drawUI = function () {
    for (var x = 0; x < players.length; x++) {
        if (players[x].player == "p1") {
            var p1 = players[x];
            var hp1 = p1.hp / 10 * 0.1;

            ctx.fillStyle = "gray";
            ctx.fillRect(canvas.width * 0.05, canvas.height * 0.05, canvas.width * 0.4, canvas.height * 0.05);

            if (p1.hp >= 50) {
                ctx.fillStyle = "green";

            } else if (p1.hp <= 50 && p1.hp >= 40) {
                ctx.fillStyle = "yellow";
            } else if (p1.hp < 40) {
                ctx.fillStyle = "red";
            }

            if (hp1 >= 0 && hp1 <= 100) {
                ctx.fillRect(canvas.width * 0.05, canvas.height * 0.05, canvas.width * 0.4 * hp1, canvas.height * 0.05);
            }

            ctx.font = ((canvas.width * 0.015) + "px Arial");
            ctx.fillStyle = "black";
            ctx.fillText("HP: " + p1.hp, canvas.width * 0.22, canvas.height * 0.14);

            ctx.font = ((canvas.width * 0.015) + "px Arial");
            ctx.fillStyle = "green";
            ctx.fillText("P" + (x + 1), canvas.width * p1.x + (canvas.width * 0.072), canvas.height * p1.y + (-canvas.height * 0.025));

        } else {
            var p2 = players[x];
            var hp2 = p2.hp / 10 * 0.1;

            ctx.fillStyle = "gray";
            ctx.fillRect(canvas.width * 0.55, canvas.height * 0.05, canvas.width * 0.4, canvas.height * 0.05);

            if (p2.hp >= 50) {
                ctx.fillStyle = "green";
            } else if (p2.hp <= 50 && p2.hp >= 40) {
                ctx.fillStyle = "yellow";
            } else if (p2.hp < 40) {
                ctx.fillStyle = "red";
            }

            if (hp2 >= 0 && hp2 <= 100) {
                ctx.fillRect(canvas.width * 0.55, canvas.height * 0.05, canvas.width * 0.4 * hp2, canvas.height * 0.05);
            }

            ctx.font = ((canvas.width * 0.015) + "px Arial");
            ctx.fillStyle = "black";
            ctx.fillText("HP: " + p2.hp, canvas.width * 0.71, canvas.height * 0.14);

            ctx.font = ((canvas.width * 0.015) + "px Arial");
            ctx.fillStyle = "black";
            ctx.fillText("P" + (x + 1), canvas.width * p2.x + (canvas.width * 0.072), canvas.height * p2.y + (-canvas.height * 0.025));
            if (p1.hp <= 0 || p2.hp <= 0) {
                //gameStatus = "end";
            }
        }
        ctx.fillStyle = "green";
        ctx.fillRect(canvas.width * players[x].x + (canvas.width * 0.032), canvas.height * players[x].y,
            canvas.width * (players[x].hp / 1000), canvas.height * 0.01);
    }
}
