var express=require("express");
var app=express();
app.use(express.static(__dirname + '/public'));
var server = require('http').createServer(app);
var io = require("socket.io").listen(server);
var bodyParser = require('body-parser');
var connections = [];
var sessionId;


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
    if(connections.length == 2) {
        socket.emit("connectedfirst", connections[1].id);
    }
    
    console.log(connections.length + " sockets connected");
  
    
    
    
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
        
        for(var x = 0; x < connections.length; x++ ) {
            if(connections[x].id != sessionId) {
                conn = connections[x].id;
            } else {
                otherId = sessionId;  
            }
         }
        

        if(connections.length >= 2) {
            switch(data.type) { 
   			
             case "offer":           
                //for ex. UserA wants to call UserB 
                console.log("Sending offer to: ", conn, data.offer); 

                if(conn != null) { 
                   //setting that UserA connected with UserB 
                    sendTo(conn, { type: "offer", offer: data.offer, session: sessionId}); 
                } 
                break;  
				
         case "answer": 
            console.log("Sending answer to: ", conn, data.answer); 
            //for ex. UserB answers UserA 
            if(conn != null) { 
               sendTo(conn, { type: "answer", answer: data.answer, session: sessionId }); 
            }   
            break;  
         case "candidate": 
            console.log("Sending candidate to:", conn); 
            if(conn != null) { 
               sendTo(conn, {type: "candidate", candidate: data.candidate, session:sessionId});
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
        console.log("A socket disconnected: %s sockets connected", connections.length);
    });

});
          
    


server.listen(process.env.PORT || 1337);