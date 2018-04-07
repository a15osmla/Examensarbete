var express=require("express");
var app=express();
app.use(express.static(__dirname + '/public'));
var server = require('http').createServer(app);
var io = require("socket.io").listen(server);
const path = require('path');
var bodyParser = require('body-parser');
var Game = {};
var connections = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');    
    //res.render('index'); 
});


io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log('Connected: %s connected', connections.length);
    

    //DC
    socket.on('disconnect', function() {
        connections.splice(connections.indexOf(socket), 1);
        console.log("A socket disconnected: %s sockets connected", connections.length);
    });
    
    // Send message 
    socket.on("send message", function(data){
        io.sockets.emit('new message', {msg: data});
        console.log(data);
    });
    

    Game.pause = function() {
       this.paused = (this.paused) ? false : true;
    };

    Game.fps = 60;
    Game.maxFrameSkip = 10;
    Game.skipTicks = 1000 / Game.fps;

    var loops = 0;
    var nextGameTick = (new Date).getTime();
    var startTime = (new Date).getTime();

    loops = 0;
    while (!Game.paused && (new Date).getTime() > nextGameTick && loops < Game.maxFrameSkip) {
        Game.update(nextGameTick - startTime);
        nextGameTick += Game.skipTicks;
        loops++;
    }
    
});

server.listen(process.env.PORT || 1337);

/*

client task
    check for user input
    send commands to the server
    receive updates about the game from the server
    draw graphics
    play sounds

Server tasks
    check for client commands
    run AI
    move all entities
    resolve collisions
    send updates about the game to the clients

*/