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
                [23, 22, 21] // set 9: block left
                ],
    // P2
    frame_sets2: [[28] //  
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
    this.frame_index = 0; // The f   rame's index in the current animation frame set.
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

/* ----------------------------------------------------------------------- */
Game.drawWorld = function () {
    ctx.fillStyle = "brown";
    ctx.fillRect(0, canvas.height * 0.8, canvas.width, canvas.height * 0.9);

    ctx.fillStyle = "#a2a2ff";
    ctx.fillRect(0, canvas.height * 0.0, canvas.width, canvas.height * 0.8);
}

/* ----------------------------------------------------------------------- */
Game.drawPlayers = function (player) {
    for (var x = 0; x < players.length; x++) {
        var player = players[x];
        ctx.drawImage(sprite_sheet.image, player.animate.frame * SPRITE_SIZE, 0, 45, 50,
            canvas.width * player.x, canvas.height * player.y, canvas.width * player.width, canvas.height * player.height);
    }
}

/* --------------------------------------------------------------------- */
Game.drawUI = function () {
    var hp1 = p1.hp / 10 * 0.1;
    var hp2 = p2.hp / 10 * 0.1;

    /* ----------------------------------Health bars---------------------------------------- */
    ctx.fillStyle = "gray";
    ctx.fillRect(canvas.width * 0.05, canvas.height * 0.05, canvas.width * 0.4, canvas.height * 0.05);
    ctx.fillStyle = "gray";
    ctx.fillRect(canvas.width * 0.55, canvas.height * 0.05, canvas.width * 0.4, canvas.height * 0.05);



    if (p1.hp >= 50) {
        ctx.fillStyle = "green";

    } else if (p1.hp <= 50 && p2.hp >= 40) {
        ctx.fillStyle = "yellow";
    } else if (p1.hp < 40) {
        ctx.fillStyle = "red";
    }

    if (hp1 >= 0 && hp1 <= 100) {
        ctx.fillRect(canvas.width * 0.05, canvas.height * 0.05, canvas.width * 0.4 * hp1, canvas.height * 0.05);
    }

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


    /* ---------------------------------- HP---------------------------------------- */
    ctx.font = (canvas.height * 0.03 + "px Arial");
    ctx.fillStyle = "black";
    ctx.fillText("HP: " + p2.hp, canvas.width * 0.71, canvas.height * 0.14);

    ctx.font = (canvas.height * 0.03 + "px Arial");
    ctx.fillStyle = "black";
    ctx.fillText("HP: " + p1.hp, canvas.width * 0.22, canvas.height * 0.14);



    /* ------------------------------------ Player markers-------------------------------------- */
    ctx.font = (canvas.height * 0.05 + "px Arial");
    ctx.fillStyle = "green";
    ctx.fillText("P1", canvas.width * p1.x + (canvas.width * 0.072), canvas.height * p1.y);

    ctx.font = (canvas.height * 0.05 + "px Arial");
    ctx.fillStyle = "black";
    ctx.fillText("P2", canvas.width * p2.x + (canvas.width * 0.072), p2.y + canvas.height * p2.y);
}


/* -------------------------------------------------------------------------- */
Game.drawFPS = function () {
    ctx.font = (0.05 * canvas.height + "px Roboto Condensed");
    ctx.strokeText((1000 / frameTime).toFixed(1) + " FPS", canvas.width * 0.005, canvas.height * 0.04);
}


resize = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
    
window.addEventListener("resize", resize);