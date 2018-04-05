var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require("socket.io").listen(server);
var path = require('path');
var bodyParser = require('body-parser');

players = [];
connections = [];


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

server.listen(process.env.PORT || 1337);    

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html'); 
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