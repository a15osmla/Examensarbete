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
        // var p1 = new Player(0.01, 0.6, 0.15, 0.35, 0.004);
        //players.push(new Player(100,450,100,100,5, socket.id, "p1", players.length, "right")); 
        players.push(new Player(0.01,0.6,0.15, 0.35, 0.004, socket.id, "p1", players.length, "right")); 
    } else {
        //players.push(new Player(1200,450,100,100,5, socket.id, "p2", players.length, "left"));  
        players.push(new Player(0.89, 0.6, 0.15, 0.35, 0.004, socket.id, "p2", players.length, "left"));  
        //var p2 = new Player(0.80, 0.6, 0.15, 0.35, 0.004);
    }

    msg = {players: players};
    io.sockets.emit('players', JSON.stringify(msg));

        // Receive player input from client
        socket.on('message', function(datas) {
            var data = JSON.parse(datas);
            var action = data.action;
            var index = data.index;
            var player = players[index];
            var canvas = data.canvas;
            var lastDir = data.dir;
            var clientTime = data.time;
            var testData = data.data;
            var otherId = data.id;
            var start = data.start;
            var player2;
            var cCheck;
            
            
            // Recieved action from client and the index of their respective player object
            if(action == "test") {
                if(players.length >= 2) {
                    msg = {start: start, testdata: data.testdata2};
                    io.sockets.connected[otherId].emit("test", JSON.stringify(msg));
                }
                //io.sockets.emit("test", JSON.stringify(msg)); 
            }
            
            if(action == "ping") {
                if(players.length >= 2) {
                    msg = {start: start, testdata: data.testdata};
                    io.sockets.connected[otherId].emit("ping", JSON.stringify(msg)); 
                //io.sockets.emit("test", JSON.stringify(msg));
                }
            }
            
             if(action == "pong") {
                 if(players.length >= 2) {
                    msg = {start: start, testdata: data.testdata};
                     io.sockets.connected[otherId].emit("latency", JSON.stringify(msg)); 
                 }
                //io.sockets.emit("test", JSON.stringify(msg)); 
            }
                
            else if (action == "left") {
                player.x -= player.speed;
                player.dir = lastDir;
                player.action = "left";
                msg = { players: players,time:clientTime};
                io.sockets.emit('players', JSON.stringify(msg));
            } else if (data.action == "right") {
                player.x += player.speed;
                player.dir = lastDir;
                player.action = "right";
                msg = { players: players,time:clientTime};
                io.sockets.emit('players', JSON.stringify(msg));
            } else if (data.action == "block") {
                player.blocking = true;
                player.action = "block";
                io.sockets.emit('players', JSON.stringify(msg));
                player.blocking = false;
            } else if (data.action == "punch") {
                player.action = "punch";
                for(var x = 0; x < players.length; x++) {
                    if(index != players[x].index) {
                        player2 = players[x];
                    }
                }
                
                if(player2) {
                    var cCheck = colCheck(player, player2);
                    if (cCheck == "l" || cCheck == "r") {
                        if (player.dir == "right" && player2.dir == "left" ) {
                            if(!player2.blocking) {
                                player2.hp += -5;
                            } 
                        } else if(player2.dir == "left" && player.dir == "right") {
                            if(!player2.blocking) {
                                player2.hp += -5;
                            }
                        } else if(player.dir == "right" && player.dir == "right") {
                            player2.hp += -5;
                        }
                        else {
                            player2.hp += -5;
                        } 
                    }
                }
                
            io.sockets.emit('players', JSON.stringify(msg));
                
                
            } else if (data.action == "jump") {
                var interval = setInterval(function(){
                    if (!player.jumping && player.grounded) {
                        player.jumping = true;
                        player.grounded = false;
                        player.velY = -player.speed * 6;
                        player.action = "jump";
                    } 
                    
                    if(player.jumping) {
                        player.y += player.velY; 
                        player.velY -= -player.gravity;
                    } 
                    
                    // Check if player is on the ground
                    if(player.y >= player.startY){
                        player.jumping = false;
                        player.grounded = true;
                        player.velY = 0;
                        clearInterval(interval);
                        player.action = "idle";
                    }
                    
                    msg = { players: players,time:clientTime};
                    io.sockets.emit('players', JSON.stringify(msg));
                }, 16);
               
        }
        

        if(canvas) {
            if(canvas * player.x >= canvas * 0.90){    
                if(lastDir == "right") {
                    player.speed = 0 ;
                } else {
                    player.speed = player.orgSpeed;
                }
                io.sockets.emit('players', JSON.stringify(msg));
        }
    
        if (canvas * player.x <= canvas * -0.07 ){
                if(lastDir == "left") {
                    player. speed = 0 ;
                } else {
                    player.speed = player.orgSpeed;
                }
                io.sockets.emit('players', JSON.stringify(msg));
            }
        }                                           
    });
    
//------------------------------------------------------------ Disconnect ------------------------------------
    
    //DC
    socket.on('disconnect', function() {
        connections.splice(connections.indexOf(socket), 1);
        var temp;
        var sid = socket.id;
        for(var x = 0; x < players.length-1; x++ ) {
            temp = players[x]; 
            players[x] = players[x+1];
            players[x+1] = temp; 
        }
        
        //set p2 to p1
        for(var x = 0; x < players.length; x++) {
            players[x].index = x;
            players[x].player = "p1";
            if(sid == players[x].pid) {
                players.splice(x, 1);
            }
        }
        
        console.log("A socket disconnected: %s sockets connected", connections.length);
        msg = {players: players};
        io.sockets.emit('players', JSON.stringify(msg));
    }); 
});

server.listen(process.env.PORT || 1338);

/* -------------------------------------------------------------------------- */

//positioner
//

function colCheck(shapeA, shapeB) {
    // get the vectors to check against
    var vX = (shapeA.x + (shapeA.width / 4)) - (shapeB.x + (shapeB.width / 4)),
        vY = (shapeA.y + (shapeA.height / 4)) - (shapeB.y + (shapeB.height / 4)),
        // add the half widths and half heights of the objects
        hWidths = (shapeA.width / 4) + (shapeB.width / 4),
        hHeights = (shapeA.height / 4) + (shapeB.height / 4),
        colDir = null;

    
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {

        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                //shapeA.y += oY;
                
            } else {
                colDir = "b";
                //shapeA.y -= oY;
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                //shapeA.x += oX;
            } else {
                colDir = "r";
               // shapeA.x -= oX;
            }
        }
    }
    return colDir;
}