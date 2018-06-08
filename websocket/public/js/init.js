var socket = io.connect();

var otherId, sessionId, animation, lastDir, set, index, actionz, action, jumping,punching, lastRecievedUpdate;
var test = true;

var players = [];
var recievedPlayers = [];
var animations = [];

var keys = {};
var player = {};
var Game = {};

socket.on("connect", function () {
    sessionId = socket.io.engine.id;
});

function dynamicallyLoadScript(filepath, callback) {
    if (filepath) {
        var fileref = document.createElement('script');
        var done = false;
        var head = document.getElementsByTagName("head")[0];

        fileref.onload = fileref.onreadystatechange = function () {
            if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                done = true;
                if (callback) {
                    callback();
                }

                // Handle memory leak in IE
                fileref.onload = fileref.onreadystatechange = null;
                if (head && fileref.parentNode) {
                    head.removeChild(fileref);
                }
            }
        };

        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("src", filepath);

        head.appendChild(fileref);
    }
}

function runGame() {
    Game.initialize();
    window.onEachFrame(Game.run);
}

function hideTestElements() {
    document.getElementById("logger").style.display = "none";
    document.getElementById("create").style.display = "none";
    document.getElementById("test   ").style.display = "none";
    document.getElementById("downloadlink").style.display = "none";
}

if (test == true) {
var controls = document.getElementsByClassName("controller");
    for (var i = 0; i < controls.length; i++) {
        controls[i].style.display = 'none';
    }
    
    
} else {
    hideTestElements();
}