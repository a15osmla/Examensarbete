var express=require("express");
var app=express();
app.use(express.static(__dirname + '/public'));
var server = require('http').createServer(app);
var io = require("socket.io").listen(server);
const path = require('path');
var bodyParser = require('body-parser');

players = [];
connections = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');    
    //res.render('index'); 
});


io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log('Connected: %s connected', connections.length);
    
    // DC
    connections.splice(connections.indexOf(socket), 1);
    console.log("Disconnected: %s sockets connected", connections.length);
    
    // Send message 
    socket.on("send message", function(data){
        io.sockets.emit('new message', {msg: data});
    });
    

})

// Assign a player on connection

// server tasks
// update player position
// Handle player collision

server.listen(process.env.PORT || 1337);