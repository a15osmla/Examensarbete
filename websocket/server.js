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


function Player(x, y, width, height, speed, id, p) {
    this.player = p;
    this.pid = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.grounded = false;
    this.jumping = false;
    this.blocking = false;
    this.velY = 0;
    this.velX = 0;
    this.startY = y;
    this.gravity = 2;
    this.hp = 100;
 
}

/*   this.x = this.x+this.speed;
        this.x = this.x-this.speed;
*/

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
        players.push(new Player(100,100,100,100,5, socket.id, "p1")); 
    } else {
        players.push(new Player(900,900,100,100,5, socket.id, "p2"));  
    }


    // Send player object to client
    for(var x = 0; x < players.length; x++) {
        var playerId = players[x].pid;
        if(socket.id == playerId) {
            io.sockets.connected[socket.id].emit('player', players[x]);
        }   
    }
//------------------------------------------------------------ Disconnect -----------------------------------------------------------------
    
    //DC
    socket.on('disconnect', function() {
        connections.splice(connections.indexOf(socket), 1);
        players.pop();
        console.log(players.length);
        console.log("A socket disconnected: %s sockets connected", connections.length);
    });
    
//-----------------------------------------------------------------------------------------------------------------------------
    
    // Send message 
    socket.on("send message", function(data){
        io.sockets.emit('new message', {msg: data});
        console.log(data);
    });

    
    
/*------------------------------------------------------------ Game -----------------------------------------------------------------
    Game.update = function() {
        console.log("update");
        // Send positions to clients    
    }

    Game.pause = function() {
       this.paused = (this.paused) ? false : true;
    };

    while (!Game.paused) {
        Game.update();
    }
    
    
*/
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