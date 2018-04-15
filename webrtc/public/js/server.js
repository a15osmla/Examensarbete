var express=require("express");
var app=express();
app.use(express.static(__dirname + '/public'));
var server = require('http').createServer(app);
var io = require("socket.io").listen(server);
var bodyParser = require('body-parser');
var connections = [];


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');    
});

io.sockets.on("connection", function(socket){
    connections.push(socket);
    console.log(connections.length + " sockets connected");
    if(connections.length >= 1) {
        io.sockets.emit("start connection", "Connection started");
    }
   
});
          
    
    // Disconnect
    socket.on('disconnect', function() {
        connections.splice(connections.indexOf(socket), 1);
        console.log("A socket disconnected: %s sockets connected", connections.length);
    });
})


server.listen(process.env.PORT || 1337);