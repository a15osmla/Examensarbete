var socket = io.connect();
var peerConn;
var config = {
	'iceServers': [{
		'url': 'stun:stun.l.google.com:19302'
	}]
};

var socket id = socket.id;
console.log(id);

// båda klienterna tar emot sdp
// klient 1 skickar sdp till klient 2
// klient 2 tar emot från 1, svarar till 2 med sin sdp
// anslu

var dataChannelOptions = {
	ordered: false, //no guaranteed delivery, unreliable but faster 
	maxRetransmitTime: 1000, //milliseconds
};
var dataChannel;

 socket.on("start connection", function(data) {
        peerConn = new RTCPeerConnection(config, null);
        dataChannel = peerConn.createDataChannel('textMessages', dataChannelOptions);
          
        // send any ice candidates to the other peer
        peerConn.onicecandidate = function (evt) {
            socket.emit("send candidate", JSON.stringify({ "candidate": evt.candidate }));
        };

        io.sockets.on("connection", function(socket){
    connections.push(socket);
    console.log(connections.length + " sockets connected");
    
    if(connections.length >= 2) {
        io.sockets.emit("start connection", "Connection started");
    }
    
    //DC
    socket.on('disconnect', function() {
        connections.splice(connections.indexOf(socket), 1);
        console.log("A socket disconnected: %s sockets connected", connections.length);
    });
    
    socket.on('send candidate', function() {
        io.sockets.emit('players', "hej");
    });
              
})
 });