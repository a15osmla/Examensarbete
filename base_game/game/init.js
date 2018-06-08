var ctx, width, height, canvas;
var Game = {};
var keys = {};
var filterStrength = 20;
var frameTime = 0,
    lastLoop = new Date,
    thisLoop, thisFrameTime;
var lastDir;
var players = [];

function runGame() {
    Game.initialize();
    window.onEachFrame(Game.run);
}