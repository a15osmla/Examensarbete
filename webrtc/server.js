var express=require("express");
var app=express();
app.use(express.static(__dirname + '/public'));
var server = require('http').createServer(app);
var io = require("socket.io").listen(server);
var bodyParser = require('body-parser');
var connections = [];
var users = [];
var sessionId;
var sTime;
var eTime;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

function sendTo(sessionId, message) {
   io.sockets.connected[sessionId].emit("message", (JSON.stringify(message)));
}

io.sockets.on("connection", function(socket){
    console.log(socket.id + " connected");
    connections.push(socket);
    users.push(socket.id);
    console.log(connections.length + " sockets connected");
    
    //var serverTime = new Date().valueOf() + ((new Date().getTimezoneOffset()) - (new Date().getTimezoneOffset()) ) * -60000;
    //io.sockets.emit("users", JSON.stringify({users:users, time:serverTime}));
    io.sockets.emit("users", JSON.stringify({users:users}));
    //console.log(serverTime);
    
    if(connections.length == 1) {
        io.sockets.emit("connectedfirst", connections[0].id);
    }  
    
    socket.on("start", function(start){
        sTime = JSON.parse(start);
        console.log(sTime);
    });

     // Recieve signal and send to all other clients
    socket.on("message", function(message) {
        var conn, connection, otherId, data;
      //accepting only JSON messages 
        try {
             data = JSON.parse(message); 
        } catch (e) { 
            console.log("Invalid JSON"); 
            data = {}; 
        }
        
        var type = data.type;
        sessionId = data.session;
        conn = data.session;
        
        if(connections.length >= 2) {
           switch(data.type) {
               case "host":
                   if(conn != null) { 
                   //setting that UserA connected with UserB 
                       io.sockets.emit("message", JSON.stringify({type:"host", host:sessionId}));
                   } 
                   
                   break;
             case "offer":           
                //for ex. UserA wants to call UserB 
                console.log("Sending offer to: ", conn, data.offer, sessionId); 

                if(conn != null) { 
                   //setting that UserA connected with UserB 
                    sendTo(conn, { type: "offer", offer: data.offer, peer:data.peer}); 
                } 
                break;
				
             case "answer": 
                console.log("Sending answer to: ", conn, data.answer); 
                //for ex. UserB answers UserA 
                if(conn != null) { 
                   sendTo(conn, { type: "answer", answer: data.answer, index: data.index}); 
                }   
                break;  
             case "candidate": 
                console.log("Sending candidate to:", conn), data.candidate; 
                if(conn != null) { 
                    console.log(data.peer);
                   sendTo(conn, {type: "candidate", candidate: data.candidate, session:sessionId, peer:data.peer});
                }
                break;  
             case "leave": 
                console.log("Disconnecting from", conn); 

                //notify the other user so he can disconnect his peer connection 
                if(conn != null) { 
                   sendTo(conn, { 
                      type: "leave" 
                   }); 
                }  
                break;  
            } 
        }
      
    });       

    // Disconnect
    socket.on('disconnect', function() {
        connections.splice(connections.indexOf(socket), 1);
        users.pop();
        console.log("A socket disconnected: %s sockets connected", connections.length);
        io.sockets.emit("users", JSON.stringify({users:users}));
    });

});
          
server.listen(process.env.PORT || 1338);