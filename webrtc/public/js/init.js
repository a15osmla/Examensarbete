var serverData =
    "ertqwertqwertqqwertqwertqwertqwertwertqwertqwertqwertqwert";
var testdata = "tqwertqwertqwertwertqwertqwertqwertqwert";
testdata = "ertqwertqwertqwertqwertqqwertqwertwertqwertqwertqwertqqwertqwertqwertrrtqwertqrtqwertqwertqwertqwertqwertqwertrrtqwertqrtqwertqwertqwertrrtqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqqwertqwertwertqwertqwertqwertqqwertqwertqwertqwertwertqwertqwertqwertqwertrtqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqqwertqwertwertqwertqwertqwertqqwertqwertqwertqwertwertqwertqwertqwertqwerttqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqqwertqwertwertqwertqwertqwertqqwertqwertqwertqwertwertqwertqwertqwertqwert";

var socket = io.connect();
var hosting = false;
var starter = false;

var ctx, width, height, canvas, peerConn, dataChannel, sessionId, testing, pongTime, pingTime, latency, host, start, hostId, action, actionz, set, player, lastRecievedUpdate, animation;
var filterStrength = 20;
var frameTime = 0,
    lastLoop = new Date,
    thisLoop, thisFrameTime;
var lastDir;
var Game = {};
var keys = {};
var players = [];
var peers = [];
var recievedPlayers = [];
var player;
var peerConnections = [];
var dataChannels = [];
var animations = [];

var dataChannelOptions = {
    ordered: false, //no guaranteed delivery, unreliable but faster 
    maxRetransmitTime: 1000, //milliseconds
};
var config = {
    'iceServers': [{
            'url': 'stun:stun.1und1.de'
        },
                   //url:'stun:stun1.l.google.com:19302'},
    ]
};

function Player(x, y, width, height, speed, id, p, index, dir) {
    this.player = p;
    this.pid = id;
    this.index = index;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.orgSpeed = speed;
    this.grounded = true;
    this.jumping = false;
    this.blocking = false;
    this.velY = 0;
    this.velX = 0;
    this.startY = y;
    this.gravity = speed / 2;
    this.hp = 100;
    this.dir = dir;
    this.action = "idle";
}


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

function hideTestElements() {
    document.getElementById("test").style.display = "none";
    document.getElementById("host").style.display = "none";
    document.getElementById("start").style.display = "none";
}

function runGame() {
    Game.initialize();
    window.onEachFrame(Game.run);
}