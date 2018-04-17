var express=require("express");
var app=express();
app.use(express.static(__dirname + '/public'));
var server = require('http').createServer(app);
var io = require("socket.io").listen(server);
const path = require('path');
var bodyParser = require('body-parser');
var Game = {};
var connections = [];
var players = [];
var msg;

function Player(x, y, width, height, speed, id, p, index) {
    this.player = p;
    this.pid = id;
    this.index = index;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.grounded = true;
    this.jumping = false;
    this.blocking = false;
    this.velY = 0;
    this.velX = 0;
    this.startY = y;
    this.gravity = 2;
    this.hp = 100;
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');    
});

//-------------------------------------------------------On connection ----------------------------------------------------------------------

io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log('Connected: %s connected', connections.length);
    
    // Add a new player object for every connection (Player) 
    if(players.length % 2 == 0) {
        players.push(new Player(100,380,100,100,5, socket.id, "p1", players.length)); 
    } else {
        players.push(new Player(1200,380,100,100,5, socket.id, "p2", players.length));  
    }

    msg = {players: players};
    io.sockets.emit('players', JSON.stringify(msg));

        // Receive player input from client
        socket.on('message', function(datas) {
            
            // Recieved action from client and the index of their respective player object
            
            var data = JSON.parse(datas);
            var action = data.action;
            
            var index = data.index;
            var player = players[index];
            var canvas = {};
            var lastDir = data.dir;
            var clientTime = data.time;
            var testData = data.data;
            var otherId = data.id;
            var start = data.start;
            
            
            if(action == "test") {
                msg = {start: start, testdata: data.testdata};
                //io.sockets.connected[otherId].emit("test", JSON.stringify(msg)); 
                io.sockets.emit("test", JSON.stringify(msg)); 
            }
            
            else if (action == "left") {
                player.x -= player.speed;
                msg = { players: players,time:clientTime};
                io.sockets.emit('players', JSON.stringify(msg));
            } else if (data.action == "right") {
                player.x += player.speed;
                msg = { players: players,time:clientTime};
                io.sockets.emit('players', JSON.stringify(msg));
            } else if (data.action == "jump") {
                var interval = setInterval(function(){
                    if (!player.jumping) {
                        player.jumping = true;
                        player.grounded = false;
                        player.velY = -player.speed * 5;         
                    } 
                    if(player.jumping) {
                        player.y += player.velY;;  
                        player.velY -= -player.gravity;
                    } 
                    // Check if player is on the ground
                    if(player.y >= player.startY){
                        player.jumping = false;
                        player.grounded = true;
                        player.velY = 0;
                        clearInterval(interval);    
                    }
                    msg = { players: players,time:clientTime};
                    io.sockets.emit('players', JSON.stringify(msg));
                    
                }, 15);
            }
                                                    
        });
    
//------------------------------------------------------------ Disconnect ------------------------------------
    
    //DC
    socket.on('disconnect', function() {
        connections.splice(connections.indexOf(socket), 1);
        players.pop();
        console.log("A socket disconnected: %s sockets connected", connections.length);
    }); 

});

server.listen(process.env.PORT || 1337);